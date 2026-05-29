const http = require("node:http");
const fs = require("node:fs/promises");
const path = require("node:path");
const crypto = require("node:crypto");

const PORT = Number(process.env.PORT || 4173);
const HOST = process.env.HOST || "0.0.0.0";
const ROOT = __dirname;
const DATA_DIR = path.join(ROOT, "data");
const BOOKINGS_FILE = path.join(DATA_DIR, "bookings.json");

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
};

const demoBookings = [
  { name: "Carla Mendez", phone: "73903259", treatment: "Facial personalizado", date: "2026-06-01", status: "Pendiente" },
  { name: "Andrea Roca", phone: "74670709", treatment: "Bronceado brasilero", date: "2026-06-01", status: "Confirmada" },
  { name: "Maria Vargas", phone: "72184510", treatment: "Medic spa", date: "2026-06-02", status: "Pendiente" },
  { name: "Sofia Rivero", phone: "70011223", treatment: "Baño de luna", date: "2026-05-31", status: "Completada" },
];

const sendJson = (response, statusCode, payload) => {
  response.writeHead(statusCode, { "content-type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(payload));
};

const readBody = (request) =>
  new Promise((resolve, reject) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        request.destroy();
        reject(new Error("Body too large"));
      }
    });
    request.on("end", () => resolve(body ? JSON.parse(body) : {}));
    request.on("error", reject);
  });

const ensureDataFile = async () => {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(BOOKINGS_FILE);
  } catch {
    await fs.writeFile(BOOKINGS_FILE, "[]\n", "utf8");
  }
};

const readBookings = async () => {
  await ensureDataFile();
  const raw = await fs.readFile(BOOKINGS_FILE, "utf8");
  return JSON.parse(raw || "[]");
};

const writeBookings = async (bookings) => {
  await ensureDataFile();
  await fs.writeFile(BOOKINGS_FILE, `${JSON.stringify(bookings, null, 2)}\n`, "utf8");
};

const normalizeBooking = (booking) => ({
  id: booking.id || crypto.randomUUID(),
  name: String(booking.name || "Sin nombre").trim(),
  phone: String(booking.phone || "").trim(),
  treatment: String(booking.treatment || "Facial personalizado").trim(),
  date: String(booking.date || "").trim(),
  status: String(booking.status || "Pendiente").trim(),
  createdAt: booking.createdAt || new Date().toISOString(),
});

const handleApi = async (request, response, url) => {
  if (url.pathname === "/api/bookings" && request.method === "GET") {
    sendJson(response, 200, await readBookings());
    return true;
  }

  if (url.pathname === "/api/bookings" && request.method === "POST") {
    const payload = await readBody(request);
    const bookings = await readBookings();
    const booking = normalizeBooking(payload);
    bookings.unshift(booking);
    await writeBookings(bookings);
    sendJson(response, 201, booking);
    return true;
  }

  if (url.pathname === "/api/bookings" && request.method === "DELETE") {
    await writeBookings([]);
    sendJson(response, 200, { ok: true });
    return true;
  }

  if (url.pathname === "/api/bookings/seed" && request.method === "POST") {
    const seeded = demoBookings.map(normalizeBooking);
    await writeBookings(seeded);
    sendJson(response, 200, seeded);
    return true;
  }

  const statusMatch = url.pathname.match(/^\/api\/bookings\/([^/]+)$/);
  if (statusMatch && request.method === "PATCH") {
    const payload = await readBody(request);
    const bookings = await readBookings();
    const id = decodeURIComponent(statusMatch[1]);
    const nextBookings = bookings.map((booking) =>
      booking.id === id ? { ...booking, status: String(payload.status || booking.status) } : booking
    );
    await writeBookings(nextBookings);
    sendJson(response, 200, nextBookings.find((booking) => booking.id === id) || null);
    return true;
  }

  return false;
};

const serveStatic = async (request, response, url) => {
  const requestedPath = url.pathname === "/" ? "/index.html" : decodeURIComponent(url.pathname);
  const filePath = path.normalize(path.join(ROOT, requestedPath));

  if (!filePath.startsWith(ROOT)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  try {
    const data = await fs.readFile(filePath);
    const ext = path.extname(filePath).toLowerCase();
    response.writeHead(200, { "content-type": contentTypes[ext] || "application/octet-stream" });
    response.end(data);
  } catch {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    response.end("Not found");
  }
};

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url, `http://${request.headers.host}`);

  try {
    if (url.pathname.startsWith("/api/") && (await handleApi(request, response, url))) {
      return;
    }

    await serveStatic(request, response, url);
  } catch (error) {
    sendJson(response, 500, { error: error.message });
  }
});

server.listen(PORT, HOST, () => {
  console.log(`ADORE server running at http://${HOST}:${PORT}`);
});
