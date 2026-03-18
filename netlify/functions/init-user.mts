import type { Context } from '@netlify/functions';
import { verifyAuth } from './_shared/auth.ts';
import { getDb } from './_shared/db.ts';

export default async (req: Request, _context: Context) => {
  try {
    const userId = await verifyAuth(req.headers.get('authorization'));
    const sql = getDb();

    // TODO: Create your users table and check/insert user
    // const rows = await sql`SELECT status, session_count FROM users WHERE clerk_id = ${userId}`;
    // if (rows.length === 0) {
    //   await sql`INSERT INTO users (clerk_id, status) VALUES (${userId}, 'active')`;
    //   return Response.json({ status: 'active', session_count: 0 });
    // }

    return Response.json({ status: 'active', session_count: 0 });
  } catch (err) {
    return Response.json({ status: 'active' }, { status: 200 });
  }
};
