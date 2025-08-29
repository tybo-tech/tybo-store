# Tybo Store v2 - E-commerce Website Builder

A comprehensive e-commerce platform with a sophisticated website builder featuring three distinct application shells: **Storefront**, **Dashboard**, and **Editor**.

## 🏗️ Architecture Overview

This Angular 18+ application implements a unique three-app architecture within a single codebase:

### 1. **Storefront** (`/`)
- **Purpose**: Customer-facing e-commerce website
- **Features**: Dynamic page rendering, product browsing, shopping cart
- **Components**: Hero sliders, category grids, product listings, feature sections
- **Responsive**: Mobile-first design with Tailwind CSS

### 2. **Dashboard** (`/dashboard`)
- **Purpose**: Admin interface for store management
- **Features**: Product management, order processing, analytics
- **Navigation**: Sidebar with sections for Products, Orders, Categories, Users
- **Layout**: Professional admin interface with role-based access

### 3. **Editor** (`/editor`)
- **Purpose**: Visual website builder for creating and editing pages
- **Features**: Drag-drop section management, real-time preview, responsive editing
- **Components**: Section library, property panels, style editor
- **Innovation**: JSON-based page structure with dynamic component rendering

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Angular CLI 18+
- PHP 8+ (for backend API)

### Installation
```bash
# Clone the repository
git clone [repository-url]
cd tybo-store-v2

# Install dependencies
npm install

# Start development server
ng serve --port 4201

# Access the applications:
# Storefront: http://localhost:4201/
# Dashboard: http://localhost:4201/dashboard
# Editor: http://localhost:4201/editor
```
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
