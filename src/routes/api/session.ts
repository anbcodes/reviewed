import * as argon2 from "argon2";
import type { RequestHandler } from "@sveltejs/kit";
import { parse } from "cookie";
import { prisma } from "$lib/db";

export const getSessionInfo = async (request: Request) => {
  const cookies = parse(request.headers.get("cookie") || "");
  if (cookies.session) {
    console.log("SEARCHING FOR ", cookies.session);
    const session = await prisma.session.findUnique({
      where: {
        id: cookies.session,
      },
      include: {
        user: true,
      },
    });
    console.log(session);
    return session;
  }
  return undefined;
};

export const makeSessionCookie = (sessionId: string) =>
  `session=${sessionId}; Path=/; HttpOnly; SameSite=lax; Expires=${
    (new Date(2025, 0)).toUTCString()
  }`;

export const post: RequestHandler = async ({ request }) => {
  const { email, password } = await request.json();

  if (
    !email || !password || typeof email !== "string" ||
    typeof password !== "string"
  ) {
    return { body: { error: "Email and password required" } };
  }

  const userSensitive = await prisma.userSensitive.findUnique({
    where: {
      email,
    },
    include: {
      user: true,
    },
  });

  if (!userSensitive) {
    return { body: { error: "User does not exist" } };
  }

  if (!argon2.verify(userSensitive.hash, password)) {
    return { body: { error: "Invalid password" } };
  }

  const session = await prisma.session.create({
    data: {
      userId: userSensitive.user.id,
    },
    include: {
      user: true,
    },
  });

  return {
    headers: {
      "set-cookie": [makeSessionCookie(session.id)],
    },
    body: {
      session,
    },
  };
};

export const del: RequestHandler = async ({ request: { headers } }) => {
  const cookies = parse(headers.get("cookie") || "");
  if (cookies.session) {
    await prisma.session.delete({
      where: {
        id: cookies.session,
      },
    });

    return {
      headers: {
        "set-cookie": ["session="],
      },
      body: {
        success: true,
      },
    };
  }

  return {
    body: {
      error: "No session",
    },
  };
};
