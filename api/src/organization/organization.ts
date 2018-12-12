import logger from "../lib/logger";
import * as SymmetricCrypto from "../lib/symmetricCrypto";
import { MultichainClient } from "../multichain/Client.h";
import { Organization, WalletAddress } from "../network/model/Nodes";
import { organizationStreamName } from "./streamNames";

interface GetaddressesItem {
  address: string;
  ismine: boolean;
  iswatchonly: boolean;
  isscript: boolean;
  pubkey: string;
  iscompressed: boolean;
  account: string;
  synchronized: boolean;
}

interface OrganizationAddressItem {
  address: WalletAddress;
  privkey: string;
}

export async function ensureOrganizationStream(
  multichain: MultichainClient,
  organization: Organization,
  organizationVaultSecret: string,
): Promise<void> {
  await multichain.getOrCreateStream({
    kind: "organization",
    name: organizationStreamName(organization),
  });

  const organizationAddress = await ensureOrganizationAddress(
    multichain,
    organization,
    organizationVaultSecret,
  );
  logger.info(`Organization address: ${organizationAddress}`);
}

async function ensureOrganizationAddress(
  multichain: MultichainClient,
  organization: Organization,
  organizationVaultSecret: string,
): Promise<string> {
  const addressFromStream = await getOrganizationAddressItem(multichain, organization);
  if (addressFromStream) {
    // The organization already has its address set -> no need to use the local wallet
    // address.
    logger.info(`Organization address already set: ${addressFromStream.address}`);
    logger.debug(`Importing private key...`);
    await multichain
      .getRpcClient()
      .invoke(
        "importprivkey",
        SymmetricCrypto.decrypt(organizationVaultSecret, addressFromStream.privkey),
      );
    logger.info(`${addressFromStream.address} is ready to be used in transactions.`);
    return addressFromStream.address;
  } else {
    // Find the local wallet address and use it as the organization address:
    const addressFromWallet = await multichain
      .getRpcClient()
      // Retrive the oldest address:
      .invoke("listaddresses", "*", false, 1, 0)
      .then(addressInfos =>
        addressInfos
          .filter((info: GetaddressesItem) => info.ismine)
          .map((info: GetaddressesItem) => info.address)
          .find(_ => true),
      );
    if (!addressFromWallet) {
      const message = "Could not obtain wallet address!";
      logger.error({ error: { multichain, organization } }, message);
      throw Error(message);
    }

    const privkeyCiphertext = await multichain
      .getRpcClient()
      .invoke("dumpprivkey", addressFromWallet)
      .then(plaintext => SymmetricCrypto.encrypt(organizationVaultSecret, plaintext));

    logger.info(`Initializing organization address to local wallet address: ${addressFromWallet}`);
    const streamName = organizationStreamName(organization);
    const streamItemKey = "address";
    const orgaAddressItem: OrganizationAddressItem = {
      address: addressFromWallet,
      privkey: privkeyCiphertext,
    };
    const streamItem = { json: orgaAddressItem };
    logger.debug(`Publishing wallet address to ${streamName}/${streamItemKey}`);
    await multichain.getRpcClient().invoke("publish", streamName, streamItemKey, streamItem);
    return addressFromWallet;
  }
}

export async function getOrganizationAddress(
  multichain: MultichainClient,
  organization: Organization,
): Promise<WalletAddress | undefined> {
  const item = await getOrganizationAddressItem(multichain, organization);
  if (item) return item.address;
  else return undefined;
}

async function getOrganizationAddressItem(
  multichain: MultichainClient,
  organization: Organization,
): Promise<OrganizationAddressItem | undefined> {
  const streamName = organizationStreamName(organization);
  const streamItem = "address";
  return multichain
    .v2_readStreamItems(streamName, streamItem, 1)
    .then(items => items.map(x => x.data.json))
    .then(items => items.find(_ => true));
}
