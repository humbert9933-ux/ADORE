# ADÓRE - Uso en varias PCs

## 1. Elegir la PC servidor

Usa una PC principal para alojar el sistema. Esa PC debe permanecer encendida mientras las otras PCs usan la página.

## 2. Instalar Node.js

En la PC servidor instala Node.js desde:

https://nodejs.org/

## 3. Iniciar el servidor

En la carpeta del proyecto, ejecuta:

```powershell
node server.js
```

O haz doble clic en:

```text
start-server.bat
```

## 4. Abrir en la misma PC

Sitio público:

```text
http://localhost:4173/
```

Dashboard:

```text
http://localhost:4173/admin.html
```

## 5. Abrir desde otras PCs

En la PC servidor busca su IP local con:

```powershell
ipconfig
```

Luego, desde otra PC conectada a la misma red Wi-Fi/LAN, abre:

```text
http://IP-DE-LA-PC-SERVIDOR:4173/
http://IP-DE-LA-PC-SERVIDOR:4173/admin.html
```

Ejemplo:

```text
http://192.168.1.25:4173/admin.html
```

## 6. Datos compartidos

Las reservas se guardan en:

```text
data/bookings.json
```

Todas las PCs verán las mismas reservas mientras entren al mismo servidor.

## 7. Importante

Si Windows pregunta si permite acceso de red a Node.js, acepta en red privada. Si no se acepta, otras PCs podrían no conectarse.
