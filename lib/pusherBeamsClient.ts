import * as PusherPushNotifications from "@pusher/push-notifications-web";

   let beamsClient: PusherPushNotifications.Client | null = null;

   export function getBeamsClient() {
     if (!beamsClient) {
       beamsClient = new PusherPushNotifications.Client({
         instanceId: process.env.NEXT_PUBLIC_PUSHER_BEAMS_INSTANCE_ID!,
       });
     }
     return beamsClient;
   }

   export function initializeBeams() {
     const client = getBeamsClient();
     return client.start()
       .then(() => console.log('Pusher Beams initialized'))
       .catch(console.error);
   }