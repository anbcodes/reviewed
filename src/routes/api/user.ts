import * as argon2 from "argon2";
import { prisma } from "$lib/db";
import type { RequestHandler } from "@sveltejs/kit";
import { makeSessionCookie } from "./session";

export const post: RequestHandler = async ({ request }) => {
  const { name, email, password, confirmPassword } = await request.json();

  if (
    typeof name !== "string" || typeof email !== "string" ||
    typeof password !== "string" || typeof confirmPassword !== "string"
  ) {
    return { body: { error: "All fields are required to be strings" } };
  }

  if (!name || !email || !password || !confirmPassword) {
    return { body: { error: "All fields are required" } };
  }

  // From https://www.emailregex.com/
  const emailRegex =
    /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/g;
  if (!email.match(emailRegex)) {
    return { body: { error: "Invalid email" } };
  }

  if (password.length < 8) {
    return { body: { error: "Password must be at least 8 characters" } };
  }

  if (password !== confirmPassword) {
    return { body: { error: "Passwords must match" } };
  }

  const hash = await argon2.hash(password);

  const sensitiveData = await prisma.userSensitive.create({
    data: {
      hash,
      email,
    },
  });

  const user = await prisma.user.create({
    data: {
      name,
      sensitiveId: sensitiveData.id,
    },
  });

  const session = await prisma.session.create({
    data: {
      userId: user.id,
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
