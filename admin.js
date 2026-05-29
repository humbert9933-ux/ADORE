const STORAGE_KEY = "adoreBookings";

const demoBookings = [
  { name: "Carla Mendez", phone: "73903259", treatment: "Facial personalizado", date: "2026-06-01", status: "Pendiente" },
  { name: "Andrea Roca", phone: "74670709", treatment: "Bronceado brasilero", date: "2026-06-02", status: "Confirmada" },
  { name: "Maria Vargas", phone: "72184510", treatment: "Medic spa", date: "2026-06-03", status: "Atendida" }
];

let currentBookings = [];

const api = async (url, options = {}) => {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error("Error en comunicación API");
  return res.json();
};

const readBookings = async () => {
  try {
    return await api("/api/bookings");
  } catch {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  }
};

const writeLocalBookings = (bookings) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
};

const renderBookings = async () => {
  const filter = document.querySelector("#statusFilter").value;
  const tbody = document.querySelector("#bookingRows");
  
  try {
    currentBookings = await readBookings();
  } catch {
    currentBookings = [];
  }

  const filtered = currentBookings.filter(b => filter === "Todos" || b.status === filter);

  tbody.innerHTML = filtered.map(booking => `
    <tr>
      <td><strong>${booking.name}</strong></td>
      <td><a href="https://wa.me/591${booking.phone}" target="_blank" style="color:#d9ad63;">📞 ${booking.phone}</a></td>
      <td>${booking.treatment}</td>
      <td>${booking.date}</td>
      <td>
        <select class="status-select" data-id="${booking.id}">
          <option value="Pendiente" ${booking.status === "Pendiente" ? "selected" : ""}>Pendiente</option>
          <option value="Confirmada" ${booking.status === "Confirmada" ? "selected" : ""}>Confirmada</option>
          <option value="Atendida" ${booking.status === "Atendida" ? "selected" : ""}>Atendida</option>
          <option value="Cancelada" ${booking.status === "Cancelada" ? "selected" : ""}>Cancelada</option>
        </select>
      </td>
    </tr>
  `).join("");
};

document.querySelector("#statusFilter").addEventListener("change", renderBookings);

document.querySelector("#bookingRows").addEventListener("change", async (event) => {
  if (!event.target.matches(".status-select")) return;

  const id = event.target.dataset.id;
  const status = event.target.value;

  try {
    await api(`/api/bookings/${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ status }),
    });
  } catch {
    const updated = currentBookings.map(b => b.id == id ? { ...b, status } : b);
    writeLocalBookings(updated);
  }
  renderBookings();
});

document.querySelector("#seedData").addEventListener("click", async () => {
  try {
    await api("/api/bookings/seed", { method: "POST" });
  } catch {
    const freshDemos = demoBookings.map(b => ({
      ...b,
      id: Math.random().toString(36).substring(2),
      createdAt: new Date().toISOString()
    }));
    writeLocalBookings(freshDemos);
  }
  renderBookings();
});

document.querySelector("#clearData").addEventListener("click", async () => {
  if (!confirm("¿Seguro que deseas eliminar todas las reservas de la lista?")) return;
  try {
    await api("/api/bookings", { method: "DELETE" });
  } catch {
    writeLocalBookings([]);
  }
  renderBookings();
});

// Carga inicial al abrir la página
window.addEventListener("DOMContentLoaded", renderBookings);
