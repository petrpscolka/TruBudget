import Intent from "../../authz/intents";
import { MultichainClient } from "../../multichain/Client.h";
import { Event, throwUnsupportedEventVersion } from "../../multichain/event";

// Allows a custom ordering among workflowitems. Note that not all workflowitems need
// to be included; those that aren't are simply ordered by their ctime and concatenated
// to what's specified here.
export type WorkflowitemOrdering = string[];
function workflowitemOrderingKey(subprojectId: string): string {
  return `${subprojectId}_workflowitem_ordering`;
}

export async function publishWorkflowitemOrderingUpdate(
  multichain: MultichainClient,
  projectId: string,
  subprojectId: string,
  args: {
    createdBy: string;
    creationTimestamp: Date;
    ordering: string[];
  },
): Promise<void> {
  const { createdBy, creationTimestamp, ordering } = args;
  const intent: Intent = "subproject.reorderWorkflowitems";
  const event: Event = {
    key: subprojectId,
    intent,
    createdBy,
    createdAt: creationTimestamp.toISOString(),
    dataVersion: 1,
    data: ordering,
  };
  return multichain
    .getRpcClient()
    .invoke("publish", projectId, workflowitemOrderingKey(subprojectId), {
      json: event,
    });
}

export async function fetchWorkflowitemOrdering(
  multichain: MultichainClient,
  projectId: string,
  subprojectId: string,
): Promise<WorkflowitemOrdering> {
  // Currently, the workflowitem ordering is stored in full; therefore, we only
  // need to retrieve the latest item(see`publishWorkflowitemOrdering`).
  const expectedDataVersion = 1;
  const nValues = 1;

  const streamItems = await multichain
    .v2_readStreamItems(projectId, workflowitemOrderingKey(subprojectId), nValues)
    .catch(err => {
      if (err.kind === "NotFound") {
        return [{ data: { json: { dataVersion: 1, data: [] } } }];
      } else {
        throw err;
      }
    });

  const item = streamItems[0];
  const event = item.data.json as Event;
  if (event.dataVersion !== expectedDataVersion) {
    throwUnsupportedEventVersion(event);
  }

  const ordering: string[] = event.data;
  return ordering;
}