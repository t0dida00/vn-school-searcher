import { Zilla_Slab } from "next/font/google";

// Slab face for the Unies wordmark (every page's footer) and the landing page's headings, like the logo's
// wordmark; loaded as --font-slab from the root layout
export const slab = Zilla_Slab({ weight: ["600", "700"], subsets: ["latin", "latin-ext"], variable: "--font-slab" });
