import { prisma } from "$lib/db";
import type { RequestHandler } from "@sveltejs/kit";

export const post: RequestHandler = async (
  { request, locals: { session } },
) => {
  if (!session) {
    return { body: { error: "Not logged in" } };
  }

  const { content } = await request.json();

  if (!content || typeof content !== "string") {
    return { body: { error: "Post can not be empty" } };
  }

  const post = await prisma.post.create({
    data: {
      authorId: session.user.id,
      content,
    },
    include: {
      author: true,
      children: true,
    },
  });

  return {
    body: {
      post,
    },
  };
};
