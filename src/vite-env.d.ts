/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly BASE_URL: string;
  readonly DEV: ;
  // הוסף כאן משתני סביבה נוספים אם צריך
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
