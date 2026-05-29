# ADÓRE Centro Estético - Landing Page & Sistema de Reservas

Este repositorio contiene el código fuente de la página de aterrizaje (landing page) y el panel de administración para **ADÓRE Centro Estético**, optimizado para captación de clientes, seguimiento de conversiones y alojamiento estático en GitHub Pages.

## 🚀 Características Principales

*   **Diseño Premium y Responsivo:** Interfaz visual moderna en tonos oscuros y dorados, adaptable a dispositivos móviles, tablets y computadoras de escritorio.
*   **Formulario de Reservas Dinámico:** Sistema de agendamiento integrado donde los clientes pueden elegir tratamientos y fechas preferidas.
*   **Panel de Administración (`admin.html`):** Interfaz privada para visualizar, filtrar y gestionar el estado de las citas (Pendiente, Confirmada, Atendida, Cancelada).
*   **Almacenamiento Local Inteligente:** Las reservas se guardan de forma segura en el `localStorage` del navegador, permitiendo que el sistema funcione perfectamente en un entorno estático sin necesidad de un backend activo.
*   **Integración Publicitaria (Meta Pixel):** El proyecto incluye el código de Meta Pixel configurado con el disparador de conversión estándar `Schedule` (Cita Programada) para medir la efectividad de las campañas publicitarias.

## 📁 Estructura del Proyecto

*   `index.html`: Página principal orientada a la conversión y captación de clientes.
*   `styles.css`: Hoja de estilos principal con las variables de color y tipografías de la marca ADÓRE.
*   `script.js`: Lógica del lado del cliente para procesar el formulario, guardar la información y disparar el evento de Meta.
*   `admin.html`: Interfaz del tablero de control (Dashboard) para la administración.
*   `admin.js`: Lógica encargada de leer los datos guardados, pintar la tabla y actualizar los estados de las reservas.
*   `assets/`: Directorio destinado a los recursos visuales (logos, imágenes de fondo, etc.).

## 🌐 Instrucciones de Despliegue (GitHub Pages)

Este proyecto está optimizado para ser publicado de forma rápida y gratuita mediante GitHub Pages:

1. Sube todos los archivos de este proyecto a la rama `main` de tu repositorio.
2. En tu repositorio en GitHub, dirígete a la pestaña **Settings** (Configuración).
3. En la barra lateral izquierda, haz clic en **Pages**.
4. En la sección *Build and deployment*, bajo la opción *Source*, asegúrate de que diga **Deploy from a branch**.
5. Selecciona la rama `main`, mantén la carpeta `/root` y haz clic en **Save**.
6. En unos minutos, GitHub generará una URL pública donde tu proyecto estará visible al mundo.
