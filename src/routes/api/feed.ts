import { prisma } from "$lib/db";
import type { RequestHandler } from "@sveltejs/kit";

export const get: RequestHandler = async ({ request }) => {
  const posts = await prisma.post.findMany({
    orderBy: {
      created: "desc",
    },
    include: {
      author: true,
      parent: {
        include: { author: true },
      },
    },
  });

  return {
    body: {
      posts,
    },
  };
};
