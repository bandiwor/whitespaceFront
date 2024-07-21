import type {Config} from "tailwindcss";

export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                "sans": "Comfortaa, Helvetica, Tahoma, sans-serif",
            },
            screens: {
                "mobile": {max: "425px"},
                "mobile-above": {min: "425px"},
                "mobile-s": {max: "375px"},
                "mobile-s-above": {min: "375px"},
                "mobile-l": {max: "550px"},
                "mobile-l-above": {min: "550px"},
                "tablet": {max: "768px"},
                "tablet-above": {min: "768px"},
                "laptop": {max: "1024px"},
                "laptop-above": {min: "1024px"},
            },
            colors: {
                page: "var(--page-color)",
                "background": "var(--background-color)",
                "background-elevated-1": "var(--background-elevated-1-color)",
                "background-elevated-2": "var(--background-elevated-2-color)",
                "background-elevated-3": "var(--background-elevated-3-color)",
                "background-elevated-4": "var(--background-elevated-4-color)",
                "gray-soft": "var(--gray-soft-color)",
                "gray": "var(--gray-color)",
                "gray-contrast": "var(--gray-contrast-color)",
                "text": "var(--text-color)",
                "text-alt": "var(--text-alt-color)",
                "text-weak": "var(--text-weak-color)",
                "contrast": "var(--contrast-color)",
                harmonic: "var(--harmonic-color)",
                "red": "var(--red-color)",
                "orange": "var(--orange-color)",
                "yellow": "var(--yellow-color)",
                "green": "var(--green-color)",
                "sky-blue": "var(--sky-blue-color)",
                "blue": "var(--blue-color)",
                "purple": "var(--purple-color)",
                "pink": "var(--pink-color)",
                "white": "var(--white-color)",
                "black": "var(--black-color)",
            },
            height: {
                "header": "var(--header-height)",
            },
            width: {
                "content": "var(--content-width)",
                "sidebar": "var(--sidebar-width)",
            },
            padding: {
                "header-height": "var(--header-height)",
                "content-width": "var(--content-width)",
            },
            margin: {
                "header-height": "var(--header-height)",
                "content-width": "var(--content-width)",
            },
            spacing: {
                "header-height": "var(--header-height)",
                "header-account-menu": "var(--header-account-menu-spacing)",
            },
            animation: {
                appearance: "appearance 0.1s ease-out",
                "appearance-down": "appearance-down 0.25s ease-out",
            },
            keyframes: {
                "appearance-down": {
                    from: {
                        translate: "0 -100%",
                    },
                    to: {
                        translate: "0",
                    },
                },
            },
        },
    },
    plugins: [],
} satisfies Config;

