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
    const { id: idStr } = await params;
    const id = parseInt(idStr, 10);
    const body = await request.json();
    const { name, birthdate, gender, notes } = body;

    await db.prepare(
      'UPDATE customers SET name = ?, birthdate = ?, gender = ?, notes = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?'
    ).bind(name, birthdate, gender, notes || '', id).run();

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
    const { id: idStr } = await params;
    const id = parseInt(idStr, 10);

    // Records are automatically deleted due to ON DELETE CASCADE
    await db.prepare('DELETE FROM customers WHERE id = ?').bind(id).run();

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
