import { NextApiRequest, NextApiResponse } from 'next';
const PushNotifications = require('@pusher/push-notifications-server');

const beamsClient = new PushNotifications({
  instanceId: process.env.NEXT_PUBLIC_PUSHER_BEAMS_INSTANCE_ID!,
  secretKey: process.env.PUSHER_BEAMS_PRIMARY_KEY!,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { user_id } = req.body;

  if (!user_id) {
    return res.status(400).json({ error: 'user_id is required' });
  }

  try {
    const beamsToken = await beamsClient.generateToken(user_id);
    res.status(200).json(beamsToken);
  } catch (error) {
    console.error('Error authenticating user:', error);
    res.status(500).json({ error: 'Error authenticating user' });
  }
}