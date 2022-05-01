import type { GetSession, Handle } from "@sveltejs/kit";
import { getSessionInfo } from "./routes/api/session";

export const getSession: GetSession = async (event) => {
  return event.locals.session || null;
};

export const handle: Handle = async ({ event, resolve }) => {
  event.locals.session = await getSessionInfo(event.request);

  const response = await resolve(event);

  return response;
};
