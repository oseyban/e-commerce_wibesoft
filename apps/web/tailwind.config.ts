import type { Config } from "tailwindcss";
import lineClamp from "@tailwindcss/line-clamp";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,js,jsx}"],
  plugins: [lineClamp]
};

export default config;
