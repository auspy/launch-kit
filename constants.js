export const PINECONE_INDEX = "yt-vizolv";
export const urlBase =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
// console.log("urlBase", urlBase);
export const urlPython = process.env.PYTHON_BACKEND_URL;
export const alt = "Focusmo | One Task at a Time";
export const isDev = process.env.NODE_ENV === "development";
export const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL;
