# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

InnovaPACS (Med IQ) is an Angular 17 frontend for a RIS/PACS system targeting small medical clinics in Mexico. It integrates with:
- A Java/Spring Boot backend API at `https://bautistaj.dev/med-iq-service`
- DCM4CHEE (open-source PACS for DICOM image storage)
- OHIF Viewer (web-based DICOM visualization)
- Kafka/HL7 messaging (handled by the backend, not this repo)

This repo is **frontend only**. The backend is a separate service.

## Commands

```bash
# Development server (http://localhost:4200)
npm start

# Dev server with dev environment config
npm run start:dev

# Production build (output: dist/innova-pacs)
npm run build

# Dev build for Docker deploy (output: dist/med-iq, base href: /med-iq/)
npm run build:dev

# Run unit tests (Karma/Jasmine)
npm run test

# Lint
npx eslint .

# Docker build and run
docker build -t innova-pacs .
docker run -p 80:80 innova-pacs
```

## Architecture

### Module Structure

The app uses **lazy-loaded feature modules** routed from `app-routing.module.ts`:

- **auth/** — Login, JWT token handling, route guards (`isAuthenticatedGuard`, `isNotAuthenticatedGuard`)
- **dashboard/** — Main entry point after login
- **patients/** — Patient registration and management
- **appointments/** — Appointment scheduling
- **calendar/** — FullCalendar-based appointment visualization
- **studies/** — DICOM study management; opens OHIF viewer for image viewing
- **doctors/** — Physician management
- **users/** — User/role management
- **medical-office/** — Clinic/office management
- **pacs-configuration/** — PACS server settings

### Shared Module (`shared/`)

- **components/** — Menu, Header, Footer (layout shell)
- **services/** — All HTTP services (PatientService, StudyService, AppointmentService, AuthService, etc.)
- **interceptor/loading.interceptor.ts** — Attaches JWT, handles loading state, shows error messages via SweetAlert2
- **interfaces/** — TypeScript type definitions

### Data Flow

1. Auth module authenticates → JWT stored (likely localStorage)
2. `LoadingInterceptor` attaches JWT to all outgoing requests
3. Feature services call the backend API (`environment.baseUrl`)
4. Route guards protect pages based on auth state

### Build Configurations

Defined in `angular.json`:
- **production** — Output hashing, optimized, no source maps
- **dev** — Source maps, no optimization
- **deploy** — Used by `npm run build:dev`; optimized, output hashing, base href `/med-iq/`
- **local** — Source maps, no optimization

### Code Style

- TypeScript strict mode enabled
- ESLint + Prettier: 2-space indent, single quotes, 80-char line width
- EditorConfig: UTF-8, LF line endings

### Key Libraries

- **FullCalendar 6** (`@fullcalendar/*`) — Calendar module
- **SweetAlert2** — Alerts and error messages (used in interceptor and throughout)
- **Choices.js** — Enhanced select inputs
- **Dropzone** — File uploads
- **Flatpickr** — Date pickers
- **DayJS** — Date manipulation
- **Lodash** — Utility functions

### Environment Config

- `src/environments/environment.ts` — Dev: `baseUrl: 'https://bautistaj.dev/med-iq-service'`
- `src/environments/environment.dev.ts` — Deploy config

### Deployment

Multi-stage Docker build: Node.js build stage → Nginx Alpine runtime. `nginx.conf` configures SPA routing (`try_files` for Angular router fallback).

### Documentation

Architecture documentation (in Spanish, arc42 format) lives in `src/docs/arc42/`.
