export type ThemeConfig = {
    id: string;
    label: string;
    bg: string;
    surface: string;
    border: string;
    accent: string;
    text: string;
    textMuted: string;
    inputBg: string;
    emoji: string;
    backgroundUrl?: string;
    backgroundCss?: string;
    fontFamily?: string;
};

export const THEMES: Record<string, ThemeConfig> = {
    forest: {
        id: "forest",
        label: "Forest",
        bg: "#0d1b12",
        surface: "#1b2f23",
        border: "#2d6a4f",
        accent: "#52b788",
        text: "#d8f3dc",
        textMuted: "#95b8a0",
        inputBg: "rgba(27,47,35,0.6)",
        emoji: "🌲",
        backgroundUrl: "/assets/website-background.jpg",
    },
    water: {
        id: "water",
        label: "Water",
        bg: "#03045e",
        surface: "#023e8a",
        border: "#0077b6",
        accent: "#00b4d8",
        text: "#caf0f8",
        textMuted: "#90e0ef",
        inputBg: "rgba(2,62,138,0.5)",
        emoji: "🌊",
        backgroundUrl: "/poolimage_2.jpg",
    },
    snow: {
        id: "snow",
        label: "Snow",
        bg: "#020617",
        surface: "rgba(15,23,42,0.4)",
        border: "#1e293b",
        accent: "#38bdf8",
        text: "#f8fafc",
        textMuted: "#94a3b8",
        inputBg: "rgba(30,41,59,0.5)",
        emoji: "❄️"
    },
    fire: {
        id: "fire",
        label: "Fire",
        bg: "#0a0a0a",
        surface: "rgba(20,10,10,0.5)",
        border: "#451a1a",
        accent: "#ef4444",
        text: "#fef2f2",
        textMuted: "#fca5a5",
        inputBg: "rgba(30,15,15,0.6)",
        emoji: "🔥"
    },
    desert: {
        id: "desert",
        label: "Desert",
        bg: "#1c140d",
        surface: "rgba(40, 25, 15, 0.5)",
        border: "#8c6b4a",
        accent: "#e1a555",
        text: "#fdf8f4",
        textMuted: "#bfa38a",
        inputBg: "rgba(60, 40, 25, 0.6)",
        emoji: "🏜️"
    },
};

export const getThemeConfig = (themeId?: string | null): ThemeConfig => {
    if (!themeId) return THEMES.forest!;
    return THEMES[themeId] || THEMES.forest!;
};
