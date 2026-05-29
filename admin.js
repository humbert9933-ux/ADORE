const STORAGE_KEY = "adoreBookings";
const services = [
  "Facial personalizado",
  "Dermaplaning glow",
  "Hidratación profunda",
  "Bronceado brasilero",
  "Bronceado normal",
  "Baño de luna",
  "Masaje relax",
  "Solarium",
];

const readBookings = () => JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

const render = () => {
  const bookings = readBookings();
  const counts = bookings.reduce((acc, booking) => {
    acc[booking.treatment] = (acc[booking.treatment] || 0) + 1;
    return acc;
  }, {});
  const topService = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || "-";

  document.querySelector("#totalBookings").textContent = bookings.length;
  document.querySelector("#pendingBookings").textContent = bookings.filter((booking) => booking.status === "Pendiente").length;
  document.querySelector("#topService").textContent = topService;

  document.querySelector("#bookingRows").innerHTML = bookings.length
    ? bookings.map((booking) => `<tr><td>${booking.name}</td><td>${booking.treatment}</td><td>${booking.date || "Sin fecha"}</td><td>${booking.phone}</td><td>${booking.status}</td></tr>`).join("")
    : '<tr><td colspan="5">No hay reservas guardadas.</td></tr>';

  document.querySelector("#serviceList").innerHTML = services.map((service) => `<div class="service-item"><strong>${service}</strong><span>Activo</span></div>`).join("");
};

document.querySelector("#clearData").addEventListener("click", () => {
  localStorage.setItem(STORAGE_KEY, "[]");
  render();
});

render();
