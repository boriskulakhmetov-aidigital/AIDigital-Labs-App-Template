import { createClerkClient } from '@clerk/backend';

const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY! });

/** Verify Clerk JWT and return userId. Throws on invalid token. */
export async function verifyAuth(authHeader: string | null): Promise<string> {
  if (!authHeader?.startsWith('Bearer ')) throw new Error('Missing auth');
  const token = authHeader.slice(7);
  const { sub } = await clerk.verifyToken(token);
  if (!sub) throw new Error('Invalid token');
  return sub;
}
