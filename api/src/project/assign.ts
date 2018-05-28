import { throwIfUnauthorized } from "../authz";
import Intent from "../authz/intents";
import { AuthToken } from "../authz/token";
import { AuthenticatedRequest, HttpResponse } from "../httpd/lib";
import { isNonemptyString, value } from "../lib/validation";
import { MultichainClient } from "../multichain";
import { Event } from "../multichain/event";
import { notifyAssignee } from "../notification/create";
import * as Notification from "../notification/model/Notification";
import * as Project from "./model/Project";

export const assignProject = async (
  multichain: MultichainClient,
  req: AuthenticatedRequest,
): Promise<HttpResponse> => {
  const input = value("data", req.body.data, x => x !== undefined);

  const projectId: string = value("projectId", input.projectId, isNonemptyString);
  const userId: string = value("userId", input.userId, isNonemptyString);

  const userIntent: Intent = "project.assign";

  // Is the user allowed to (re-)assign a project?
  await throwIfUnauthorized(
    req.token,
    userIntent,
    await Project.getPermissions(multichain, projectId),
  );

  const publishedEvent = await sendEventToDatabase(
    multichain,
    req.token,
    userIntent,
    userId,
    projectId,
  );

  const resourceDescriptions: Notification.NotificationResourceDescription[] = [
    { id: projectId, type: "project" },
  ];
  const createdBy = req.token.userId;
  const skipNotificationsFor = [req.token.userId];
  await notifyAssignee(
    multichain,
    resourceDescriptions,
    createdBy,
    await Project.get(
      multichain,
      req.token,
      projectId,
      "skip authorization check FOR INTERNAL USE ONLY TAKE CARE DON'T LEAK DATA !!!",
    ),
    publishedEvent,
    skipNotificationsFor,
  );

  return [200, { apiVersion: "1.0", data: "OK" }];
};

async function sendEventToDatabase(
  multichain: MultichainClient,
  token: AuthToken,
  userIntent: Intent,
  userId: string,
  projectId: string,
): Promise<Event> {
  const event = {
    intent: userIntent,
    createdBy: token.userId,
    creationTimestamp: new Date(),
    dataVersion: 1,
    data: { userId },
  };
  const publishedEvent = await Project.publish(multichain, projectId, event);
  return publishedEvent;
}
