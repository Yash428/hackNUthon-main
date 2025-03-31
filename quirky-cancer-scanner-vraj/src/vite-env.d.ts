/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  // Add other environment variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module 'react' {
  // This is just to satisfy TypeScript during development
}

declare module 'react/jsx-runtime' {
  // This is just to satisfy TypeScript during development
}

declare module 'react-router-dom' {
  // This is just to satisfy TypeScript during development
}

declare module '@tanstack/react-query' {
  // This is just to satisfy TypeScript during development
}

declare module 'framer-motion' {
  // This is just to satisfy TypeScript during development
}

declare module 'lucide-react' {
  // This is just to satisfy TypeScript during development
}
