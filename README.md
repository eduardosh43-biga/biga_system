# BIGA System 🍕

Sistema integral de gestión para **Biga Pizzería Artesanal**. Este proyecto es un monorepo que integra un backend robusto y un frontend moderno para la gestión completa de una pizzería.

## 🚀 Arquitectura del Proyecto

El sistema se divide en dos componentes principales:

1.  **[biga_api](./biga_api)**: Backend desarrollado con **Ruby on Rails 8** en modo API.
    *   Arquitectura RESTful.
    *   Autenticación segura mediante **JWT**.
    *   Gestión de Inventario, Pedidos, Recetas y Costos.
    *   Módulo de administración de Staff con roles (Admin/Staff).
2.  **[biga_client](./biga_client)**: Frontend SPA desarrollado con **React + Vite** y **Tailwind CSS**.
    *   Dashboard analítico en tiempo real.
    *   Interfaz optimizada para Cocina y Punto de Venta (POS).
    *   Diseño responsivo y estética premium alineada con la marca.

## 🛠️ Stack Tecnológico

*   **Backend:** Ruby, Rails, SQLite/PostgreSQL, ActionCable (WebSockets).
*   **Frontend:** React, Tailwind CSS, React Router, Lucide Icons.
*   **Seguridad:** Autenticación basada en roles y protección de rutas tanto en API como en Cliente.

## 📦 Instalación y Configuración

### Requisitos previos
*   Ruby 3.2.x o superior.
*   Node.js 18.x o superior.
*   Gestor de paquetes `pnpm` o `npm`.

### Configuración del Backend
```bash
cd biga_api
bundle install
rails db:prepare
rails s # Inicia en http://localhost:3000
```

### Configuración del Frontend
```bash
cd biga_client
pnpm install
pnpm dev # Inicia en http://localhost:5173
```

## ✨ Funcionalidades Clave

*   **📊 Dashboard:** Seguimiento de ventas, productos más vendidos y métricas de rendimiento.
*   **🔪 Cocina:** Panel de pedidos en tiempo real mediante WebSockets para una producción ágil.
*   **📋 Gestión de Pedidos:** Creación y seguimiento de órdenes desde la toma hasta la entrega.
*   **📦 Inventario y Costos:** Control detallado de insumos, stock y rentabilidad de cada plato.
*   **👥 Control de Staff:** Gestión de usuarios con permisos restringidos según el rol.

---
Desarrollado para **Biga Pizzería Artesanal**.
