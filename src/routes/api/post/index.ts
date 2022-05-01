import { prisma } from "$lib/db";
import type { RequestHandler } from "@sveltejs/kit";

export const post: RequestHandler = async (
  { request, locals: { session } },
) => {
  if (!session) {
    return { body: { error: "Not logged in" } };
  }

  const { content, parentId } = await request.json();

  if (!content || typeof content !== "string") {
    return { body: { error: "Post can not be empty" } };
  }

  if (parentId && typeof parentId !== "string") {
    return { body: { error: "Invalid parentId" } };
  }

  const post = await prisma.post.create({
    data: {
      authorId: session.user.id,
      parentId: parentId || undefined, 
      content,
    },
    include: {
      author: true,
      children: true,
      parent: true,
    },
  });

  return {
    body: {
      post,
    },
  };
};
