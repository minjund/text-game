# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a text-based game project built with Nuxt 4. The repository contains a single Nuxt application located in the `nuxt-app/` directory.

## Development Commands

All commands should be run from the `nuxt-app/` directory:

```bash
# Install dependencies
npm install

# Start development server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Generate static site
npm run generate
```

## Architecture

### Framework
- **Nuxt 4.1.3**: Full-stack Vue framework with SSR/SSG capabilities
- **Vue 3.5.22**: Composition API and script setup syntax
- **TypeScript**: Project uses TypeScript with Nuxt's auto-generated type definitions

### Project Structure
- `nuxt-app/app/`: Main application code
  - `app.vue`: Root application component
- `nuxt-app/public/`: Static assets (favicon, robots.txt)
- `nuxt-app/.nuxt/`: Auto-generated Nuxt files (types, build artifacts) - do not edit manually
- `nuxt-app/nuxt.config.ts`: Nuxt configuration file

### Configuration
- TypeScript configuration uses Nuxt's project references system (see `tsconfig.json`)
- Nuxt devtools are enabled
- Compatibility date set to 2025-07-15

## Development Notes

- This is a minimal Nuxt starter with only the core dependencies
- No additional Nuxt modules or UI frameworks are currently installed
- The application currently displays the default Nuxt welcome screen
- File-based routing, auto-imports, and other Nuxt conventions are available but not yet utilized