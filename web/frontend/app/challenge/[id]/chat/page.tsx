"use client";
import { useState, useEffect, useRef, use } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { timeAgo } from "@/lib/utils";
import { ChatMessage, Challenge } from "@/../shared/types";

export default function ChallengeChatPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [text, setText] = useState("");
    const [challenge, setChallenge] = useState<Challenge | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        api.getChallenge(id).then(setChallenge).catch(() => { });
        api.getChatMessages(id).then(setMessages).catch(() => { });
    }, [id]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const sendMessage = async () => {
        if (!text.trim()) return;
        try {
            const msg = await api.sendChatMessage(id, text.trim());
            setMessages(prev => [...prev, msg]);
            setText("");
        } catch { }
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100dvh" }}>
            {/* Header */}
            <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 12 }}>
                <button className="back-btn" onClick={() => router.back()}>
                    <span className="material-icons">arrow_back</span>
                </button>
                <div>
                    <div style={{ fontWeight: 700, fontSize: 14, fontFamily: "var(--font-heading)" }}>{challenge?.title || "Chat"}</div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{challenge?.participantCount || 0} members</div>
                </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} style={{ flex: 1, overflow: "auto", padding: "16px 16px 8px" }}>
                {messages.length === 0 && (
                    <div className="empty-state" style={{ height: "100%" }}>
                        <span className="material-icons">chat_bubble_outline</span>
                        <p>Start the conversation!</p>
                    </div>
                )}
                {messages.map(msg => {
                    const isMe = msg.senderId === "u1";
                    return (
                        <div key={msg.id} style={{
                            display: "flex", justifyContent: isMe ? "flex-end" : "flex-start",
                            alignItems: "flex-end", gap: 6, marginBottom: 12,
                        }}>
                            {!isMe && (
                                <div className="avatar avatar-sm" style={{ background: "var(--accent-soft)", color: "var(--accent)" }}>
                                    {msg.senderName?.[0]}
                                </div>
                            )}
                            <div className={`chat-bubble ${isMe ? "sent" : "received"}`}>
                                {!isMe && (
                                    <div style={{ fontSize: 11, fontWeight: 700, color: "var(--accent)", marginBottom: 2 }}>{msg.senderName}</div>
                                )}
                                <div style={{ fontSize: 14 }}>{msg.message}</div>
                                <div style={{ fontSize: 9, opacity: 0.6, textAlign: "right", marginTop: 4 }}>{timeAgo(msg.sentAt)}</div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Input */}
            <div style={{ padding: "8px 16px 12px", borderTop: "1px solid var(--border)", display: "flex", gap: 8, background: "var(--bg-card)" }}>
                <input className="hc-input" style={{ borderRadius: "var(--radius-full)" }}
                    placeholder="Message..." value={text} onChange={e => setText(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && sendMessage()} />
                <button className="send-btn" onClick={sendMessage}>
                    <span className="material-icons">send</span>
                </button>
            </div>
        </div>
    );
}
