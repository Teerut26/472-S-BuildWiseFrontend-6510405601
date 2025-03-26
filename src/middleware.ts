/* eslint-disable @typescript-eslint/no-empty-function */
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
export default withAuth(async function middleware(req) {}, {
  callbacks: {
    authorized: ({ token, req }) => {
      if (token) {
        return true;
      }
      return false;
    },
  },
});

export const config = {
  matcher: [
    "/client/:path*",
    "/job/:path*",
    "/material/:path*",
    "/project/:path*",
    "/supplier/:path*",
    "/company/:path*",
    "/"
  ],
};
