"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Challenge } from "@/../shared/types";

export default function ChallengesPage() {
    const [challenges, setChallenges] = useState<Challenge[]>([]);
    const router = useRouter();

    useEffect(() => {
        api.getChallenges().then(setChallenges).catch(() => { });
    }, []);

    const active = challenges.filter(c => c.isActive);
    const upcoming = challenges.filter(c => !c.isActive && c.daysRemaining > 0);

    return (
        <div className="page">
            <div style={{ textAlign: "center", marginBottom: 20 }}>
                <h1 style={{ fontSize: 24, fontFamily: "var(--font-heading)", fontWeight: 800 }}>Challenges</h1>
            </div>

            {/* Active */}
            <div className="section-title" style={{ marginBottom: 12 }}>🔥 Active Challenges</div>
            <div className="stagger">
                {active.length === 0 && (
                    <div className="hc-card">
                        <div className="empty-state" style={{ padding: 24 }}>
                            <span className="material-icons" style={{ fontSize: 48 }}>emoji_events</span>
                            <p>No active challenges</p>
                        </div>
                    </div>
                )}
                {active.map(ch => (
                    <div key={ch.id} className="hc-card interactive" onClick={() => router.push(`/challenge/${ch.id}`)}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                            <span className="hc-chip active" style={{ fontSize: 10, padding: "3px 10px" }}>{ch.habitCategory}</span>
                            <span style={{ fontSize: 12, color: "var(--success)", fontWeight: 700, background: "rgba(74,222,128,0.15)", padding: "3px 8px", borderRadius: 8 }}>
                                {ch.daysRemaining}d left
                            </span>
                        </div>
                        <h3 style={{ fontSize: 15, fontWeight: 700, fontFamily: "var(--font-heading)", marginBottom: 4 }}>{ch.title}</h3>
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 12, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as any }}>
                            {ch.description}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 12, color: "var(--text-muted)" }}>
                            <span><span className="material-icons" style={{ fontSize: 14, verticalAlign: "middle" }}>people</span> {ch.participantCount}/{ch.maxParticipants}</span>
                            <span>by {ch.creatorName}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Upcoming */}
            {upcoming.length > 0 && (
                <>
                    <div className="section-title" style={{ marginTop: 24, marginBottom: 12 }}>📅 Upcoming</div>
                    <div className="stagger">
                        {upcoming.map(ch => (
                            <div key={ch.id} className="hc-card interactive" onClick={() => router.push(`/challenge/${ch.id}`)}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                                    <span className="hc-chip" style={{ fontSize: 10, padding: "3px 10px" }}>{ch.habitCategory}</span>
                                    <span style={{ fontSize: 11, color: "var(--text-muted)" }}>Starts in {ch.daysRemaining}d</span>
                                </div>
                                <h3 style={{ fontSize: 15, fontWeight: 700, fontFamily: "var(--font-heading)" }}>{ch.title}</h3>
                                <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 4 }}>{ch.description}</p>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
