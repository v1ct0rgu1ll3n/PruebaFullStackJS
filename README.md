# Prueba Técnica – Full-Stack JS

# Dashboard de Ventas

## Resumen del proyecto y arquitectura
Este proyecto es una **aplicación web para gestión de ventas, clientes y productos**, desarrollada con:

- **Frontend**: Angular 16, Material Design, ng2-charts y Chart.js.
- **Backend**: Node.js + Express, arquitectura RESTful.
- **Base de datos**: PostgreSQL / MySQL (opcional con Docker).
- **Autenticación**: JWT para seguridad de endpoints.
- **Funcionalidades principales**:
  - KPIs: Ventas totales, número de órdenes, ticket promedio.
  - Gráficos: serie temporal (ventas por día), barras (top productos), dona (métodos de pago).
  - Filtros de fecha para KPIs.
  - Gestión de clientes, productos y órdenes.

---

## Prerrequisitos
- Node.js >= 18.x
- npm >= 9.x
- Base de datos PostgreSQL o MySQL
- Git

---

## Configuración
1. Clonar el repositorio:

git clone https://github.com/v1ct0rgu1ll3n/PruebaFullStackJS.git
cd proyecto-dashboard


## Creacion de datos
Ejecutar archivo seed.ts en backend/src para generacion de datos

-- 
## Crear . env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=dashboard
PORT=3000
JWT_SECRET=tu_secreto 

## Arranque 
backend: npm run dev 
frontend: ng serve

Usuario de prueba
email: admin@test.com
password: Admin123!

