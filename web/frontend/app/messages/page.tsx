"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { timeAgo } from "@/lib/utils";
import { Conversation } from "@/../shared/types";

export default function ConversationsPage() {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const router = useRouter();

    useEffect(() => {
        api.getConversations().then(setConversations).catch(() => { });
    }, []);

    return (
        <div className="page">
            <div className="page-header">
                <button className="back-btn" onClick={() => router.back()}>
                    <span className="material-icons">arrow_back</span>
                </button>
                <h1>Messages</h1>
            </div>

            {conversations.length === 0 ? (
                <div className="empty-state">
                    <span className="material-icons">chat_bubble_outline</span>
                    <p>No conversations yet</p>
                    <p style={{ fontSize: 12, color: "var(--text-muted)" }}>Visit a profile to start a chat</p>
                </div>
            ) : (
                <div className="stagger">
                    {conversations.map(conv => (
                        <div key={conv.userId} className="hc-card interactive" style={{ padding: "12px 16px" }}
                            onClick={() => router.push(`/messages/${conv.userId}`)}>
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                <div className="avatar avatar-md" style={{ background: "var(--accent-soft)", color: "var(--accent)" }}>
                                    {conv.name?.[0]}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <span style={{ fontWeight: conv.unreadCount > 0 ? 700 : 500, fontSize: 14 }}>{conv.name}</span>
                                        <span style={{ fontSize: 10, color: "var(--text-muted)" }}>{timeAgo(conv.lastMessageAt)}</span>
                                    </div>
                                    <p style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                        {conv.lastMessage}
                                    </p>
                                </div>
                                {conv.unreadCount > 0 && (
                                    <div style={{ width: 20, height: 20, borderRadius: "50%", background: "var(--accent)", color: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700 }}>
                                        {conv.unreadCount}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
