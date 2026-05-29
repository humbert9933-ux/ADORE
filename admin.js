const STORAGE_KEY = "adoreBookings";

const services = [
  { name: "Facial personalizado", price: 180, active: true },
  { name: "Tratamiento corporal", price: 260, active: true },
  { name: "Medic spa", price: 320, active: true },
  { name: "Solarium", price: 140, active: true },
  { name: "Dermaplaning glow", price: 160, active: true },
  { name: "Hidratación profunda", price: 190, active: true },
  { name: "Bronceado brasilero", price: 220, active: true },
  { name: "Bronceado normal", price: 170, active: true },
  { name: "Baño de luna", price: 210, active: true },
  { name: "Masaje relax", price: 180, active: true },
  { name: "Radiofrecuencia", price: 240, active: true },
  { name: "Paquete Adóre completo", price: 520, active: true },
];

let currentBookings = [];

const demoBookings = [
  { name: "Carla Mendez", phone: "73903259", treatment: "Facial personalizado", date: "2026-06-01", status: "Pendiente" },
  { name: "Andrea Roca", phone: "74670709", treatment: "Bronceado brasilero", date: "2026-06-01", status: "Confirmada" },
  { name: "Maria Vargas", phone: "72184510", treatment: "Medic spa", date: "2026-06-02", status: "Pendiente" },
  { name: "Sofia Rivero", phone: "70011223", treatment: "Baño de luna", date: "2026-05-31", status: "Completada" },
];

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const currency = new Intl.NumberFormat("es-BO", {
  style: "currency",
  currency: "BOB",
  maximumFractionDigits: 0,
});

const priceFor = (serviceName) => services.find((service) => service.name === serviceName)?.price || 180;

const api = async (url, options) => {
  const response = await fetch(url, {
    headers: { "content-type": "application/json" },
    ...options,
  });

  if (!response.ok) {
    throw new Error("Servidor no disponible");
  }

  return response.json();
};

const readBookings = async () => {
  try {
    currentBookings = await api("/api/bookings");
  } catch {
    currentBookings = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  }

  return currentBookings;
};

const writeLocalBookings = (bookings) => {
  currentBookings = bookings;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
};

const renderMetrics = (bookings) => {
  const today = new Date().toISOString().slice(0, 10);
  const pending = bookings.filter((booking) => booking.status === "Pendiente");
  const revenue = bookings.reduce((total, booking) => total + priceFor(booking.treatment), 0);
  const counts = bookings.reduce((acc, booking) => {
    acc[booking.treatment] = (acc[booking.treatment] || 0) + 1;
    return acc;
  }, {});
  const topService = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || "-";

  document.querySelector("#todayBookings").textContent = bookings.filter((booking) => booking.date === today).length;
  document.querySelector("#estimatedRevenue").textContent = currency.format(revenue).replace("BOB", "Bs");
  document.querySelector("#pendingBookings").textContent = pending.length;
  document.querySelector("#topService").textContent = topService;
};

const statusOptions = (booking) =>
  ["Pendiente", "Confirmada", "Completada"]
    .map((status) => `<option value="${status}" ${booking.status === status ? "selected" : ""}>${status}</option>`)
    .join("");

const renderBookings = async () => {
  const filter = document.querySelector("#statusFilter").value;
  const rows = document.querySelector("#bookingRows");
  const bookings = await readBookings();
  const filtered = filter === "all" ? bookings : bookings.filter((booking) => booking.status === filter);

  rows.innerHTML = filtered
    .map(
      (booking) => `
        <tr>
          <td>${escapeHtml(booking.name)}</td>
          <td>${escapeHtml(booking.treatment)}</td>
          <td>${escapeHtml(booking.date || "Sin fecha")}</td>
          <td>${escapeHtml(booking.phone || "Sin dato")}</td>
          <td>
            <select class="status-select ${escapeHtml(booking.status || "").toLowerCase()}" data-id="${escapeHtml(booking.id || "")}">
              ${statusOptions(booking)}
            </select>
          </td>
        </tr>
      `
    )
    .join("");

  if (!filtered.length) {
    rows.innerHTML = '<tr><td colspan="5">No hay reservas con este filtro.</td></tr>';
  }

  renderMetrics(bookings);
};

const renderServices = () => {
  document.querySelector("#serviceList").innerHTML = services
    .map(
      (service) => `
        <div class="service-item">
          <div>
            <strong>${service.name}</strong>
            <span>${service.active ? "Activo" : "Pausado"}</span>
          </div>
          <strong>${currency.format(service.price).replace("BOB", "Bs")}</strong>
        </div>
      `
    )
    .join("");
};

document.querySelector("#statusFilter").addEventListener("change", renderBookings);

document.querySelector("#bookingRows").addEventListener("change", async (event) => {
  if (!event.target.matches(".status-select")) {
    return;
  }

  const id = event.target.dataset.id;
  const status = event.target.value;

  try {
    await api(`/api/bookings/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  } catch {
    writeLocalBookings(currentBookings.map((booking) => (booking.id === id ? { ...booking, status } : booking)));
  }

  await renderBookings();
});

document.querySelector("#seedData").addEventListener("click", async () => {
  try {
    await api("/api/bookings/seed", { method: "POST" });
  } catch {
    writeLocalBookings(demoBookings.map((booking) => ({ ...booking, id: crypto.randomUUID(), createdAt: new Date().toISOString() })));
  }

  await renderBookings();
});

document.querySelector("#clearData").addEventListener("click", async () => {
  try {
    await api("/api/bookings", { method: "DELETE" });
  } catch {
    writeLocalBookings([]);
  }

  await renderBookings();
});

renderServices();
renderBookings();
