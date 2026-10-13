// // export const runtime = 'edge';

import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function GET(request: Request) {
  try {
    let db = process.env.DB as any;
    if (!db) {
      try {
        db = await getCloudflareContext({ async: true }).then(ctx => ctx.env.DB);
      } catch(e) {}
    }
    if (!db) {
      console.log("No DB binding found");
      return new Response(JSON.stringify({ error: "DB binding not found" }), { status: 500 });
    }

    // Join customers and records
    const customersResult = await db.prepare('SELECT * FROM customers ORDER BY createdAt DESC').all();
    const recordsResult = await db.prepare('SELECT * FROM records').all();

    const customers = customersResult.results.map((c: any) => ({
      ...c,
      records: recordsResult.results.filter((r: any) => r.customerId === c.id)
    }));

    return new Response(JSON.stringify(customers), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    let db = process.env.DB as any;
    if (!db) {
      try {
        db = await getCloudflareContext({ async: true }).then(ctx => ctx.env.DB);
      } catch(e) {}
    }
    if (!db) throw new Error("DB binding not found");
    const body = (await request.json()) as any;
    const { name, birthdate, gender, notes } = body;

    const result = await db.prepare(
      'INSERT INTO customers (name, birthdate, gender, notes) VALUES (?, ?, ?, ?) RETURNING id'
    ).bind(name, birthdate, gender, notes || '').first();

    return new Response(JSON.stringify({ id: result?.id }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
