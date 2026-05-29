# ADÓRE Centro Estético

Sitio web para ADÓRE con página pública, dashboard administrativo y versión local con servidor Node.

## Publicar en GitHub Pages

1. Crea un repositorio nuevo en GitHub.
2. Sube estos archivos y carpetas:
   - `index.html`
   - `styles.css`
   - `script.js`
   - `admin.html`
   - `admin.css`
   - `admin.js`
   - `assets/`
3. En GitHub entra a `Settings > Pages`.
4. En `Build and deployment`, elige:
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/root`
5. Guarda y espera a que GitHub genere el link.

El link quedará parecido a:

```text
https://tuusuario.github.io/nombre-del-repositorio/
```

## Importante sobre reservas

GitHub Pages no ejecuta `server.js`, así que no puede guardar reservas compartidas en `data/bookings.json`.

En GitHub Pages:
- La página pública funciona.
- El dashboard se puede ver.
- Las reservas quedan solo en el navegador de cada persona.

Para reservas compartidas 24/7 hay que conectar una base externa como Supabase o Firebase.

## Usar en red local con servidor

Si quieres usar reservas compartidas dentro de una misma red, instala Node.js y ejecuta:

```powershell
node server.js
```

Luego abre:

```text
http://localhost:4173/
http://localhost:4173/admin.html
```
