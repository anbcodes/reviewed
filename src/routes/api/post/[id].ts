import { prisma } from "$lib/db";
import type { RequestHandler } from "@sveltejs/kit";

export const get: RequestHandler = async ({ request, params }) => {
  const { id } = params;

  const post = await prisma.post.findUnique({
    where: { id },
    include: { author: true, children: {
      include: {author: true},
    }, parent: {
      include: {author: true}
    } },
  });

  return {
    body: {
      post,
    },
  };
};
