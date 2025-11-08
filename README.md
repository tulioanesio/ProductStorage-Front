# Product Storage Frontend

[![React](https://img.shields.io/badge/React-18-61DAFB.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3-06B6D4.svg)](https://tailwindcss.com/)
[![shadcn/ui](https://img.shields.io/badge/shadcn/ui-latest-black.svg)](https://ui.shadcn.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## Overview

The **Product Storage** system is an application designed to manage the inventory of a commercial business efficiently. This repository contains the **Frontend** client, built with React, TypeScript, and TailwindCSS.

The backend for this application is available at: [ProductStorage-Back](https://github.com/tulioanesio/ProductStorage-Back.git)

It provides a user interface for full CRUD operations for products, categories, stock movements and reports, helping businesses maintain accurate stock levels and plan purchases effectively.

---

## Features

### Product Management
- Create, read, update, and delete products.
- Classify products by category.
- Recalculate all product prices by a given percentage.

### Category Management
- Create, read, update, and delete categories.
- Define size (Small, Medium, Large) and packaging type (Can, Glass, Plastic).
- Associate products with specific categories for organized stock control.

### Stock Movements
- Register product **entries** and **exits**.
- Automatically update product stock after each movement.
- Notify when stock is below minimum or above maximum levels.

### Reporting
1. **Price List:** Displays all products alphabetically with their unit price, unit of measure, and category.
2. **Physical/Financial Balance:** Shows product quantities, total value per product, and the total stock value.
3. **Low Stock Report:** Lists products below the minimum quantity with name, minimum quantity, and current stock.
4. **Products by Category:** Displays categories with the number of distinct products in each.
5. **Most Moved Products:** Shows which products had the most entries and exits.

---

## Technologies

- **React 18**
- **TypeScript**
- **Vite**
- **Axios**
- **TailwindCSS** 
- **Shadcn/UI** 
- **React Router DOM** 

---

## Running the Application

### Requirements
- Node.js
- npm (or yarn/pnpm)
- A running instance of the [backend API](https://github.com/tulioanesio/ProductStorage-Back.git) (must be accessible at `http://localhost:8080`)

### Steps

1. Clone the repository:
   ```bash
   git clone [https://github.com/tulioanesio/ProductStorage-Front.git](https://github.com/tulioanesio/ProductStorage-Front.git)
   cd ProductStorage-Front
   ```
2. Install dependencies:

   ```bash
   npm install

   Create a .env.local file in the root directory. This step is optional if the API is running on http://localhost:8080, but good practice.

   # Adjust if your backend is on a different port
   VITE_API_BASE_URL=http://localhost:8080
   ```

3. Start the development server:

   ```bash
   npm run dev

   Open your browser and navigate to the local URL provided in the console (usually http://localhost:5173).
   ```
    
## License

This project is licensed under the [MIT License](LICENSE)

## Developers

* João Pedro Farias Da Silva
* Kaike Augusto Dos Santos
* Pedro Henrique Nieto da Silva
* Thuysa Monique Luvison da Rosa
* Tulio Anesio da Rosa
* Vinicius Freitas da Silva