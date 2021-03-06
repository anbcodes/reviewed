/// <reference types="@sveltejs/kit" />
declare namespace App {
  interface Locals {
    session?: Session;
  }

  // interface Platform {}

  interface Session {
    user: {
      name: string;
      lastPosted: Date;
      created: Date;
      sensitiveId: string;
      review: {
        postId: string;
        post: {
          content: string;
        }, 
      }
      id: string;
    };
    id: string;
  }

  // interface Stuff {}
}
