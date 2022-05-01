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

  const sinceLastPost = +new Date() - +session.user.lastPosted;

  if (sinceLastPost < 1000 * 60 * 10) {
    return { body: { error: `You can only post every 10 minutes (${10-Math.round(sinceLastPost / 1000 / 60)} min until you can post again)` } }
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

  await prisma.user.update({
    where: {
      id: session.user.id
    },
    data: {
      lastPosted: new Date(),
    }
  })

  return {
    body: {
      post,
    },
  };
};
