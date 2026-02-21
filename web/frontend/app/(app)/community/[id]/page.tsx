"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { api } from "@/lib/api";
import { timeAgo } from "@/lib/utils";
import { Community, Post, User } from "@/../shared/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

// Extended Community type for the detail page which includes members and posts
interface CommunityWithRelations extends Community {
    members?: (User & { role: string })[];
    posts?: Post[];
}

export default function CommunityDetailPage() {
    const { id } = useParams();
    const communityId = id as string;
    const [community, setCommunity] = useState<CommunityWithRelations | null>(null);
    const [showNewPost, setShowNewPost] = useState(false);
    const [postTitle, setPostTitle] = useState("");
    const [postBody, setPostBody] = useState("");
    const [postImage, setPostImage] = useState<string | undefined>(undefined);
    const [uploading, setUploading] = useState(false);
    const [posting, setPosting] = useState(false);
    const [showMembers, setShowMembers] = useState(false);
    const [copied, setCopied] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    useEffect(() => {
        if (communityId) api.getCommunity(communityId).then(setCommunity).catch(() => { });
    }, [communityId]);

    const handleJoin = async () => {
        await api.joinCommunity(communityId);
        setCommunity((c: CommunityWithRelations | null) => c ? { ...c, isJoined: true, memberCount: (c.memberCount || 0) + 1 } : c);
    };

    const handleLeave = async () => {
        await api.leaveCommunity(communityId);
        setCommunity((c: CommunityWithRelations | null) => c ? { ...c, isJoined: false, memberCount: Math.max(0, (c.memberCount || 0) - 1) } : c);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        try {
            const result = await api.uploadFile(file);
            setPostImage(`${API_BASE}${result.url}`);
        } catch { }
        setUploading(false);
    };

    const handlePost = async () => {
        if (!postTitle || !postBody) return;
        setPosting(true);
        try {
            await api.postInCommunity(communityId, { title: postTitle, body: postBody, imageUrl: postImage });
            setShowNewPost(false);
            setPostTitle(""); setPostBody(""); setPostImage(undefined);
            api.getCommunity(communityId).then(setCommunity);
        } catch { }
        setPosting(false);
    };

    const handleShareLink = () => {
        if (!community?.inviteCode) return;
        const link = `${window.location.origin}/invite/${community.inviteCode}`;
        navigator.clipboard.writeText(link).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    if (!community) return (
        <div className="page" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
            <div className="loading-spinner" />
        </div>
    );

    return (
        <div className="page" style={{ paddingBottom: 100 }}>
            {/* Header */}
            <div style={{ marginBottom: 20 }}>
                <button onClick={() => router.back()} style={{
                    background: "none", border: "none", color: "var(--text-muted)",
                    cursor: "pointer", display: "flex", alignItems: "center", gap: 4, marginBottom: 12, fontSize: 14, padding: 0
                }}>
                    <span className="material-icons" style={{ fontSize: 20 }}>arrow_back</span> Back
                </button>

                <div style={{
                    background: community.bannerImage
                        ? `url(${community.bannerImage}) center/cover`
                        : community.bannerColor || "var(--accent-soft)",
                    borderRadius: "var(--radius-lg)", padding: "24px 20px", marginBottom: 16,
                    position: "relative", overflow: "hidden", minHeight: 120,
                }}>
                    <div style={{ position: "relative", zIndex: 1 }}>
                        <div style={{ fontSize: 40, marginBottom: 8 }}>{community.icon || "🏠"}</div>
                        <h1 style={{ fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: 24, color: "#fff" }}>
                            {community.name}
                        </h1>
                        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", marginTop: 4 }}>
                            {community.memberCount} members · {community.category}
                        </p>
                    </div>
                    <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.35)" }} />
                </div>

                <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 16 }}>
                    {community.description}
                </p>

                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {community.isJoined ? (
                        <>
                            <button className="btn-primary" style={{ flex: 1 }} onClick={() => setShowNewPost(true)}>
                                ✏️ New Post
                            </button>
                            {community.myRole !== "admin" && (
                                <button className="hc-chip" onClick={handleLeave}>Leave</button>
                            )}
                        </>
                    ) : (
                        <button className="btn-primary" style={{ flex: 1 }} onClick={handleJoin}>
                            + Join Community
                        </button>
                    )}
                    <button className="hc-chip" onClick={() => setShowMembers(!showMembers)}>
                        👥 {community.memberCount}
                    </button>
                    <button className="hc-chip" onClick={handleShareLink} title="Copy invite link">
                        {copied ? "✓ Copied!" : "🔗 Share"}
                    </button>
                </div>

                {/* Invite link display */}
                {community.inviteCode && (
                    <div style={{
                        marginTop: 10, padding: "8px 12px", borderRadius: 8,
                        background: "var(--surface-elevated)", fontSize: 12, color: "var(--text-muted)",
                        display: "flex", alignItems: "center", gap: 8,
                    }}>
                        <span className="material-icons" style={{ fontSize: 16 }}>link</span>
                        <code style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis" }}>
                            {typeof window !== "undefined" ? `${window.location.origin}/invite/${community.inviteCode}` : ""}
                        </code>
                        <button onClick={handleShareLink} style={{
                            background: "var(--accent)", color: "#fff", border: "none", borderRadius: 6,
                            padding: "4px 10px", fontSize: 11, cursor: "pointer", fontWeight: 600,
                        }}>{copied ? "Copied!" : "Copy"}</button>
                    </div>
                )}
            </div>

            {/* Members (collapsible) */}
            {showMembers && (
                <div className="hc-card" style={{ marginBottom: 16 }}>
                    <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 14, marginBottom: 10 }}>
                        Members
                    </h3>
                    {community.members?.map((m) => (
                        <div key={m.id} className="leaderboard-row" onClick={() => router.push(`/user/${m.id}`)}
                            style={{ cursor: "pointer" }}>
                            <div className="avatar avatar-sm" style={{ background: "var(--accent-soft)", color: "var(--accent)" }}>
                                {m.name?.[0]}
                            </div>
                            <div style={{ flex: 1 }}>
                                <span style={{ fontWeight: 600, fontSize: 14 }}>{m.name}</span>
                                {m.role === "admin" && (
                                    <span style={{ fontSize: 10, color: "var(--accent)", fontWeight: 700, marginLeft: 6 }}>ADMIN</span>
                                )}
                            </div>
                            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Lv.{m.level}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Posts */}
            <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 16, marginBottom: 12 }}>
                Posts
            </h3>
            <div className="stagger">
                {(!community.posts || community.posts.length === 0) && (
                    <div style={{ textAlign: "center", padding: 30, color: "var(--text-muted)" }}>
                        <p style={{ fontSize: 28, marginBottom: 8 }}>📝</p>
                        <p style={{ fontWeight: 600 }}>No posts yet</p>
                        {community.isJoined && (
                            <button className="btn-primary" style={{ marginTop: 12 }} onClick={() => setShowNewPost(true)}>
                                Be the first to post!
                            </button>
                        )}
                    </div>
                )}
                {community.posts?.map((post: Post) => (
                    <div key={post.id} className="hc-card interactive" onClick={() => router.push(`/post/${post.id}`)}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                            <div className="avatar avatar-sm" style={{ background: "var(--accent-soft)", color: "var(--accent)" }}>
                                {post.authorName?.[0] || "?"}
                            </div>
                            <span style={{ fontWeight: 600, fontSize: 13 }}>{post.authorName}</span>
                            <span style={{ fontSize: 11, color: "var(--text-muted)" }}>· {timeAgo(post.createdAt)}</span>
                        </div>
                        <h4 style={{ fontWeight: 700, fontSize: 15, fontFamily: "var(--font-heading)", marginBottom: 4 }}>
                            {post.title}
                        </h4>
                        <p style={{
                            fontSize: 13, color: "var(--text-secondary)", overflow: "hidden", textOverflow: "ellipsis",
                            display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
                        }}>{post.body}</p>

                        {/* Post media */}
                        {post.imageUrl && (
                            <div style={{ marginTop: 10, borderRadius: 10, overflow: "hidden", maxHeight: 240 }}>
                                {/* eslint-disable @next/next/no-img-element */}
                                {post.imageUrl.includes("video") ? (
                                    <video src={post.imageUrl} controls style={{ width: "100%", maxHeight: 240, objectFit: "cover" }} />
                                ) : (
                                    <img src={post.imageUrl} alt="" style={{ width: "100%", maxHeight: 240, objectFit: "cover" }} />
                                )}
                                {/* eslint-enable @next/next/no-img-element */}
                            </div>
                        )}

                        <div style={{ display: "flex", gap: 12, marginTop: 8, fontSize: 12, color: "var(--text-muted)" }}>
                            <span>▲ {post.upvotes - post.downvotes}</span>
                            <span>💬 {post.commentCount}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* New Post Modal */}
            {showNewPost && (
                <div className="modal-overlay" onClick={() => setShowNewPost(false)}>
                    <div className="modal-card hc-card" onClick={e => e.stopPropagation()}>
                        <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 18, marginBottom: 16 }}>
                            Post in {community.name}
                        </h2>
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            <input className="input-field" placeholder="Post title" value={postTitle}
                                onChange={e => setPostTitle(e.target.value)} />
                            <textarea className="input-field" placeholder="What's on your mind?" value={postBody}
                                onChange={e => setPostBody(e.target.value)} rows={4} style={{ resize: "none" }} />

                            {/* Media Upload */}
                            <div>
                                <input ref={fileRef} type="file" accept="image/*,video/*" onChange={handleFileUpload}
                                    style={{ display: "none" }} />
                                <button className="hc-chip" onClick={() => fileRef.current?.click()} disabled={uploading}
                                    style={{ fontSize: 13 }}>
                                    {uploading ? "⏳ Uploading..." : "📎 Add Image/Video"}
                                </button>
                            </div>

                            {/* Preview */}
                            {postImage && (
                                <div style={{ position: "relative", borderRadius: 10, overflow: "hidden" }}>
                                    {/* eslint-disable @next/next/no-img-element */}
                                    {postImage.includes("video") ? (
                                        <video src={postImage} controls style={{ width: "100%", maxHeight: 200, objectFit: "cover" }} />
                                    ) : (
                                        <img src={postImage} alt="" style={{ width: "100%", maxHeight: 200, objectFit: "cover", borderRadius: 10 }} />
                                    )}
                                    {/* eslint-enable @next/next/no-img-element */}
                                    <button onClick={() => setPostImage(undefined)} style={{
                                        position: "absolute", top: 6, right: 6, background: "rgba(0,0,0,0.6)", color: "#fff",
                                        border: "none", borderRadius: "50%", width: 28, height: 28, cursor: "pointer", fontSize: 14,
                                    }}>✕</button>
                                </div>
                            )}

                            <button className="btn-primary" onClick={handlePost} disabled={posting}
                                style={{ width: "100%", padding: "12px 0" }}>
                                {posting ? "Posting..." : "📤 Post"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
