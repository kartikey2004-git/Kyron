import { createAuthClient } from "better-auth/react"; //function that helps us create an authentication client

/*

  - Create an instance of the auth client with a baseURL pointing to our backend API

  - This tells the client where to send authentication requests (sign-in, sign-up, etc.)
  
*/

export const { signIn, signUp, useSession, signOut } = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL, // Backend server address
});

// main auth functions (signIn, signUp, useSession) : functions will be used in React components to handle authentication

/*
  
   - createAuthClient() sets up communication with your backend.

   - authClient is the instance that carries config (like baseURL).

   - useSession → React hook to check if a user is logged in (and get their session info).

*/
