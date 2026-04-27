# Arquitectura de Componentes (Atomic Design)

Este proyecto utiliza una estructura basada en **Atomic Design** para mejorar la mantenibilidad, escalabilidad y reutilización de componentes.

## Estructura de Carpetas

```text
app/components/
├── atoms/        # Componentes básicos (Input, NavLink, etc.)
├── molecules/    # Combinación de átomos (DynamicFormFields)
├── organisms/    # Secciones complejas de la UI (CartSidebar)
└── templates/    # Diseños de página reutilizables (DashboardTemplate, SignTemplate)
```

## Componentes Principales

### 1. Input (Atom)
Un componente de entrada altamente flexible que soporta:
- Diferentes tipos (text, email, password, textarea, etc.)
- Iconos (ReactNode o clases de Iconify)
- Estados de error y mensajes de ayuda
- Accesibilidad (ARIA attributes)

**Ejemplo de uso:**
```tsx
<Input
  label="Correo electrónico"
  name="email"
  icon="icon-[solar--user-bold]"
  placeholder="ejemplo@correo.com"
  errorMessage={errors.email}
/>
```

### 2. DynamicFormFields (Molecule)
Renderiza dinámicamente un conjunto de campos basados en un array de configuración. Utiliza `Formik` para la gestión del estado.

**Configuración:**
```tsx
const fields: InputConfig[] = [
  { name: 'name', label: 'Nombre', required: true },
  { name: 'price', label: 'Precio', type: 'number' }
];

<DynamicFormFields fields={fields} gridCols="grid-cols-2" />
```

### 3. DashboardTemplate (Template)
Define el layout general para las páginas del panel de administración y usuario, incluyendo la navegación lateral y el encabezado.

## Tipos y Seguridad
Todos los tipos relacionados con la UI se encuentran consolidados en `app/types/ui.ts`.

- `InputConfig`: Define las propiedades para la renderización dinámica.
- `InputProps`: Extiende los atributos estándar de HTML para el átomo Input.
- `SignTemplateProps`: Define la estructura para las pantallas de autenticación.

## Pruebas
Se utiliza **Vitest** y **React Testing Library**.
Ejecutar pruebas: `npm test`
