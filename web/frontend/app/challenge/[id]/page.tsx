"use client";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Challenge } from "@/../shared/types";

export default function ChallengeDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [challenge, setChallenge] = useState<Challenge | null>(null);
    const router = useRouter();

    useEffect(() => {
        api.getChallenge(id).then(setChallenge).catch(() => { });
    }, [id]);

    const handleJoin = async () => {
        try {
            await api.joinChallenge(id);
            api.getChallenge(id).then(setChallenge);
        } catch { }
    };

    if (!challenge) return <div className="page"><div className="skeleton" style={{ height: 300, marginTop: 60 }} /></div>;

    // Use a placeholder or check if current user is in participants
    const isJoined = challenge.participantIds?.includes("u1");
    const medals = ["🥇", "🥈", "🥉"];

    return (
        <div className="page">
            <div className="page-header">
                <button className="back-btn" onClick={() => router.back()}>
                    <span className="material-icons">arrow_back</span>
                </button>
                <h1 style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{challenge.title}</h1>
                <button className="back-btn" onClick={() => router.push(`/challenge/${id}/chat`)}>
                    <span className="material-icons">chat</span>
                </button>
            </div>

            {/* Info */}
            <div className="hc-card" style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                    <span className="hc-chip active" style={{ fontSize: 10, padding: "3px 10px" }}>{challenge.habitCategory}</span>
                    {challenge.isActive && (
                        <span style={{ fontSize: 13, color: "var(--success)", fontWeight: 700 }}>{challenge.daysRemaining} days left</span>
                    )}
                </div>
                <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 12 }}>{challenge.description}</p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 12, color: "var(--text-muted)" }}>
                    <span><span className="material-icons" style={{ fontSize: 14, verticalAlign: "middle" }}>people</span> {challenge.participantCount} participants</span>
                    <span>Created by {challenge.creatorName}</span>
                </div>
            </div>

            {/* Join / Chat Button */}
            {!isJoined ? (
                <button className="hc-btn hc-btn-primary hc-btn-full" onClick={handleJoin} style={{ marginBottom: 24 }}>
                    Join Challenge 🏆
                </button>
            ) : (
                <button className="hc-btn hc-btn-primary hc-btn-full" onClick={() => router.push(`/challenge/${id}/chat`)} style={{ marginBottom: 24 }}>
                    Open Group Chat 💬
                </button>
            )}

            {/* Leaderboard */}
            <div className="section-title" style={{ marginBottom: 12 }}>🏆 Leaderboard</div>
            <div className="stagger">
                {challenge.leaderboard?.length === 0 && (
                    <div className="hc-card"><div className="empty-state" style={{ padding: 24 }}>Challenge hasn&apos;t started yet</div></div>
                )}
                {challenge.leaderboard?.map((entry: { userId: string; name: string; score: number }, i: number) => {
                    const isYou = entry.userId === "u1";
                    return (
                        <div key={entry.userId} className="hc-card" style={{
                            background: isYou ? "var(--accent-soft)" : undefined,
                            padding: "12px 16px",
                        }}>
                            <div className="leaderboard-row" style={{ padding: 0 }}>
                                <div className="leaderboard-rank">{i < 3 ? medals[i] : `#${i + 1}`}</div>
                                <div className="avatar avatar-sm" style={{ background: "var(--accent-soft)", color: "var(--accent)" }}>
                                    {entry.name?.[0]}
                                </div>
                                <div style={{ flex: 1, fontWeight: isYou ? 700 : 500, fontSize: 14 }}>{entry.name}</div>
                                <div className="leaderboard-score">{entry.score} days</div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
