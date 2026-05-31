/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  /** Mapbox GL access token — powers the Apple-Maps-like trip + planner maps. */
  readonly VITE_MAPBOX_TOKEN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
