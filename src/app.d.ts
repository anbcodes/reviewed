/// <reference types="@sveltejs/kit" />
declare namespace App {
  interface Locals {
    session: Session;
  }

  interface Platform {}

  interface Session {
    user: {
      name: string;
      id: string;
    };
    id: string;
  }

  interface Stuff {}
}
