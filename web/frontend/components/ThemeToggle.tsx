"use client";
import { useEffect, useState } from "react";

// Theme Toggle Component
export default function ThemeToggle() {
    const [theme, setTheme] = useState("dark");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem("theme");
        if (stored) {
            setTheme(stored);
            document.documentElement.setAttribute("data-theme", stored);
        } else {
            document.documentElement.setAttribute("data-theme", "dark");
        }
        setMounted(true);
    }, []);

    const toggle = () => {
        const next = theme === "dark" ? "light" : "dark";
        setTheme(next);
        localStorage.setItem("theme", next);
        document.documentElement.setAttribute("data-theme", next);

        // Dispatch custom event if needed, but attribute change is enough for CSS
    };

    if (!mounted) return null;

    return (
        <div className="settings-row" onClick={toggle}>
            <div className="settings-icon">
                <span className="material-icons" style={{ fontSize: 20 }}>
                    {theme === "dark" ? "dark_mode" : "light_mode"}
                </span>
            </div>
            <div style={{ flex: 1 }}>
                <div className="settings-label">App Theme</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                    {theme === "dark" ? "Dark Neon" : "Lifestyle Light"}
                </div>
            </div>

            {/* Custom Toggle Switch */}
            <div style={{
                position: "relative",
                width: 48,
                height: 28,
                borderRadius: 999,
                background: theme === "dark" ? "var(--bg-input)" : "var(--accent)",
                border: theme === "dark" ? "2px solid var(--border)" : "2px solid var(--accent)",
                transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                cursor: "pointer"
            }}>
                <div style={{
                    position: "absolute",
                    top: 2,
                    left: 2,
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: theme === "dark" ? "var(--text-muted)" : "#0A0A0F",
                    transform: theme === "dark" ? "translateX(0)" : "translateX(20px)",
                    transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
                }} />
            </div>
        </div>
    );
}
