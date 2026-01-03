/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: "#6366f1", // Indigo 500
                    dark: "#4f46e5", // Indigo 600
                    light: "#818cf8", // Indigo 400
                },
                dark: {
                    900: "#0f172a", // Slate 900
                    800: "#1e293b", // Slate 800
                    700: "#334155", // Slate 700
                    600: "#475569", // Slate 600
                },
                light: {
                    50: "#f8fafc",
                    100: "#f1f5f9",
                    200: "#e2e8f0",
                },
            },
            animation: {
                "slide-in": "slideIn 0.5s ease-out",
                "fade-in": "fadeIn 0.5s ease-out",
            },
            keyframes: {
                slideIn: {
                    "0%": { transform: "translateX(100%)" },
                    "100%": { transform: "translateX(0)" },
                },
                fadeIn: {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" },
                },
            },
        },
    },
    plugins: [],
}
