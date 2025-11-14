import { httpRouter } from "convex/server";
import { authComponent, createAuth } from "./auth";

const http = httpRouter();

// Register Better Auth routes
authComponent.registerRoutes(http, createAuth);

// Add additional HTTP endpoints here
// Example:
// http.route({
//   path: "/webhook",
//   method: "POST",
//   handler: httpAction(async (ctx, request) => {
//     const data = await request.json();
//     // Handle webhook
//     return new Response(null, { status: 200 });
//   }),
// });

export default http;
