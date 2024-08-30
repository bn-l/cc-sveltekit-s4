import { sveltekit } from "@sveltejs/kit/vite";
import presetUno from "@unocss/preset-uno";
import UnoCSS from "unocss/vite";
import { defineConfig } from "vitest/config";

export default defineConfig({
    plugins: [
        UnoCSS({
            presets: [presetUno()],
        }),
        sveltekit(),
    ],
    test: {
        include: ["tests/unit/**/*.{test,spec}.{js,ts}"],
    },
});
