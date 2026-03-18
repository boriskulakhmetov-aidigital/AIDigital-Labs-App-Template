import type { Context } from '@netlify/functions';
import { verifyAuth } from './_shared/auth.ts';
import { getDb } from './_shared/db.ts';

export default async (req: Request, _context: Context) => {
  try {
    const userId = await verifyAuth(req.headers.get('authorization'));
    const sql = getDb();
    const url = new URL(req.url);

    // TODO: Implement admin queries
    // The AdminPanel component from the design system calls these patterns:
    // GET ?domain=...       → return { users: [...] }
    // GET ?userId=...       → return { sessions: [...] }
    // GET ?action=set_user_status&userId=...&status=... → update user status
    // GET ?action=set_org_status&domain=...&status=...  → update org status
    // GET (no params)       → return { accounts: [...] }

    return Response.json({ accounts: [] });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
};
