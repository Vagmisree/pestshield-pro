import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── TACTICAL HUD theme ─────────────────────────────────────────
        void: {
          950: "#030508",
          900: "#07080F",
          800: "#0D0F1A",
          700: "#141623",
        },
        kill: {
          600: "#CC0000",
          500: "#FF2020",
          400: "#FF4444",
          300: "#FF7777",
        },
        bio: {
          500: "#00FF64",
          400: "#33FF88",
          300: "#66FFAA",
        },
        hud: {
          DEFAULT: "rgba(0,255,100,0.7)",
          dim: "rgba(0,255,100,0.3)",
          faint: "rgba(0,255,100,0.07)",
        },
        warn: { 500: "#FFB800" },
        ash: {
          400: "rgba(255,255,255,0.6)",
          300: "rgba(255,255,255,0.4)",
          200: "rgba(255,255,255,0.15)",
          100: "rgba(255,255,255,0.07)",
        },
        // ── Legacy palette (kept for dashboard/booking pages) ──────────
        brand: {
          50: "#f0fdf4", 100: "#dcfce7", 200: "#bbf7d0",
          300: "#86efac", 400: "#4ade80", 500: "#22c55e",
          600: "#16a34a", 700: "#15803d", 800: "#166534",
          900: "#14532d", 950: "#052e16",
        },
        accent: { 400: "#fbbf24", 500: "#f59e0b", 600: "#d97706" },
        neutral: {
          50: "#fafafa", 100: "#f4f4f5", 200: "#e4e4e7",
          300: "#d4d4d8", 400: "#a1a1aa", 500: "#71717a",
          600: "#52525b", 700: "#3f3f46", 800: "#27272a",
          900: "#18181b", 950: "#09090b",
        },
        forest: {
          950: "#071F17", 900: "#0B3D2E", 800: "#0f4f3a", 700: "#145c43",
        },
        cream: {
          50: "#FEFCF7", 100: "#F7F5F0", 200: "#EBE9E3", 300: "#DDD9D0",
        },
        emerald: { 300: "#6ee7b7", 400: "#34d399", 500: "#10b981" },
        ink: "#1C1917",
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: { DEFAULT: "var(--card)", foreground: "var(--card-foreground)" },
        popover: { DEFAULT: "var(--popover)", foreground: "var(--popover-foreground)" },
        primary: { DEFAULT: "var(--primary)", foreground: "var(--primary-foreground)" },
        secondary: { DEFAULT: "var(--secondary)", foreground: "var(--secondary-foreground)" },
        muted: { DEFAULT: "var(--muted)", foreground: "var(--muted-foreground)" },
        destructive: { DEFAULT: "var(--destructive)", foreground: "var(--destructive-foreground)" },
        border: "var(--border)", input: "var(--input)", ring: "var(--ring)",
        chart: { 1: "var(--chart-1)", 2: "var(--chart-2)", 3: "var(--chart-3)", 4: "var(--chart-4)", 5: "var(--chart-5)" },
        sidebar: {
          DEFAULT: "var(--sidebar)", foreground: "var(--sidebar-foreground)",
          primary: "var(--sidebar-primary)", "primary-foreground": "var(--sidebar-primary-foreground)",
          accent: "var(--sidebar-accent)", "accent-foreground": "var(--sidebar-accent-foreground)",
          border: "var(--sidebar-border)", ring: "var(--sidebar-ring)",
        },
      },
      fontFamily: {
        sans:    ["var(--font-body)",    "system-ui", "sans-serif"],
        heading: ["var(--font-heading)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        syne:    ["var(--font-syne)",    "system-ui", "sans-serif"],
        mono:    ["var(--font-mono)",    "monospace"],
        body:    ["var(--font-body)",    "system-ui", "sans-serif"],
      },
      borderRadius: {
        sm: "var(--radius-sm)", md: "var(--radius-md)",
        lg: "var(--radius-lg)", xl: "var(--radius-xl)", full: "9999px",
      },
      boxShadow: {
        card:    "0 1px 4px rgba(11,61,46,0.06), 0 6px 24px rgba(11,61,46,0.08)",
        hover:   "0 12px 40px rgba(11,61,46,0.18), 0 4px 12px rgba(0,0,0,0.06)",
        glow:    "0 0 0 3px rgba(52,211,153,0.25)",
        kill:    "0 0 40px rgba(255,32,32,0.3)",
        "kill-lg":"0 0 80px rgba(255,32,32,0.4)",
        bio:     "0 0 25px rgba(0,255,100,0.4)",
        "bio-lg":"0 0 50px rgba(0,255,100,0.6)",
        hud:     "0 0 20px rgba(0,255,100,0.2)",
      },
      keyframes: {
        scroll: { "0%": { transform: "translateX(0)" }, "100%": { transform: "translateX(-50%)" } },
        shimmer: { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
        float: { "0%,100%": { transform: "translateY(0px)" }, "50%": { transform: "translateY(-8px)" } },
        "float-slow": { "0%,100%": { transform: "translateY(0px)" }, "50%": { transform: "translateY(-12px)" } },
        killPulse: {
          "0%,100%": { boxShadow: "0 0 0 0 rgba(255,32,32,.5)" },
          "50%": { boxShadow: "0 0 0 12px rgba(255,32,32,0)" },
        },
        bioGlow: {
          "0%,100%": { boxShadow: "0 0 10px rgba(0,255,100,.3)" },
          "50%": { boxShadow: "0 0 25px rgba(0,255,100,.6)" },
        },
        threatBlink: {
          "0%,100%": { opacity: "1" },
          "50%": { opacity: "0.4" },
        },
        scanSweep: {
          "0%": { top: "-2px", opacity: "0" },
          "5%": { opacity: "0.6" },
          "95%": { opacity: "0.6" },
          "100%": { top: "100%", opacity: "0" },
        },
        hudFadeIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        countUp: {
          "0%": { transform: "translateY(8px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "draw-line": { "0%": { strokeDashoffset: "200" }, "100%": { strokeDashoffset: "0" } },
      },
      animation: {
        scroll: "scroll 30s linear infinite",
        shimmer: "shimmer 2.5s linear infinite",
        float: "float 4s ease-in-out infinite",
        "float-slow": "float-slow 6s ease-in-out infinite",
        "kill-pulse": "killPulse 2.5s ease-in-out infinite",
        "bio-glow": "bioGlow 2s ease-in-out infinite",
        "threat-blink": "threatBlink 1.2s ease-in-out infinite",
        "scan-sweep": "scanSweep 3.5s linear infinite",
        "hud-fade": "hudFadeIn 0.6s ease-out forwards",
        "draw-line": "draw-line 0.8s ease-out forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
