"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function CreatePostPage() {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!title.trim() || !body.trim()) return;
        setLoading(true);
        try {
            await api.createPost({ title, body });
            router.back();
        } catch { setLoading(false); }
    };

    return (
        <div className="page" style={{ paddingBottom: 40 }}>
            <div className="page-header">
                <button className="back-btn" onClick={() => router.back()}>
                    <span className="material-icons">arrow_back</span>
                </button>
                <h1>New Post</h1>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div>
                    <label className="hc-label">Title</label>
                    <input className="hc-input" placeholder="Share your achievement..." value={title} onChange={e => setTitle(e.target.value)} />
                </div>
                <div>
                    <label className="hc-label">Body</label>
                    <textarea className="hc-input hc-textarea" placeholder="Tell your story..." value={body} onChange={e => setBody(e.target.value)} />
                </div>
                <button className="hc-btn hc-btn-primary hc-btn-full" onClick={handleSubmit} disabled={loading || !title.trim()}>
                    {loading ? "Posting..." : "Post"} 🚀
                </button>
            </div>
        </div>
    );
}
