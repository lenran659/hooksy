# Hooksy

A comprehensive React Hooks library with flat architecture.

## Features

- 🎯 **Flat Architecture**: Simple and intuitive hook organization
- 🚀 **TypeScript First**: Built with TypeScript for better developer experience

- 📦 **Monorepo Structure**: Organized as a monorepo using pnpm workspaces
- 🔧 **Modern Tooling**: Uses Biome for linting and formatting

## Development Setup

### Prerequisites

- Node.js 18+
- pnpm 8+

### Installation

```bash
# Install dependencies
pnpm install

# Install Git hooks (Lefthook)
pnpm hooks:install
```

### Available Scripts

```bash
# Development
pnpm dev              # Run linting in watch mode

# Building
pnpm build            # Build with watch mode
pnpm build:prod       # Production build

# Code Quality
pnpm lint             # Run linting
pnpm lint:fix         # Fix linting issues
pnpm format           # Format code
pnpm type-check       # TypeScript type checking



# Documentation
pnpm docs             # Start documentation server

# Git Hooks Management
pnpm hooks:install    # Install Lefthook hooks
pnpm hooks:uninstall  # Uninstall Lefthook hooks
```

## Git Hooks (Lefthook)

This project uses [Lefthook](https://github.com/evilmartians/lefthook) for Git hooks management.

### Pre-commit Hook
- Runs linting on staged files
- Performs TypeScript type checking

### Pre-push Hook
- Builds the project to ensure no build errors

### Commit-msg Hook
- Placeholder for commit message validation (can be extended)

### Configuration
The Lefthook configuration is in `lefthook.yml` at the root of the project.

## Project Structure

```
Hooksy/
├── packages/
│   └── core/           # Main hooks library
│       ├── src/
│       │   ├── hooks/  # Individual hook implementations
│       │   └── index.ts
│       └── package.json
├── docs/               # Documentation

├── lefthook.yml        # Git hooks configuration
└── package.json        # Root package configuration
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Ensure code is properly formatted
5. Submit a pull request

## License

ISC
