const form = document.querySelector(".booking-form");
const STORAGE_KEY = "adoreBookings";

form?.addEventListener("submit", (event) => {
  event.preventDefault();

  const button = form.querySelector("button");
  const originalText = button.textContent;
  const formData = new FormData(form);
  const bookings = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

  bookings.unshift({
    name: formData.get("name") || "Sin nombre",
    phone: formData.get("phone") || "",
    treatment: formData.get("treatment") || "Facial personalizado",
    date: formData.get("date") || "",
    status: "Pendiente",
    createdAt: new Date().toISOString(),
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
  button.textContent = "Solicitud enviada";
  button.disabled = true;

  window.setTimeout(() => {
    button.textContent = originalText;
    button.disabled = false;
    form.reset();
  }, 2200);
});
