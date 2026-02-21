"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { timeAgo } from "@/lib/utils";
import { Post } from "@/../shared/types";

export default function CommunityPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [filter, setFilter] = useState("hot");
    const router = useRouter();

    useEffect(() => {
        api.getPosts(filter).then(setPosts).catch(() => { });
    }, [filter]);

    const handleVote = async (postId: string, direction: number, currentVote: number) => {
        const newDir = currentVote === direction ? 0 : direction;
        try {
            const result = await api.votePost(postId, newDir);
            setPosts(prev => prev.map(p => p.id === postId
                ? { ...p, upvotes: result.upvotes, downvotes: result.downvotes, userVote: result.userVote }
                : p
            ));
        } catch { }
    };

    return (
        <div className="page">
            <div style={{ textAlign: "center", marginBottom: 16 }}>
                <h1 style={{ fontSize: 24, fontFamily: "var(--font-heading)", fontWeight: 800 }}>Community</h1>
            </div>

            {/* Filters */}
            <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
                {["hot", "new", "top"].map(f => (
                    <button key={f} className={`hc-chip ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>
                        {f === "hot" ? "🔥" : f === "new" ? "✨" : "⭐"} {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                ))}
            </div>

            {/* Posts */}
            <div className="stagger">
                {posts.map(post => (
                    <div key={post.id} className="hc-card interactive" onClick={() => router.push(`/post/${post.id}`)}>
                        <div style={{ display: "flex", gap: 12 }}>
                            {/* Vote */}
                            <div className="vote-group" style={{ flexDirection: "column", padding: "8px 6px" }}
                                onClick={e => e.stopPropagation()}>
                                <button className={`vote-btn ${post.userVote === 1 ? "upvoted" : ""}`}
                                    onClick={() => handleVote(post.id, 1, post.userVote || 0)}>
                                    <span className="material-icons" style={{ fontSize: 18 }}>arrow_upward</span>
                                </button>
                                <span className="vote-score">{(post.upvotes || 0) - (post.downvotes || 0)}</span>
                                <button className={`vote-btn ${post.userVote === -1 ? "downvoted" : ""}`}
                                    onClick={() => handleVote(post.id, -1, post.userVote || 0)}>
                                    <span className="material-icons" style={{ fontSize: 18 }}>arrow_downward</span>
                                </button>
                            </div>

                            {/* Content */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                                    <div className="avatar avatar-sm" style={{ background: "var(--accent-soft)", color: "var(--accent)", cursor: "pointer" }}
                                        onClick={e => { e.stopPropagation(); router.push(`/user/${post.authorId}`); }}>
                                        {post.authorName?.[0] || "?"}
                                    </div>
                                    <span style={{ fontSize: 12, fontWeight: 600, cursor: "pointer" }}
                                        onClick={e => { e.stopPropagation(); router.push(`/user/${post.authorId}`); }}>{post.authorName}</span>
                                    <span style={{ fontSize: 11, color: "var(--text-muted)" }}>· {timeAgo(post.createdAt)}</span>
                                </div>
                                {post.habitName && (
                                    <span className="hc-chip" style={{ marginBottom: 6, fontSize: 10, padding: "2px 8px" }}>
                                        {post.habitName}
                                    </span>
                                )}
                                <h3 style={{ fontSize: 15, fontWeight: 700, fontFamily: "var(--font-heading)", marginBottom: 4 }}>
                                    {post.title}
                                </h3>
                                {/* eslint-disable @typescript-eslint/no-explicit-any */}
                                <div style={{
                                    fontSize: 13, color: "var(--text-secondary)", overflow: "hidden", textOverflow: "ellipsis",
                                    display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as any
                                }}>
                                    {post.body}
                                </div>
                                {/* eslint-enable @typescript-eslint/no-explicit-any */}
                                <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8, color: "var(--text-muted)", fontSize: 12 }}>
                                    <span className="material-icons" style={{ fontSize: 16 }}>chat_bubble_outline</span>
                                    {post.commentCount} comments
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* FAB */}
            <button className="fab" onClick={() => router.push("/create-post")}>
                <span className="material-icons">edit</span>
            </button>
        </div >
    );
}
