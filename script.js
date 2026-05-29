const form = document.querySelector(".booking-form");
const STORAGE_KEY = "adoreBookings";

const createBooking = async (booking) => {
  try {
    const response = await fetch("/api/bookings", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(booking),
    });

    if (!response.ok) {
      throw new Error("No se pudo guardar en el servidor");
    }

    return response.json();
  } catch {
    const bookings = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    bookings.unshift(booking);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
    return booking;
  }
};

form?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const button = form.querySelector("button");
  const originalText = button.textContent;
  const formData = new FormData(form);

  button.textContent = "Enviando...";
  button.disabled = true;

  await createBooking({
    name: formData.get("name") || "Sin nombre",
    phone: formData.get("phone") || "",
    treatment: formData.get("treatment") || "Facial personalizado",
    date: formData.get("date") || "",
    status: "Pendiente",
    createdAt: new Date().toISOString(),
  });

  button.textContent = "Solicitud enviada";

  window.setTimeout(() => {
    button.textContent = originalText;
    button.disabled = false;
    form.reset();
  }, 2200);
});
