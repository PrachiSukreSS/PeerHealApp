# PeerHealApp

PeerHealApp is a modern, peer-driven mental health support platform that empowers users to connect, share, and support each other in a safe, accessible environment. Built with a focus on privacy, security, and user experience, PeerHealApp integrates traditional peer support with AI-driven features and blockchain capabilities for enhanced trust and innovative experiences.

## Table of Contents

- [Problem Statement](#problem-statement)
- [Solution](#solution)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Application Architecture](#application-architecture)
- [Getting Started](#getting-started)
- [Key Scripts](#key-scripts)
- [Folder Structure](#folder-structure)
- [Contributing](#contributing)
- [License](#license)

---

## Problem Statement

Accessing quality mental health support is challenging for many. Social stigma, cost, and a lack of safe, judgment-free environments are significant barriers. Existing solutions often lack peer-driven, real-time, and anonymous support for users seeking help or wishing to support others.

## Solution

PeerHealApp addresses these challenges by providing:
- A safe and inclusive community where users can connect anonymously or openly with peers.
- Real-time chat, AI-based assistant, and curated resources.
- A transparent, reward-based model leveraging blockchain for trust and incentives.

---

## Features

- **User Authentication**: Secure sign-up, login, password recovery.
- **Peer Support Dashboard**: Personalized dashboard for accessing support groups, resources, and messages.
- **AI Assistant**: Built-in AI assistant for instant guidance and crisis management.
- **Emergency Chatbot**: Always-available chatbot for high-priority help.
- **Helper Onboarding**: Become a peer helper and support others.
- **Categories & Resources**: Curated mental health topics and resources library.
- **Blockchain Integration**: Algorand-powered features (e.g., transparent rewards).
- **Subscription Plans**: Tiered support and resource access options.
- **Notifications**: Real-time updates and reminders.
- **Profile Management**: Personalize your experience and manage privacy.

---

## Tech Stack

- **Frontend**: React, TypeScript, Vite
- **Styling**: Tailwind CSS, PostCSS
- **State & Forms**: react-hook-form, zod (validation)
- **Routing**: react-router-dom
- **Animation**: framer-motion
- **Backend & Auth**: Supabase
- **AI Integration**: Custom AI assistant, ElevenLabs demo
- **Blockchain**: Algorand integration
- **Utilities**: ESLint, Prettier

---

## Application Architecture

The app follows a modular architecture for maintainability and scalability:

- `src/App.tsx`: Main routing and layout logic. Integrates authentication, navigation, protected routes, and persistent UI components (header, footer, emergency chatbot).
- `src/pages/`: Each route/page (e.g., HomePage, DashboardPage, AIAssistantPage, etc.).
- `src/components/`: Reusable UI components (e.g., Header, Footer, EmergencyChatbot, ProtectedRoute).
- `src/contexts/`: Context providers (e.g., AuthContext) for global state.
- `src/lib/`: Utility functions and custom hooks.
- `src/types/`: TypeScript types and interfaces.

**Routing Example:**
- `/` - Home
- `/login`, `/signup`, `/forgot-password`, `/reset-password` - Auth
- `/dashboard` - User dashboard (protected)
- `/categories`, `/helpers`, `/ai-support`, etc. - Main features
- `/blockchain` - Algorand integration demo

---

## Getting Started

### Prerequisites

- Node.js (>= 18)
- npm or yarn
- Supabase project & credentials

### Installation

```bash
git clone https://github.com/PrachiSukreSS/PeerHealApp.git
cd PeerHealApp
npm install
# or
yarn install
```

### Environment Variables

Copy `.env.example` to `.env` and replace placeholders with your Supabase credentials and other configs.

```bash
cp .env.example .env
```

### Running the App

```bash
npm run dev
# or
yarn dev
```

The app will be available at `http://localhost:5173/` (default Vite port).

---

## Key Scripts

- `dev`: Start the development server
- `build`: Build for production
- `preview`: Preview the production build
- `lint`: Run ESLint for code quality

---

## Folder Structure

```
src/
  App.tsx            # Main application component and routing
  components/        # Reusable UI components (Header, Footer, etc.)
  contexts/          # React context providers (Auth, etc.)
  lib/               # Utilities and custom hooks
  pages/             # Route-based pages (HomePage, DashboardPage, etc.)
  types/             # TypeScript types/interfaces
  index.css          # Global styles (TailwindCSS)
  main.tsx           # App entrypoint (ReactDOM.render)
```

---

## Contributing

Contributions, issues, and feature requests are welcome!  
Feel free to check the [issues page](https://github.com/PrachiSukreSS/PeerHealApp/issues).

---

## License

Distributed under the MIT License. See `LICENSE` for more information.

---

**PeerHealApp** – Empowering mental health through community, technology, and innovation.
