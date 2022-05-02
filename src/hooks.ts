import { prisma } from "$lib/db";
import type { GetSession, Handle } from "@sveltejs/kit";
import { getSessionInfo } from "./routes/api/session";

export const getSession: GetSession = async (event) => {
  return event.locals.session || null;
};

export const handle: Handle = async ({ event, resolve }) => {
  event.locals.session = await getSessionInfo(event.request);

  if (event.locals.session) {
    prisma.session.update({
      where: {
        id: event.locals.session.id
      },
      data: {
        lastActive: new Date(),
      }})
  }

  console.log("session", event.request.headers.get('cookie'), "set to", event.locals.session);

  if (event.url.pathname.startsWith('/api') && event.locals.session?.user?.review) {
    return new Response(JSON.stringify({
        error: "You must review a post",
        session: event.locals.session
      }));
  }

  const response = await resolve(event);

  return response;
};
