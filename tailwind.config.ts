import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        base: "hsl(var(--base))",
        surface: "hsl(var(--surface))",
        elev: "hsl(var(--elev))",
        text: "hsl(var(--text))",
        muted: "hsl(var(--muted))",
        accent: "hsl(var(--accent))",
        accent2: "hsl(var(--accent-2))",
        accent3: "hsl(var(--accent-3))",
        border: "hsl(var(--border))"
      },
      boxShadow: {
        glass: "0 12px 40px -14px hsla(201, 100%, 63%, 0.42)"
      },
      animation: {
        float: "float 8s ease-in-out infinite",
        pulseFast: "pulseFast 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite"
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" }
        },
        pulseFast: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: ".3" }
        }
      }
    }
  },
  plugins: []
};

export default config;
