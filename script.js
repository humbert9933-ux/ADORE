const form = document.querySelector(".booking-form");
const STORAGE_KEY = "adoreBookings";

const createBooking = async (booking) => {
  try {
    // Intenta enviar los datos al servidor API si está corriendo localmente
    const response = await fetch("/api/bookings", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(booking),
    });

    if (!response.ok) throw new Error("Usando almacenamiento alternativo");
    return response.json();
  } catch {
    // Respaldo automático ideal para cuando está alojado estáticamente en GitHub Pages
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

  button.textContent = "Procesando...";
  button.disabled = true;

  const newBooking = {
    id: typeof crypto.randomUUID === "function" ? crypto.randomUUID() : Math.random().toString(36).substring(2),
    name: formData.get("name") || "Sin nombre",
    phone: formData.get("phone") || "",
    treatment: formData.get("treatment") || "Facial personalizado",
    date: formData.get("date") || "",
    status: "Pendiente",
    createdAt: new Date().toISOString(),
  };

  await createBooking(newBooking);

  // META PIXEL DISPATCHER: Avisa a Facebook que se completó una reserva con éxito
  if (typeof fbq === "function") {
    fbq("track", "Schedule", {
      content_name: newBooking.treatment,
      status: newBooking.status
    });
  }

  button.textContent = "Solicitud Enviada 🎉";

  window.setTimeout(() => {
    button.textContent = originalText;
    button.disabled = false;
    form.reset();
  }, 2500);
});
