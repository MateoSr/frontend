<div align="center">

<img src="mi-primer-react/public/logo.png" alt="TurnoLibre" width="160" />

# 🏟️ TurnoLibre

**Frontend del Trabajo Práctico de Desarrollo de Software**

Buscá complejos deportivos, reservá turnos y gestioná canchas desde un solo lugar.

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vite.dev/)
[![React Router](https://img.shields.io/badge/React_Router-7-CA4245?style=flat-square&logo=reactrouter&logoColor=white)](https://reactrouter.com/)
[![Axios](https://img.shields.io/badge/Axios-1-5A29E4?style=flat-square&logo=axios&logoColor=white)](https://axios-http.com/)
[![Vitest](https://img.shields.io/badge/Vitest-5-6E9F18?style=flat-square&logo=vitest&logoColor=white)](https://vitest.dev/)
[![Playwright](https://img.shields.io/badge/Playwright-E2E-2EAD33?style=flat-square&logo=playwright&logoColor=white)](https://playwright.dev/)

[🌐 Repositorio backend](https://github.com/MateoSr/backend) · [🔗 Pull Request](https://github.com/MateoSr/frontend/pull/1)

</div>

---

## ✨ ¿Qué es TurnoLibre?

TurnoLibre es una aplicación web para **reservar turnos en complejos deportivos**. El frontend consume la API del backend y ofrece una experiencia distinta según el rol del usuario:

- 🔎 **Público:** explorar complejos, ver detalle, disponibilidad y opiniones.
- ⚽ **Cliente:** registrarse, iniciar sesión, reservar turnos y consultar su perfil.
- 🧑‍💼 **Encargado:** ver la agenda del complejo y agendar turnos para clientes.
- 🏢 **Dueño:** administrar el complejo, sus canchas, horarios y precios.
- 🛠️ **Administrador:** administrar complejos y usuarios.
- 💳 **Pagos:** crear la orden de pago y consultar el resultado de Mercado Pago.

---

## 🧰 Tecnologías

| Área | Tecnología |
| --- | --- |
| UI | React 19 |
| Build | Vite 8 |
| Ruteo | React Router DOM 7 |
| HTTP | Axios 1 |
| Iconos | Lucide React |
| Estilos | CSS por componente y página |
| Tests unitarios | Vitest + Testing Library + jsdom |
| Tests E2E | Playwright |
| Lint | ESLint |
| Deploy | Vercel |

---

## 📋 Requisitos previos

- **Node.js** `^20.19.0` o `>=22.12.0` (requisito de Vite 8).
- **npm** (viene incluido con Node.js).
- El **backend de TurnoLibre** corriendo. Instrucciones en el [repositorio del backend](https://github.com/MateoSr/backend).
- Para los tests E2E: **PostgreSQL** con los datos de demo cargados.

> 💡 El proyecto se ejecuta desde `mi-primer-react`, no desde la raíz del repositorio. La raíz no tiene `package.json`.

---

## 🚀 Puesta en marcha

```bash
# 1. Clonar el repositorio
git clone https://github.com/MateoSr/frontend.git

# 2. Entrar al proyecto
cd frontend/mi-primer-react

# 3. Instalar dependencias
npm install

# 4. Levantar el frontend
npm run dev
```

El servidor de desarrollo queda disponible en **http://localhost:5173**.

En otra terminal, levantá el backend en **http://localhost:3000** (o configurá `VITE_API_URL` con la URL que corresponda).

---

## ⚙️ Variables de entorno

El frontend usa una sola variable:

```env
VITE_API_URL=http://localhost:3000/api
```

- El repo incluye `.env.development` con la URL local.
- `.env.example` sirve como plantilla.
- Si querés sobreescribirla, creá un archivo `.env.local`:

```bash
cp .env.example .env.local
# Windows PowerShell:
# Copy-Item .env.example .env.local
```

```env
VITE_API_URL=https://mi-backend.com/api
```

> ⚠️ Solo las variables que empiezan con `VITE_` se exponen en el navegador. No pongas secretos en el frontend.

---

## 📜 Scripts disponibles

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Levanta Vite con HMR en el puerto 5173. |
| `npm run build` | Genera el build de producción en `dist/`. |
| `npm run preview` | Previsualiza el build de producción. |
| `npm run lint` | Ejecuta ESLint sobre todo el proyecto. |
| `npm test` | Corre los tests unitarios una vez. |
| `npm run test:watch` | Corre Vitest en modo watch. |
| `npm run test:coverage` | Genera el reporte de cobertura. |
| `npm run test:e2e` | Corre los tests end-to-end con Playwright. |

---

## 🧭 Estructura del proyecto

```text
frontend/
└── mi-primer-react/
    ├── e2e/                  # Tests end-to-end de Playwright
    ├── public/               # Archivos estáticos
    ├── src/
    │   ├── assets/           # Imágenes, íconos y SVGs
    │   ├── components/       # Componentes reutilizables
    │   ├── config/           # Configuración de la API
    │   ├── context/          # Contextos globales (modales)
    │   ├── hooks/            # Hooks personalizados
    │   ├── pages/            # Pantallas por flujo y rol
    │   ├── services/         # Llamadas a la API con Axios
    │   ├── test/             # Setup de Vitest
    │   └── utils/            # Auth, fechas y token storage
    ├── .env.development      # Variables para desarrollo
    ├── .env.example          # Plantilla de variables
    ├── playwright.config.js  # Configuración de Playwright
    └── vite.config.js        # Configuración de Vite y Vitest
```

---

## 🔐 Autenticación y roles

El login devuelve un **JWT** que se guarda en `localStorage` bajo la clave `gestor_token`. En el código de la aplicación, el acceso al token está encapsulado en `src/utils/tokenStorage.js`, que expone:

- `obtenerToken()`
- `guardarToken(token)`
- `eliminarToken()`
- `hayToken()`

El cliente HTTP de `src/services/apiClient.js` agrega automáticamente el header `Authorization: Bearer <token>` a las requests que no estén marcadas como públicas (`skipAuth: true`). `src/utils/auth.js` decodifica el payload del JWT, valida su expiración y obtiene el rol. Las rutas protegidas usan `RutaProtegida` y `BloqueoPorRol`.

| Rol | Puede | Rutas principales |
| --- | --- | --- |
| **Administrador** | Administrar complejos y usuarios | `/menuAdmin`, `/administrar-complejos`, `/administrar-usuarios`, `/crear-complejo`, `/crear-usuario` |
| **Dueño** | Administrar su complejo, canchas, horarios y precios | `/menuDueño`, `/complejo/:id` |
| **Encargado** | Ver la agenda y agendar turnos | `/menuEncargado`, `/confirmar-reserva` |
| **Cliente** | Reservar turnos y consultar su perfil | `/perfil`, `/confirmar-reserva` |
| **Público / autenticación** | Explorar complejos, registrarse, iniciar sesión y recuperar contraseña | `/`, `/complejos`, `/detalle-complejo/:id`, `/faq`, `/software`, `/sobre-nosotros`, `/login`, `/register`, `/forgot`, `/reset-password`, `/pago/resultado` |

> 🔒 El JWT se guarda en `localStorage` por simplicidad del trabajo práctico. En un entorno productivo conviene evaluar cookies `httpOnly`.

---

## 🧪 Testing

### Tests unitarios

```bash
npm test
npm run test:watch
npm run test:coverage
```

Los tests usan **Vitest + Testing Library + jsdom**. El setup global está en `src/test/setup.js`.

### Tests end-to-end

```bash
npm run test:e2e
```

Antes de correrlos:

1. Tener PostgreSQL corriendo y el backend configurado.
2. Cargar los datos de demo:

```bash
cd backend
npx prisma db seed
```

Playwright levanta automáticamente el backend (`localhost:3000`) y el frontend (`localhost:5173`) si no están corriendo. El test principal inicia sesión como encargado, agenda un turno, verifica que se haya persistido y lo elimina con la cuenta de administrador.

---

## 🔑 Credenciales de prueba

Estas cuentas salen del seed del backend (`backend/prisma/seed.ts`). Son solo para desarrollo local.

| Rol | Email | Contraseña |
| --- | --- | --- |
| Administrador | `admin@turnolibre.com` | `password123` |
| Dueño | `dueno1@turnolibre.com` | `password123` |
| Dueño | `dueno2@turnolibre.com` | `password123` |
| Encargado | `encargado1@turnolibre.com` | `password123` |
| Encargado | `encargado2@turnolibre.com` | `password123` |
| Cliente | `cliente1@gmail.com` | `password123` |

> 🧪 No uses estas credenciales en producción.

---

## ☁️ Deploy en Vercel

El proyecto está preparado para desplegarse en Vercel. `vercel.json` redirige todas las rutas a `/` para que funcione el ruteo de React Router.

Configuración recomendada:

| Opción | Valor |
| --- | --- |
| Root Directory | `mi-primer-react` |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Environment Variable | `VITE_API_URL=https://tu-backend.com/api` |

---

## 🔗 Enlaces

- [Repositorio frontend](https://github.com/MateoSr/frontend)
- [Repositorio backend](https://github.com/MateoSr/backend)
- [Pull Request del frontend](https://github.com/MateoSr/frontend/pull/1)

---

<div align="center">

Hecho con ⚽, ☕ y muchas ganas para el Trabajo Práctico de Desarrollo de Software.

</div>
