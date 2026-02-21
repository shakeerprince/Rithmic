"use client";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { timeAgo } from "@/lib/utils";
import { Post, PostComment } from "@/../shared/types";

export default function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [post, setPost] = useState<Post | null>(null);
    const [comments, setComments] = useState<PostComment[]>([]);
    const [newComment, setNewComment] = useState("");
    const router = useRouter();

    useEffect(() => {
        api.getPost(id).then(setPost).catch(() => { });
        api.getComments(id).then(setComments).catch(() => { });
    }, [id]);

    const handleAddComment = async () => {
        if (!newComment.trim()) return;
        try {
            await api.addComment(id, newComment);
            setNewComment("");
            api.getComments(id).then(setComments);
            setPost((p: Post | null) => p ? { ...p, commentCount: (p.commentCount || 0) + 1 } : p);
        } catch { }
    };

    const handleVote = async (direction: number) => {
        if (!post) return;
        const newDir = post.userVote === direction ? 0 : direction;
        try {
            const result = (await api.votePost(id, newDir));
            setPost((p: Post | null) => p ? ({ ...p, ...result }) : null);
        } catch { }
    };

    if (!post) return <div className="page"><div className="skeleton" style={{ height: 200, marginTop: 60 }} /></div>;

    return (
        <div className="page" style={{ paddingBottom: 120 }}>
            <div className="page-header">
                <button className="back-btn" onClick={() => router.back()}>
                    <span className="material-icons">arrow_back</span>
                </button>
                <h1>Post</h1>
            </div>

            {/* Post */}
            <div className="hc-card" style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                    <div className="avatar avatar-md" style={{ background: "var(--accent-soft)", color: "var(--accent)", cursor: "pointer" }}
                        onClick={() => router.push(`/user/${post.authorId}`)}>
                        {post.authorName?.[0]}
                    </div>
                    <div style={{ cursor: "pointer" }} onClick={() => router.push(`/user/${post.authorId}`)}>
                        <div style={{ fontWeight: 700, fontSize: 14 }}>{post.authorName}</div>
                        <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{timeAgo(post.createdAt)}</div>
                    </div>
                </div>
                {post.habitName && (
                    <span className="hc-chip" style={{ marginBottom: 8, fontSize: 10, padding: "2px 8px" }}>{post.habitName}</span>
                )}
                <h2 style={{ fontSize: 18, fontWeight: 700, fontFamily: "var(--font-heading)", marginBottom: 8 }}>{post.title}</h2>
                <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6 }}>{post.body}</p>

                <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 16 }}>
                    <div className="vote-group">
                        <button className={`vote-btn ${post.userVote === 1 ? "upvoted" : ""}`} onClick={() => handleVote(1)}>
                            <span className="material-icons" style={{ fontSize: 18 }}>arrow_upward</span>
                        </button>
                        <span className="vote-score">{post.upvotes - post.downvotes}</span>
                        <button className={`vote-btn ${post.userVote === -1 ? "downvoted" : ""}`} onClick={() => handleVote(-1)}>
                            <span className="material-icons" style={{ fontSize: 18 }}>arrow_downward</span>
                        </button>
                    </div>
                    <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
                        <span className="material-icons" style={{ fontSize: 16, verticalAlign: "middle" }}>chat_bubble_outline</span> {post.commentCount}
                    </span>
                </div>
            </div>

            {/* Comments */}
            <div className="section-title" style={{ marginBottom: 12 }}>💬 Comments</div>
            <div className="stagger">
                {comments.map((c: PostComment) => (
                    <div key={c.id} className="hc-card" style={{ padding: 12 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                            <div className="avatar avatar-sm" style={{ background: "var(--accent-soft)", color: "var(--accent)", cursor: "pointer" }}
                                onClick={() => router.push(`/user/${c.authorId}`)}>{c.authorName?.[0]}</div>
                            <span style={{ fontSize: 13, fontWeight: 600, cursor: "pointer" }}
                                onClick={() => router.push(`/user/${c.authorId}`)}>{c.authorName}</span>
                            <span style={{ fontSize: 11, color: "var(--text-muted)" }}>· {timeAgo(c.createdAt)}</span>
                        </div>
                        <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>{c.body}</p>
                    </div>
                ))}
            </div>

            {/* Comment Input */}
            <div className="chat-input-bar">
                <input className="hc-input" placeholder="Add a comment..." value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleAddComment()} />
                <button className="send-btn" onClick={handleAddComment}>
                    <span className="material-icons">send</span>
                </button>
            </div>
        </div>
    );
}
