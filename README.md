# AOA Frontend - Portal de Gestión y Compras

Aplicación moderna basada en Next.js 16 para la administración de inventario y plataforma de compras para usuarios finales.

## Tecnologías Principales

- **Framework:** Next.js 16 (App Router)
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS
- **Estado Global:** Redux Toolkit
- **Formularios:** React Hook Form + Formik
- **API Client:** Apollo Client (GraphQL)
- **Pruebas:** Vitest + React Testing Library
- **Iconos:** Iconify (Solar/Material Symbols) + Lucide React

## Arquitectura

El frontend ha sido refactorizado bajo el paradigma de **Atomic Design**, asegurando componentes altamente reutilizables y modulares:

- **`app/components/atoms`**: Componentes básicos e indivisibles (Input, NavLink, Chart).
- **`app/components/molecules`**: Conjuntos de átomos (DynamicFormFields).
- **`app/components/organisms`**: Secciones complejas de la página (CartSidebar).
- **`app/components/templates`**: Estructuras de layout para páginas (DashboardTemplate, SignTemplate).
- **`app/views`**: Contenedores lógicos de alto nivel para formularios complejos (SignIn, SignUp).

## Características Implementadas

1. **Diseño Atómico & SOLID**: Componentes desacoplados con responsabilidades únicas.
2. **Formularios Dinámicos**: Renderizado de campos mediante arreglos de configuración (`InputConfig[]`).
3. **Gestión de Estado**: Integración de Redux para carrito de compras, autenticación y datos persistentes.
4. **Validación de Formularios**: Integración con React Hook Form para una gestión de errores eficiente y accesible.
5. **Panel Administrativo**: Dashboards interactivos con gráficos (Chart.js) para inventario y ventas.
6. **Experiencia de Usuario**: Toasts de notificación, estados de carga y diseño responsivo.

## Configuración y Desarrollo

### Requisitos
- Node.js (v20+)

### Pasos
1. Instalar dependencias:
   ```bash
   npm install
   ```
2. Iniciar servidor de desarrollo:
   ```bash
   npm run dev
   ```
3. Ejecutar pruebas unitarias:
   ```bash
   npm test
   ```
4. Construir para producción:
   ```bash
   npm run build
   ```

## Tecnologías y Librerías

### Dependencias de Producción
- **next (16.2.4)**: Framework de React para producción con renderizado en el servidor y generación de sitios estáticos.
- **react (19.2.4)**: Biblioteca base para la construcción de interfaces de usuario.
- **@apollo/client (4.1.9)**: Cliente completo para gestionar datos locales y remotos con GraphQL.
- **@reduxjs/toolkit (2.11.2)**: Herramienta oficial para la gestión de estado global eficiente y predecible.
- **react-redux (9.2.0)**: Vinculaciones oficiales de Redux para React.
- **react-hook-form (7.74.0)**: Gestión de formularios eficiente, basada en hooks y con alto rendimiento.
- **formik (2.4.9)**: Biblioteca para facilitar la creación de formularios complejos y validaciones.
- **yup (1.7.1)**: Constructor de esquemas para validación de objetos y formularios.
- **chart.js & react-chartjs-2**: Bibliotecas para la visualización de datos mediante gráficos interactivos.
- **lucide-react**: Conjunto de iconos vectoriales hermosos y consistentes.
- **date-fns (4.1.0)**: Manipulación y formateo de fechas de forma modular y ligera.
- **react-hot-toast**: Notificaciones ligeras y personalizables para mejorar la UX.
- **next-cloudinary & cloudinary**: Integración y optimización de imágenes alojadas en la nube.

### Dependencias de Desarrollo
- **tailwindcss (4)**: Framework de CSS "utility-first" para diseño rápido y responsivo.
- **typescript (5)**: Superset de JavaScript que añade tipado estático para mayor robustez.
- **vitest**: Framework de pruebas unitarias ultrarrápido compatible con Vite.
- **@testing-library/react**: Utilidades para probar componentes de React de forma centrada en el usuario.
- **@iconify/tailwind4**: Integración de miles de iconos directamente mediante clases de Tailwind.

## Limpieza de Código y Optimización
Se han realizado las siguientes acciones de mantenimiento:
- **Consolidación de Tipos**: Eliminación de archivos de tipos duplicados y centralización en `app/types/ui.ts`.
- **Eliminación de Componentes Obsoletos**: Se eliminaron componentes como `DashboardButton.tsx` y `DashboardTamplate.tsx` (con error ortográfico) reemplazándolos por versiones atómicas.
- **Optimización de Imports**: Limpieza de imports no utilizados en las páginas principales.
- **Estandarización de Inputs**: Migración de todos los inputs nativos a el átomo `Input.tsx` para asegurar consistencia en estilos y accesibilidad.

## Resumen del Frontend
El frontend es una aplicación moderna, escalable y mantenible. Utiliza **Next.js 16** con **Atomic Design** para una organización clara. La gestión de datos es híbrida: **Redux** para el estado de la UI (carrito, auth) y **Apollo Client** para la comunicación fluida con la API GraphQL. Se prioriza la accesibilidad y la experiencia de usuario mediante validaciones robustas y feedback visual inmediato.

## Guía de Estructura
Para más detalles sobre cómo crear nuevos componentes y utilizar el sistema de diseño, consulte [STRUCTURE.md](./STRUCTURE.md).
