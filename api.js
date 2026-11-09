// Anonyme Abgaben für die Doppelstunde „Was brauchst du wirklich?“
// Es gibt immer genau eine laufende Runde. Jede Abgabe liegt unter
// r/<runde>/<station>/<geräte-id> in Netlify Blobs. Es werden keine Namen,
// Konten oder IP-Adressen gespeichert.
import { getStore } from "@netlify/blobs";

const STATIONS = new Set(["s1", "s2v", "s2a", "s2d", "s3", "s3f", "s4", "s5h", "s5"]);
const SID = /^[A-Za-z0-9]{8,40}$/;
const RID = /^[a-z0-9]{4,24}$/;

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });

const lehrerPin = () => (globalThis.Netlify?.env?.get("LEHRER_PIN") || process.env.LEHRER_PIN || "").trim();
const pinOk = (req) => {
  const pin = lehrerPin();
  return !pin || req.headers.get("x-lehrer-pin") === pin;
};
const newId = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);

async function aktuelleRunde(store) {
  const r = await store.get("meta/runde", { type: "json" });
  if (r && RID.test(r.id || "")) return r;
  // Erste Runde überhaupt: feste Kennung, damit gleichzeitige Aufrufe dieselbe erzeugen.
  const first = { id: "start", start: Date.now() };
  await store.setJSON("meta/runde", first);
  return first;
}

export default async (req) => {
  const url = new URL(req.url);
  const route = url.pathname.replace(/^\/api\/?/, "").replace(/\/$/, "");
  const store = getStore({ name: "sinnsuche", consistency: "strong" });

  try {
    if (route === "ping" && req.method === "GET") {
      const runde = await aktuelleRunde(store);
      return json({ ok: true, pinRequired: !!lehrerPin(), runde });
    }

    if (route === "submit" && req.method === "POST") {
      const raw = await req.text();
      if (raw.length > 4000) return json({ error: "Abgabe zu lang" }, 413);
      let body;
      try { body = JSON.parse(raw); } catch { return json({ error: "Ungültige Abgabe" }, 400); }
      const { runde: rid, station, sid, data } = body || {};
      if (!STATIONS.has(station) || !SID.test(sid || "") || !data || typeof data !== "object" || Array.isArray(data)) {
        return json({ error: "Ungültige Abgabe" }, 400);
      }
      const runde = await aktuelleRunde(store);
      // Antworten aus einer beendeten Runde (z. B. nachgesendet) werden verworfen.
      if (rid !== runde.id) return json({ error: "Runde beendet", runde }, 409);
      await store.setJSON(`r/${runde.id}/${station}/${sid}`, { data, t: Date.now() });
      return json({ ok: true, runde });
    }

    if (route === "results" && req.method === "GET") {
      if (!pinOk(req)) return json({ error: "PIN erforderlich" }, 401);
      const runde = await aktuelleRunde(store);
      const { blobs } = await store.list({ prefix: `r/${runde.id}/` });
      const entries = await Promise.all(
        blobs.map(async ({ key }) => {
          const v = await store.get(key, { type: "json" });
          return v ? { station: key.split("/")[2], data: v.data, t: v.t } : null;
        })
      );
      return json({ runde, entries: entries.filter(Boolean), pinRequired: !!lehrerPin() });
    }

    if (route === "runde" && req.method === "POST") {
      if (!pinOk(req)) return json({ error: "PIN erforderlich" }, 401);
      // Alle Antworten früherer Runden löschen, dann eine neue Runde beginnen.
      const { blobs } = await store.list({ prefix: "r/" });
      await Promise.all(blobs.map((b) => store.delete(b.key)));
      const runde = { id: newId(), start: Date.now() };
      await store.setJSON("meta/runde", runde);
      return json({ ok: true, runde, deleted: blobs.length });
    }

    return json({ error: "Nicht gefunden" }, 404);
  } catch (e) {
    console.error(e);
    return json({ error: "Serverfehler" }, 500);
  }
};

export const config = { path: "/api/*" };
