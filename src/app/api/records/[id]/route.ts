// export const runtime = 'edge';

import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    let db = process.env.DB as any;
    if (!db) {
      try {
        db = await getCloudflareContext({ async: true }).then(ctx => ctx.env.DB);
      } catch(e) {}
    }
    if (!db) throw new Error("DB binding not found");
    const { id } = await params;
    const body = await request.json();
    const { content, summary, postMessage, customerId } = body; // If customerId is provided, we might be moving it

    if (customerId !== undefined) {
      // moving record to another customer
      await db.prepare(
        'UPDATE records SET customerId = ? WHERE id = ?'
      ).bind(customerId, id).run();
    } else {
      // updating record details
      await db.prepare(
        'UPDATE records SET content = ?, summary = ?, postMessage = ? WHERE id = ?'
      ).bind(content, summary || null, postMessage || null, id).run();
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    let db = process.env.DB as any;
    if (!db) {
      try {
        db = await getCloudflareContext({ async: true }).then(ctx => ctx.env.DB);
      } catch(e) {}
    }
    if (!db) throw new Error("DB binding not found");
    const { id } = await params;

    await db.prepare('DELETE FROM records WHERE id = ?').bind(id).run();

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
