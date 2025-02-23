import { httpRouter } from "convex/server";
import { Webhook } from "svix";

import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import type { WebhookEvent } from "@clerk/backend";


const handleClerkWebhook = httpAction(async (ctx, request) => {
  const event = await validateRequest(request);
  if (!event) {
    return new Response("Error occured", {
      status: 400,
    });
  }
  switch (event.type) {
    case "user.created": {
        await ctx.runMutation(internal.users.createUser, {
            clerkId: event.data.id,
            email: event.data.email_addresses[0].email_address,
            imageUrl: event.data.image_url,
            name: event.data.first_name!,
        });
        console.log("da den day chua");
        break;
      }
    case "user.updated": {
        await ctx.runMutation(internal.users.updateUser, {
            clerkId: event.data.id,
            imageUrl: event.data.image_url,
            email: event.data.email_addresses[0].email_address,
          });
          break;
    }
    case "user.deleted": {      
      await ctx.runMutation(internal.users.deleteUser, { 
        clerkId: event.data.id as string,
       });
      break;
    }    
  }
  return new Response(null, {
    status: 200,
  });
});

const http = httpRouter();
http.route({
  path: "/clerk",
  method: "POST",
  handler: handleClerkWebhook,
});

const validateRequest = async (
  req: Request
): Promise<WebhookEvent | undefined> => {
  // TODO: Update CLERK_WEBHOOK_SECRET
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET!;
    if(!webhookSecret) {
      throw new Error("CLERK_WEBHOOK_SECRET is not defined");
    }
  const payloadString = await req.text();

  const svixHeaders = {
    "svix-id": req.headers.get("svix-id")!,
    "svix-timestamp": req.headers.get("svix-timestamp")!,
    "svix-signature": req.headers.get("svix-signature")!,
  };
  const wh = new Webhook(webhookSecret);
  let evt: Event | null = null;
  try {
    evt = wh.verify(payloadString, svixHeaders) as Event;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_) {
    console.log("error verifying");
    return;
  }

  return evt as unknown as WebhookEvent;
}

export default http;