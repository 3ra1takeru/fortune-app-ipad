// // export const runtime = 'edge';

import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function POST(request: Request) {
  try {
    let db = process.env.DB as any;
    if (!db) {
      try {
        db = await getCloudflareContext({ async: true }).then(ctx => ctx.env.DB);
      } catch(e) {}
    }
    if (!db) throw new Error("DB binding not found");
    const body = await request.json();
    const { id, customerId, date, content, summary, postMessage, partnerName } = body;

    await db.prepare(
      'INSERT INTO records (id, customerId, date, content, summary, postMessage, partnerName) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).bind(
      id, 
      customerId, 
      date, 
      content, 
      summary || null, 
      postMessage || null, 
      partnerName || null
    ).run();

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
