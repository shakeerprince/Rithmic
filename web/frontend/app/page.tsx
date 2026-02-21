"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const pages = [
  { icon: "🎯", title: "Track Your Habits", desc: "Build powerful routines with smart tracking, streaks, and daily goals that keep you motivated." },
  { icon: "🏆", title: "Join Challenges", desc: "Compete with friends and the community in fun habit challenges. Climb leaderboards together!" },
  { icon: "🚀", title: "Grow Together", desc: "Share wins, get inspired, and earn badges as you build the best version of yourself." },
];

// Deterministic particle positions to avoid hydration mismatch
const particleData = [
  { left: "12%", bottom: "4%", delay: "0s", duration: "10s", size: 5 },
  { left: "28%", bottom: "16%", delay: "1.5s", duration: "12s", size: 4 },
  { left: "45%", bottom: "8%", delay: "3s", duration: "9s", size: 6 },
  { left: "62%", bottom: "12%", delay: "4.5s", duration: "14s", size: 3 },
  { left: "78%", bottom: "6%", delay: "6s", duration: "11s", size: 5 },
  { left: "35%", bottom: "18%", delay: "7.5s", duration: "13s", size: 4 },
  { left: "55%", bottom: "2%", delay: "9s", duration: "10s", size: 6 },
  { left: "85%", bottom: "14%", delay: "10.5s", duration: "15s", size: 3 },
];

export default function Onboarding() {
  const [page, setPage] = useState(0);
  const router = useRouter();

  const goLogin = () => router.push("/login");

  return (
    <div className="onboarding">
      {/* Particles */}
      <div className="particles">
        {particleData.map((p, i) => (
          <div key={i} className="particle" style={{
            left: p.left, bottom: p.bottom,
            animationDelay: p.delay, animationDuration: p.duration,
            width: `${p.size}px`, height: `${p.size}px`,
          }} />
        ))}
      </div>

      {/* Content */}
      <div key={page} style={{ animation: "pageIn 0.5s cubic-bezier(0.16, 1, 0.3, 1)" }}>
        <div className="onboarding-icon">{pages[page].icon}</div>
        <h1>{pages[page].title}</h1>
        <p>{pages[page].desc}</p>
      </div>

      {/* Dots */}
      <div className="onboarding-dots">
        {pages.map((_, i) => (
          <div key={i} className={`onboarding-dot ${i === page ? "active" : ""}`} onClick={() => setPage(i)} />
        ))}
      </div>

      {/* Actions */}
      <div className="onboarding-actions">
        {page < 2 ? (
          <>
            <button className="hc-btn hc-btn-outline" style={{ flex: 1 }} onClick={goLogin}>Skip</button>
            <button className="hc-btn hc-btn-primary" style={{ flex: 2 }} onClick={() => setPage(page + 1)}>
              Next <span className="material-icons" style={{ fontSize: 18 }}>arrow_forward</span>
            </button>
          </>
        ) : (
          <button className="hc-btn hc-btn-primary hc-btn-full" onClick={goLogin}>
            Get Started <span className="material-icons" style={{ fontSize: 18 }}>rocket_launch</span>
          </button>
        )}
      </div>
    </div>
  );
}
