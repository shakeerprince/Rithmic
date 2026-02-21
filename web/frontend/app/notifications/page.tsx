"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { timeAgo } from "@/lib/utils";
import { Notification } from "@/../shared/types";

const ICON_MAP: Record<string, { icon: string; color: string }> = {
    upvote: { icon: "arrow_upward", color: "#FF9F43" },
    post_reply: { icon: "chat_bubble_outline", color: "#6CB4EE" },
    challenge_invite: { icon: "emoji_events", color: "#FFD93D" },
    streak_milestone: { icon: "local_fire_department", color: "#FF4D6A" },
    chat_message: { icon: "forum", color: "#4ADE80" },
    reminder: { icon: "alarm", color: "#CB6CE6" },
};

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const router = useRouter();

    useEffect(() => {
        api.getNotifications().then(setNotifications).catch(() => { });
    }, []);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const markAllRead = async () => {
        try {
            await api.markAllRead();
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        } catch { }
    };

    const markRead = async (id: string) => {
        try {
            await api.markRead(id);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        } catch { }
    };

    return (
        <div className="page" style={{ paddingBottom: 20 }}>
            <div className="page-header">
                <button className="back-btn" onClick={() => router.back()}>
                    <span className="material-icons">arrow_back</span>
                </button>
                <h1 style={{ flex: 1 }}>Notifications</h1>
                {unreadCount > 0 && (
                    <button onClick={markAllRead} style={{ fontSize: 12, color: "var(--accent)", fontWeight: 600 }}>
                        Mark all read
                    </button>
                )}
            </div>

            {notifications.length === 0 ? (
                <div className="empty-state">
                    <span className="material-icons">notifications_off</span>
                    <p>No notifications yet</p>
                </div>
            ) : (
                <div className="stagger">
                    {notifications.map(n => {
                        const { icon, color } = ICON_MAP[n.type] || { icon: "notifications", color: "var(--accent)" };
                        return (
                            <div key={n.id} className={`notif-tile ${!n.isRead ? "unread" : ""}`} onClick={() => markRead(n.id)}>
                                <div className="notif-icon" style={{ background: `${color}22` }}>
                                    <span className="material-icons" style={{ fontSize: 18, color }}>{icon}</span>
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontWeight: n.isRead ? 500 : 700, fontSize: 14, fontFamily: "var(--font-heading)" }}>{n.title}</div>
                                    {/* eslint-disable @typescript-eslint/no-explicit-any */}
                                    <p style={{
                                        fontSize: 12, color: "var(--text-secondary)", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis",
                                        display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as any
                                    }}>{n.body}</p>
                                    {/* eslint-enable @typescript-eslint/no-explicit-any */}
                                    <span style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 4, display: "block" }}>{timeAgo(n.createdAt)}</span>
                                </div>
                                {!n.isRead && <div className="notif-unread-dot" />}
                            </div>
                        );
                    })}
                </div>
            )
            }
        </div >
    );
}
