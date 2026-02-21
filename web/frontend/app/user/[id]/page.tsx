"use client";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { timeAgo } from "@/lib/utils";
import { UserProfile, Post } from "@/../shared/types";

const BADGE_DEFS = [
    { name: "7-Day Warrior", emoji: "🥉" },
    { name: "14-Day Fighter", emoji: "🥈" },
    { name: "30-Day Legend", emoji: "🥇" },
    { name: "60-Day Master", emoji: "👑" },
    { name: "100-Day Champion", emoji: "💎" },
    { name: "365-Day Immortal", emoji: "🏆" },
];

function numToHex(v: number) { return "#" + (v & 0xFFFFFF).toString(16).padStart(6, "0"); }

export default function UserProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [tab, setTab] = useState<"habits" | "posts">("habits");
    const router = useRouter();

    useEffect(() => {
        api.getUserProfile(id).then(setProfile).catch(() => { });
    }, [id]);

    if (!profile) return <div className="page"><div className="skeleton" style={{ height: 300, marginTop: 60 }} /></div>;

    const myId = (() => { try { return JSON.parse(localStorage.getItem("hc_user") || "{}").id; } catch { return null; } })();
    const isMe = myId === id;

    return (
        <div className="page" style={{ paddingBottom: 40 }}>
            <div className="page-header">
                <button className="back-btn" onClick={() => router.back()}>
                    <span className="material-icons">arrow_back</span>
                </button>
                <h1 style={{ flex: 1 }}>{profile.name}</h1>
                {!isMe && (
                    <button className="back-btn" onClick={() => router.push(`/messages/${id}`)}>
                        <span className="material-icons">chat</span>
                    </button>
                )}
            </div>

            {/* Profile Header */}
            <div style={{ textAlign: "center", marginBottom: 20, animation: "pageIn 0.5s ease" }}>
                <div className="avatar avatar-xl" style={{ background: "var(--accent-soft)", color: "var(--accent)", margin: "0 auto 12px" }}>
                    {profile.name?.[0]}
                </div>
                <h2 style={{ fontSize: 20, fontFamily: "var(--font-heading)", fontWeight: 800 }}>{profile.name}</h2>
                <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 4 }}>{profile.bio}</p>
                <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>Joined {timeAgo(profile.createdAt)}</p>
            </div>

            {/* Stats */}
            <div className="stat-row" style={{ marginBottom: 20 }}>
                <div className="stat-item">
                    <div className="stat-value">{profile.stats.totalHabits}</div>
                    <div className="stat-label">Habits</div>
                </div>
                <div className="stat-item">
                    <div className="stat-value">{profile.stats.totalStreak}</div>
                    <div className="stat-label">Streak</div>
                </div>
                <div className="stat-item">
                    <div className="stat-value">{profile.stats.totalBadges}</div>
                    <div className="stat-label">Badges</div>
                </div>
                <div className="stat-item">
                    <div className="stat-value">{profile.stats.totalPosts}</div>
                    <div className="stat-label">Posts</div>
                </div>
            </div>

            {/* Message Button */}
            {!isMe && (
                <button className="hc-btn hc-btn-primary hc-btn-full" onClick={() => router.push(`/messages/${id}`)}
                    style={{ marginBottom: 20 }}>
                    💬 Send Message
                </button>
            )}

            {/* Badges */}
            {profile.badges.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                    <div className="section-title" style={{ marginBottom: 12 }}>🏅 Badges</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
                        {profile.badges.map((b: { name: string; earnedAt: string }) => {
                            const def = BADGE_DEFS.find(d => d.name === b.name);
                            return (
                                <div key={b.name} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 64 }}>
                                    <div className="badge-icon earned" style={{ fontSize: 24 }}>{def?.emoji || "🏅"}</div>
                                    <span style={{ fontSize: 9, fontWeight: 600, marginTop: 4, textAlign: "center" }}>{b.name}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Tabs */}
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                <button className={`hc-chip ${tab === "habits" ? "active" : ""}`} onClick={() => setTab("habits")}>Habits</button>
                <button className={`hc-chip ${tab === "posts" ? "active" : ""}`} onClick={() => setTab("posts")}>Posts</button>
            </div>

            {/* Habits Tab */}
            {tab === "habits" && (
                <div className="stagger">
                    {profile.habits.map((h) => (
                        <div key={h.id} className="hc-card" style={{ padding: "12px 16px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                <div style={{ width: 4, height: 36, borderRadius: 4, background: numToHex(h.colorValue || 0) }} />
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 700, fontSize: 14 }}>{h.name}</div>
                                    <span className="hc-chip" style={{ fontSize: 9, padding: "2px 6px", marginTop: 2 }}>{h.category}</span>
                                </div>
                                <div style={{ textAlign: "right" }}>
                                    <div style={{ fontSize: 16, fontWeight: 800, color: "var(--accent)" }}>{h.currentStreak}</div>
                                    <div style={{ fontSize: 9, color: "var(--text-muted)" }}>day streak</div>
                                </div>
                            </div>
                        </div>
                    ))}
                    {profile.habits.length === 0 && <div className="empty-state">No habits yet</div>}
                </div>
            )}

            {/* Posts Tab */}
            {tab === "posts" && (
                <div className="stagger">
                    {profile.posts.map((p: Post) => (
                        <div key={p.id} className="hc-card interactive" onClick={() => router.push(`/post/${p.id}`)}>
                            {p.habitName && <span className="hc-chip" style={{ fontSize: 9, padding: "2px 6px", marginBottom: 6 }}>{p.habitName}</span>}
                            <h3 style={{ fontSize: 14, fontWeight: 700 }}>{p.title}</h3>
                            <p style={{
                                fontSize: 12, color: "var(--text-secondary)", marginTop: 4, overflow: "hidden", textOverflow: "ellipsis",
                                display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical"
                            }}>{p.body}</p>
                            <div style={{ display: "flex", gap: 12, marginTop: 8, fontSize: 11, color: "var(--text-muted)" }}>
                                <span>⬆ {p.upvotes - p.downvotes}</span>
                                <span>💬 {p.commentCount}</span>
                                <span>{timeAgo(p.createdAt)}</span>
                            </div>
                        </div>
                    ))}
                    {profile.posts.length === 0 && <div className="empty-state">No posts yet</div>}
                </div>
            )}
        </div>
    );
}
