# Sustainable Development Education Platform

A Single Page Application (SPA) focused on Sustainable Development Goals (SDGs) with Philippine context, built using Angular 19.

## Project Overview

This platform aims to provide educational content about sustainable development, focusing on SDGs 4 (Quality Education), 9 (Industry, Innovation, and Infrastructure), and 11 (Sustainable Cities and Communities) with a Philippine context.

## Features

- User Authentication (Login/Register)
- Content Management System
- Admin Dashboard
- User Profiles
- Content Search and Filtering
- Responsive Design
- Accessibility Features

## Technical Stack

- Angular 19
- TypeScript
- JSON Server
- Angular Material
- RxJS

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Start JSON Server: `npm run server`
4. Start development server: `npm start`
5. Open `http://localhost:4200`

## Project Structure

```
src/
src/
├── index.html
├── main.server.ts
├── main.ts
├── server.ts
├── styles.css
├── app/
│   ├── app.component.css
│   ├── app.component.html
│   ├── app.component.spec.ts
│   ├── app.component.ts
│   ├── app.config.server.ts
│   ├── app.config.ts
│   ├── app.routes.server.ts
│   ├── app.routes.ts
│   ├── components/
│   │   ├── components.component.css
│   │   ├── components.component.html
│   │   ├── components.component.spec.ts
│   │   ├── components.component.ts
│   │   ├── about-authors/
│   │   ├── about-topic/
│   │   ├── auth/
│   │   ├── courses/
│   │   ├── dashboard/
│   │   ├── home/
│   │   ├── resources/
│   │   ├── shared/
│   │   └── teachers/
│   ├── guards/
│   ├── models/
│   ├── pipes/
│   └── services/
└── asset/
    └── data/
└── app-routing.module.ts
```

## Accessibility Features

- Keyboard navigation
- ARIA attributes
- Semantic HTML
- Proper form labels
- Color contrast compliance

## Development Guidelines

- Follow Angular style guide
- Use TypeScript strict mode
- Implement proper error handling
- Write unit tests for components
- Document code changes

## Contributors

Marc Gil Bawa-an
