import "dotenv/config";
import { db } from "./index";
import { usersTable } from "./models/user";
import { formsTable } from "./models/form";
import { formFieldsTable } from "./models/form-field";
import { formSubmissionsTable } from "./models/form-submission";
import { formThemesTable } from "./models/form-theme";
import bcrypt from "bcryptjs";

// Nature-inspired interactive themes
const themes = [
    {
        name: "forest",
        label: "Forest",
        description: "Cinematic forest parallax with interactive leaves",
        category: "nature",
        emoji: "🌲",
        colors: {
            primary: "#2d6a4f",
            background: "#0d1b12",
            surface: "#1b2f23",
            text: "#d8f3dc",
            textMuted: "#95b8a0",
            accent: "#52b788",
            border: "#2d6a4f",
        },
    },
    {
        name: "water",
        label: "Water",
        description: "Interactive ripples on a deep blue ocean",
        category: "nature",
        emoji: "🌊",
        colors: {
            primary: "#0077b6",
            background: "#03045e",
            surface: "#023e8a",
            text: "#caf0f8",
            textMuted: "#90e0ef",
            accent: "#00b4d8",
            border: "#0077b6",
        },
    },
    {
        name: "snow",
        label: "Snow",
        description: "Pixel snowfall simulation with dynamic lighting",
        category: "nature",
        emoji: "❄️",
        colors: {
            primary: "#4a90d9",
            background: "#020617",
            surface: "rgba(15,23,42,0.4)",
            text: "#f8fafc",
            textMuted: "#94a3b8",
            accent: "#38bdf8",
            border: "#1e293b",
        },
    },
    {
        name: "fire",
        label: "Fire",
        description: "Liquid ether fluid simulation with warm dancing flames",
        category: "nature",
        emoji: "🔥",
        colors: {
            primary: "#e85d04",
            background: "#0a0a0a",
            surface: "rgba(20,10,10,0.5)",
            text: "#fef2f2",
            textMuted: "#fca5a5",
            accent: "#ef4444",
            border: "#451a1a",
        },
    },
    {
        name: "desert",
        label: "Desert",
        description: "Interactive dithered dune waves in terracotta",
        category: "nature",
        emoji: "🏜️",
        colors: {
            primary: "#c77f3c",
            background: "#1c140d",
            surface: "rgba(40, 25, 15, 0.5)",
            text: "#fdf8f4",
            textMuted: "#bfa38a",
            accent: "#e1a555",
            border: "#8c6b4a",
        },
    },
];

// Demo user
const demoUser = {
    fullName: "Demo User",
    email: "demo@root-forms.sameerdev.tech",
    password: "Demo@12345",
};

// Sample forms data
const sampleForms = [
    {
        title: "Anime Fan Survey 2025",
        description: "Tell us about your favorite anime shows, characters and studios. This is a community survey for anime enthusiasts!",
        visibility: "public" as const,
        status: "published" as const,
        theme: "snow",
        submitMessage: "Thanks for sharing your anime taste! 🎌 Results will be published on our community page.",
        fields: [
            { label: "What is your favorite anime genre?", type: "SELECT" as const, isRequired: true, options: [
                { label: "Action/Shonen", value: "action_shonen" },
                { label: "Romance", value: "romance" },
                { label: "Isekai", value: "isekai" },
                { label: "Slice of Life", value: "slice_of_life" },
                { label: "Horror/Psychological", value: "horror_psychological" },
                { label: "Sci-Fi/Mecha", value: "scifi_mecha" },
            ]},
            { label: "Your all-time favorite anime", type: "SHORT_TEXT" as const, isRequired: true, placeholder: "e.g. Attack on Titan, One Piece..." },
            { label: "How many episodes do you watch per week?", type: "RATING" as const, isRequired: false, validations: { maxRating: 10 } },
            { label: "Which studios do you love?", type: "MULTI_SELECT" as const, isRequired: false, options: [
                { label: "MAPPA", value: "mappa" },
                { label: "Ufotable", value: "ufotable" },
                { label: "Bones", value: "bones" },
                { label: "WIT Studio", value: "wit" },
                { label: "A-1 Pictures", value: "a1" },
            ]},
            { label: "Would you recommend anime to non-watchers?", type: "YES_NO" as const, isRequired: true },
            { label: "Tell us about your anime journey", type: "LONG_TEXT" as const, isRequired: false, placeholder: "When did you start? What got you hooked?" },
            { label: "Your email for community newsletter", type: "EMAIL" as const, isRequired: false, placeholder: "you@example.com" },
        ],
    },
    {
        title: "Game Developer Job Application",
        description: "Apply for a position at our indie game studio. We're building the next great open-world RPG.",
        visibility: "public" as const,
        status: "published" as const,
        theme: "forest",
        submitMessage: "Your application has been received! We'll review it and get back to you within 5 business days. 🎮",
        fields: [
            { label: "Full Name", type: "SHORT_TEXT" as const, isRequired: true, placeholder: "Your full name" },
            { label: "Email Address", type: "EMAIL" as const, isRequired: true, placeholder: "your@email.com" },
            { label: "Years of game development experience", type: "NUMBER" as const, isRequired: true, validations: { minValue: 0, maxValue: 50 } },
            { label: "Primary role you're applying for", type: "SELECT" as const, isRequired: true, options: [
                { label: "Game Programmer", value: "programmer" },
                { label: "Game Designer", value: "designer" },
                { label: "3D Artist", value: "artist_3d" },
                { label: "2D Artist / UI Artist", value: "artist_2d" },
                { label: "Sound Designer", value: "sound" },
                { label: "QA Tester", value: "qa" },
            ]},
            { label: "Engines you're comfortable with", type: "MULTI_SELECT" as const, isRequired: true, options: [
                { label: "Unity", value: "unity" },
                { label: "Unreal Engine", value: "unreal" },
                { label: "Godot", value: "godot" },
                { label: "Custom Engine", value: "custom" },
            ]},
            { label: "Motivation letter", type: "LONG_TEXT" as const, isRequired: true, placeholder: "Tell us why you want to join our studio and what you'll bring to the team...", validations: { minLength: 100, maxLength: 2000 } },
            { label: "Portfolio / GitHub URL", type: "SHORT_TEXT" as const, isRequired: false, placeholder: "https://..." },
            { label: "How strong are your skills? (1-5)", type: "RATING" as const, isRequired: true, validations: { maxRating: 5 } },
        ],
    },
    {
        title: "Startup Idea Validator",
        description: "Validate your startup idea with potential users before you build. Answer these questions to help us understand your concept.",
        visibility: "unlisted" as const,
        status: "published" as const,
        theme: "fire",
        submitMessage: "🚀 Thanks! Your feedback helps us shape the product. We'll share insights with all participants.",
        fields: [
            { label: "What problem does your startup solve?", type: "SHORT_TEXT" as const, isRequired: true, placeholder: "Describe the core problem in one sentence" },
            { label: "Who is your target customer?", type: "SHORT_TEXT" as const, isRequired: true, placeholder: "e.g. Small business owners, students, remote workers..." },
            { label: "Would you pay for this solution?", type: "YES_NO" as const, isRequired: true },
            { label: "How much would you pay monthly? (in ₹)", type: "NUMBER" as const, isRequired: false, validations: { minValue: 0, maxValue: 100000 } },
            { label: "What stage are you at?", type: "SELECT" as const, isRequired: true, options: [
                { label: "Just an idea", value: "idea" },
                { label: "Research phase", value: "research" },
                { label: "Building MVP", value: "mvp" },
                { label: "Have early customers", value: "customers" },
                { label: "Revenue generating", value: "revenue" },
            ]},
            { label: "What are your biggest challenges?", type: "MULTI_SELECT" as const, isRequired: false, options: [
                { label: "Finding customers", value: "customers" },
                { label: "Building the product", value: "building" },
                { label: "Hiring team", value: "hiring" },
                { label: "Raising funds", value: "funding" },
                { label: "Marketing", value: "marketing" },
            ]},
            { label: "Additional thoughts or feedback", type: "LONG_TEXT" as const, isRequired: false, placeholder: "Anything else you'd like to share?" },
        ],
    },
    {
        title: "Movie Night Picker",
        description: "Help us decide what movie to watch this Friday! Vote for your preferences and we'll pick the winner.",
        visibility: "public" as const,
        status: "published" as const,
        theme: "water",
        submitMessage: "🎬 Vote submitted! Results will be announced on Friday at 7 PM. Get your popcorn ready!",
        fields: [
            { label: "Your name", type: "SHORT_TEXT" as const, isRequired: true, placeholder: "What should we call you?" },
            { label: "Favorite genre for tonight", type: "SELECT" as const, isRequired: true, options: [
                { label: "Action / Thriller", value: "action" },
                { label: "Comedy", value: "comedy" },
                { label: "Horror", value: "horror" },
                { label: "Sci-Fi", value: "scifi" },
                { label: "Romance", value: "romance" },
                { label: "Documentary", value: "documentary" },
            ]},
            { label: "Movie you'd nominate", type: "SHORT_TEXT" as const, isRequired: false, placeholder: "Name a specific movie..." },
            { label: "How excited are you for movie night? (1-10)", type: "RATING" as const, isRequired: true, validations: { maxRating: 10 } },
            { label: "Snack preferences", type: "MULTI_SELECT" as const, isRequired: false, options: [
                { label: "Popcorn", value: "popcorn" },
                { label: "Pizza", value: "pizza" },
                { label: "Nachos", value: "nachos" },
                { label: "Chips & Dips", value: "chips" },
                { label: "Chocolate", value: "chocolate" },
            ]},
            { label: "Will you join in person?", type: "YES_NO" as const, isRequired: true },
        ],
    },
];

// Sample submission data generators
const animeSubmissions = [
    { genre: "action_shonen", anime: "Attack on Titan", rating: 9, studios: ["mappa", "wit"], recommend: "true" },
    { genre: "isekai", anime: "Re:Zero", rating: 7, studios: ["wit"], recommend: "true" },
    { genre: "romance", anime: "Your Name", rating: 10, studios: ["mappa"], recommend: "true" },
    { genre: "horror_psychological", anime: "Death Note", rating: 8, studios: ["mappa"], recommend: "true" },
    { genre: "slice_of_life", anime: "Violet Evergarden", rating: 9, studios: ["ufotable"], recommend: "true" },
    { genre: "action_shonen", anime: "Demon Slayer", rating: 10, studios: ["ufotable"], recommend: "true" },
    { genre: "scifi_mecha", anime: "Neon Genesis Evangelion", rating: 8, studios: ["bones"], recommend: "false" },
    { genre: "isekai", anime: "Sword Art Online", rating: 6, studios: ["a1"], recommend: "true" },
    { genre: "action_shonen", anime: "My Hero Academia", rating: 7, studios: ["bones"], recommend: "true" },
    { genre: "romance", anime: "Clannad", rating: 9, studios: ["mappa"], recommend: "true" },
    { genre: "horror_psychological", anime: "Monster", rating: 10, studios: ["bones"], recommend: "true" },
    { genre: "isekai", anime: "Overlord", rating: 7, studios: ["mappa"], recommend: "true" },
    { genre: "slice_of_life", anime: "K-On!", rating: 8, studios: ["a1"], recommend: "true" },
    { genre: "action_shonen", anime: "Black Clover", rating: 6, studios: ["mappa"], recommend: "false" },
    { genre: "scifi_mecha", anime: "Gurren Lagann", rating: 10, studios: ["bones"], recommend: "true" },
    { genre: "romance", anime: "Toradora", rating: 9, studios: ["a1"], recommend: "true" },
    { genre: "action_shonen", anime: "Fullmetal Alchemist Brotherhood", rating: 10, studios: ["bones"], recommend: "true" },
    { genre: "isekai", anime: "The Rising of the Shield Hero", rating: 7, studios: ["a1"], recommend: "true" },
    { genre: "horror_psychological", anime: "Tokyo Ghoul", rating: 7, studios: ["mappa"], recommend: "false" },
    { genre: "slice_of_life", anime: "Barakamon", rating: 8, studios: ["bones"], recommend: "true" },
];

async function main() {
    console.log("🌱 Starting seed...");

    // Clear existing data
    await db.delete(formSubmissionsTable);
    await db.delete(formFieldsTable);
    await db.delete(formsTable);
    await db.delete(formThemesTable);
    await db.delete(usersTable);

    // Seed themes
    console.log("🎨 Seeding themes...");
    for (const theme of themes) {
        await db.insert(formThemesTable).values(theme);
    }

    // Create demo user
    console.log("👤 Creating demo user...");
    const passwordHash = await bcrypt.hash(demoUser.password, 10);
    const [user] = await db
        .insert(usersTable)
        .values({
            fullName: demoUser.fullName,
            email: demoUser.email,
            passwordHash,
        })
        .returning({ id: usersTable.id });

    if (!user) throw new Error("Failed to create demo user");
    const userId = user.id;

    // Seed forms
    console.log("📝 Seeding forms...");
    const now = new Date();

    for (let fi = 0; fi < sampleForms.length; fi++) {
        const formData = sampleForms[fi]!;

        const [form] = await db
            .insert(formsTable)
            .values({
                title: formData.title,
                description: formData.description,
                status: formData.status,
                visibility: formData.visibility,
                theme: formData.theme,
                submitMessage: formData.submitMessage,
                createdBy: userId,
            })
            .returning({ id: formsTable.id });

        if (!form) continue;
        const formId = form.id;

        // Seed fields
        const fieldIds: string[] = [];
        for (let idx = 0; idx < formData.fields.length; idx++) {
            const field = formData.fields[idx]!;
            const labelKey = field.label
                .toLowerCase()
                .replace(/[^a-z0-9\s]/g, "")
                .replace(/\s+/g, "_")
                .slice(0, 100);

            const [createdField] = await db
                .insert(formFieldsTable)
                .values({
                    formId,
                    label: field.label,
                    labelKey,
                    type: field.type,
                    isRequired: field.isRequired,
                    placeholder: (field as any).placeholder ?? null,
                    options: (field as any).options ?? null,
                    validations: (field as any).validations ?? null,
                    index: String(idx),
                })
                .returning({ id: formFieldsTable.id });

            if (createdField) fieldIds.push(createdField.id);
        }

        // Generate sample submissions spread over 30 days
        const numSubmissions = [20, 15, 10, 12][fi] ?? 10;
        console.log(`  📊 Creating ${numSubmissions} submissions for form: ${formData.title}`);

        for (let s = 0; s < numSubmissions; s++) {
            const daysAgo = Math.floor(Math.random() * 30);
            const submittedAt = new Date(now);
            submittedAt.setDate(submittedAt.getDate() - daysAgo);

            let values: any[] = [];

            if (fi === 0 && animeSubmissions[s]) {
                // Anime form
                const sub = animeSubmissions[s]!;
                values = fieldIds.map((fieldId, i) => ({
                    fieldId,
                    value: i === 0 ? sub.genre
                        : i === 1 ? sub.anime
                        : i === 2 ? String(sub.rating)
                        : i === 3 ? sub.studios.join(",")
                        : i === 4 ? sub.recommend
                        : i === 5 ? `I started watching anime ${Math.floor(Math.random() * 10) + 1} years ago and I love it!`
                        : `user${s}@example.com`,
                }));
            } else {
                // Generic submissions
                values = fieldIds.map((fieldId, i) => ({
                    fieldId,
                    value: i % 3 === 0 ? "Sample answer " + (s + 1)
                        : i % 3 === 1 ? String(Math.floor(Math.random() * 5) + 1)
                        : "true",
                }));
            }

            await db.insert(formSubmissionsTable).values({
                formId,
                values,
                createdAt: submittedAt,
            } as any);
        }
    }

    console.log("✅ Seed completed successfully!");
    console.log("\n📋 Demo Credentials:");
    console.log("   Email:    demo@root-forms.sameerdev.tech");
    console.log("   Password: Demo@12345");
    console.log("\n🌐 URLs:");
    console.log("   Frontend: http://localhost:3000");
    console.log("   API Docs: http://localhost:8000/docs");

    process.exit(0);
}

main().catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
});
