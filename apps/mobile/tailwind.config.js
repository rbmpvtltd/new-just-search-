/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
      "base-100": "var(--base-100)",
      "base-200": "var(--base-200)",
      "base-300": "var(--base-300)",
      "base-content": "var(--base-content)",
      primary: "var(--primary)",
      "primary-content": "var(--primary-content)",
      secondary: "var(--secondary)",
      "secondary-content": "var(--secondary-content)",
      accent: "var(--accent)",
      "accent-content": "var(--accent-content)",
      neutral: "var(--neutral)",
      "neutral-content": "var(--neutral-content)",
      info: "var(--info)",
      "info-content": "var(--info-content)",
      success: "var(--success)",
      "success-content": "var(--success-content)",
      warning: "var(--warning)",
      "warning-content": "var(--warning-content)",
      error: "var(--error)",
      "error-content": "var(--error-content)",
    },
    },
  },
  darkMode: "class",
  plugins: [],
};
