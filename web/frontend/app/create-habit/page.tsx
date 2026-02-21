"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

const CATEGORIES = ["Health", "Fitness", "Study", "Work", "Mindfulness", "Custom"];
const COLORS = [0xFF4ADE80, 0xFF6CB4EE, 0xFFCB6CE6, 0xFFFFD93D, 0xFFFF9F43, 0xFFFF4D6A, 0xFF00BCD4, 0xFF9C27B0];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function numToHex(v: number) { return "#" + (v & 0xFFFFFF).toString(16).padStart(6, "0"); }

export default function CreateHabitPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [category, setCategory] = useState("Fitness");
    const [startH, setStartH] = useState(6);
    const [startM, setStartM] = useState(0);
    const [endH, setEndH] = useState(7);
    const [endM, setEndM] = useState(0);
    const [frequency, setFrequency] = useState("Daily");
    const [selectedDays, setSelectedDays] = useState([1, 2, 3, 4, 5, 6, 7]);
    const [color, setColor] = useState(COLORS[0]);
    const [reminder, setReminder] = useState(true);
    const [loading, setLoading] = useState(false);

    const toggleDay = (d: number) => {
        setSelectedDays(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);
    };

    const handleSave = async () => {
        if (!name.trim()) return;
        setLoading(true);
        try {
            await api.createHabit({
                name, category, startHour: startH, startMinute: startM,
                endHour: endH, endMinute: endM, frequency,
                daysOfWeek: selectedDays, colorValue: color, reminderEnabled: reminder,
            });
            router.back();
        } catch { setLoading(false); }
    };

    return (
        <div className="page" style={{ paddingBottom: 40 }}>
            <div className="page-header">
                <button className="back-btn" onClick={() => router.back()}>
                    <span className="material-icons">arrow_back</span>
                </button>
                <h1>New Habit</h1>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {/* Name */}
                <div>
                    <label className="hc-label">Habit Name</label>
                    <input className="hc-input" placeholder="e.g. Morning Run" value={name} onChange={e => setName(e.target.value)} />
                </div>

                {/* Category */}
                <div>
                    <label className="hc-label">Category</label>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                        {CATEGORIES.map(c => (
                            <button key={c} className={`hc-chip ${category === c ? "active" : ""}`} onClick={() => setCategory(c)}>
                                {c}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Time */}
                <div style={{ display: "flex", gap: 12 }}>
                    <div style={{ flex: 1 }}>
                        <label className="hc-label">Start Time</label>
                        <input className="hc-input" type="time" value={`${startH.toString().padStart(2, "0")}:${startM.toString().padStart(2, "0")}`}
                            onChange={e => { const [h, m] = e.target.value.split(":").map(Number); setStartH(h); setStartM(m); }} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label className="hc-label">End Time</label>
                        <input className="hc-input" type="time" value={`${endH.toString().padStart(2, "0")}:${endM.toString().padStart(2, "0")}`}
                            onChange={e => { const [h, m] = e.target.value.split(":").map(Number); setEndH(h); setEndM(m); }} />
                    </div>
                </div>

                {/* Frequency */}
                <div>
                    <label className="hc-label">Frequency</label>
                    <div style={{ display: "flex", gap: 8 }}>
                        {["Daily", "Weekly", "Custom"].map(f => (
                            <button key={f} className={`hc-chip ${frequency === f ? "active" : ""}`} onClick={() => setFrequency(f)}>
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Days */}
                {frequency === "Custom" && (
                    <div>
                        <label className="hc-label">Days</label>
                        <div style={{ display: "flex", gap: 6 }}>
                            {DAYS.map((d, i) => (
                                <button key={d} className={`hc-chip ${selectedDays.includes(i + 1) ? "active" : ""}`}
                                    onClick={() => toggleDay(i + 1)} style={{ flex: 1, justifyContent: "center", padding: "8px 0" }}>
                                    {d}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Color */}
                <div>
                    <label className="hc-label">Color</label>
                    <div className="color-picker">
                        {COLORS.map(c => (
                            <div key={c} className={`color-swatch ${color === c ? "selected" : ""}`}
                                style={{ backgroundColor: numToHex(c) }} onClick={() => setColor(c)} />
                        ))}
                    </div>
                </div>

                {/* Reminder */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <label className="hc-label" style={{ margin: 0 }}>Daily Reminder</label>
                    <input type="checkbox" className="toggle-switch" checked={reminder} onChange={() => setReminder(!reminder)} />
                </div>

                {/* Save */}
                <button className="hc-btn hc-btn-primary hc-btn-full" onClick={handleSave} disabled={loading || !name.trim()}>
                    {loading ? "Creating..." : "Create Habit"} ✨
                </button>
            </div>
        </div>
    );
}
