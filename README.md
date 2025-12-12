# Gramola - Lab Multimedia

Aplicación web para la gestión de música en bares y establecimientos, permitiendo a los usuarios gestionar colas de reproducción de manera colaborativa.

## 🚀 Requisitos Previos

Asegúrate de tener instalado lo siguiente en tu sistema:

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

## ⚙️ Configuración

Antes de ejecutar la aplicación, necesitas configurar las variables de entorno. Crea un archivo `.env` en la raíz del proyecto (`/home/pablo/Codigo/Lab_Multimedia/.env`) con el siguiente contenido:

```env
# Base de Datos
DB_HOST=mysql
DB_PORT=3306
DB_NAME=lab_multimedia
DB_USER=root
DB_PASSWORD=

# Correo (Gmail SMTP)
MAIL_USERNAME=tu_email@gmail.com
MAIL_PASSWORD=tu_contraseña_de_aplicacion

# APIs Externas
STRIPE_SECRET_KEY=sk_test_...
YOUTUBE_API_KEY=tu_youtube_api_key
SPOTIFY_CLIENT_ID=tu_spotify_client_id
SPOTIFY_CLIENT_SECRET=tu_spotify_client_secret

# Seguridad
JWT_SECRET=tu_secreto_jwt_super_seguro
```

> **Nota:** Para `MAIL_PASSWORD`, si usas Gmail, debes generar una "Contraseña de aplicación" en la configuración de seguridad de tu cuenta de Google.

## ▶️ Ejecución

Para iniciar la aplicación, abre una terminal en la raíz del proyecto y ejecuta:

```bash
docker compose up --build
```

Esto levantará los siguientes servicios:
- **Frontend (Angular):** Accesible en `http://localhost:4200`
- **Backend (Spring Boot):** Accesible en `http://localhost:8080`
- **Base de Datos (MySQL):** Puerto 3306
- **Visor de Base de Datos (PHPMyAdmin):** Accesible en `http://localhost:8081`

## 📖 Guía de Uso

### 1. Registro de Establecimiento
1. Ve a `http://localhost:4200/register`.
2. Completa el formulario con el nombre de tu bar, email y contraseña.
3. Al registrarte, recibirás un correo electrónico de confirmación (asegúrate de tener configurado el SMTP correctamente o revisa los logs del backend si estás en desarrollo).
4. Haz clic en el enlace del correo para proceder al pago.

### 2. Pago de Suscripción
1. El enlace te llevará a la pasarela de pago (integración con Stripe).
2. Introduce los datos de una tarjeta de prueba (puedes usar las tarjetas de prueba de Stripe, ej: `4242 4242 4242 4242`).
3. Al confirmar el pago, tu cuenta quedará activada.

### 3. Iniciar Sesión
1. Ve a `http://localhost:4200/login`.
2. Introduce tu email y contraseña.
3. Accederás al **Dashboard** principal.

### 4. Gestión de Música (Dashboard)
- **Buscador:** Usa la barra de búsqueda para encontrar canciones (integra resultados de YouTube/Spotify).
- **Reproductor:** Controla la reproducción (Play, Pause, Siguiente).
- **Cola de Reproducción:**
  - Las canciones añadidas se encolan automáticamente.
  - Si la cola se vacía, el sistema añade automáticamente canciones sugeridas basadas en el artista actual ("Radio Infinita").
  - Puedes ver y gestionar la cola haciendo clic en el botón de lista en el reproductor.

## 🛠️ Tecnologías

- **Frontend:** Angular 17+ (Standalone Components), CSS3 (Dark Theme).
- **Backend:** Java Spring Boot 3, Maven.
- **Base de Datos:** MySQL 8.
- **Integraciones:** Stripe (Pagos), YouTube Data API, Spotify Web API (Credenciales).
- **Contenedores:** Docker & Docker Compose.