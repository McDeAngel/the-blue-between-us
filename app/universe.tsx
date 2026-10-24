"use client";

import { useLayoutEffect, useRef } from "react";
import { chapterFinished, type Chapter, type Journey } from "./journey";

// Fixed positions keep the server and client sky identical, without a canvas loop.
const stars = Array.from({ length: 320 }, (_, index) => {
  const hash = (value: number) => {
    const raw = Math.sin(value * 127.1 + 311.7) * 43758.5453;
    return raw - Math.floor(raw);
  };
  const rounded = (value: number) => Number(value.toFixed(3));
  return { x: rounded(hash(index + 1) * 1600), y: rounded(hash(index + 421) * 1000),
    radius: index % 19 === 0 ? 1.65 : rounded(.45 + hash(index + 901) * .7) };
});

export function UniverseSky() {
  return <div className="universe-sky" aria-hidden="true">
    <div className="blue-nebula" />
    <svg className="universe-stars" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
      {[0, 1, 2].map((layer) => <g key={layer} className={`star-layer star-layer-${layer}`}>
        {stars.filter((_, index) => index % 3 === layer).map((star, index) => <circle key={index} cx={star.x} cy={star.y} r={star.radius} opacity={.32 + (index % 5) * .13} />)}
      </g>)}
      <g className="sky-bright-stars">{stars.filter((_, index) => index % 47 === 0).map((star, index) => <g key={index} transform={`translate(${star.x} ${star.y})`}>
        <circle r="8" fill="#71baff" opacity=".07" /><circle r="3.5" fill="#a9d9ff" opacity=".17" />
        <path d="M-5 0 H5 M0-5 V5" stroke="#d6eeff" strokeWidth=".8" /><circle r="1.3" fill="#f0f9ff" />
      </g>)}</g>
    </svg>
  </div>;
}

export function JourneyNav({ chapters, state, onNavigate }: {
  chapters: { id: Chapter; label: string; mark: string }[];
  state: Journey;
  onNavigate: (chapter: Chapter) => void;
}) {
  const navRef = useRef<HTMLElement>(null);
  const lightRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const nav = navRef.current;
    const light = lightRef.current;
    if (!nav || !light) return;
    const align = () => {
      const selected = nav.querySelector<HTMLButtonElement>('button[aria-current="step"]');
      if (!selected) { light.style.opacity = "0"; return; }
      light.style.width = `${selected.offsetWidth}px`;
      light.style.height = `${selected.offsetHeight}px`;
      light.style.transform = `translate3d(${selected.offsetLeft}px, ${selected.offsetTop}px, 0)`;
      light.style.opacity = "1";
    };
    align();
    const observer = new ResizeObserver(align);
    observer.observe(nav);
    nav.querySelectorAll("button").forEach((button) => observer.observe(button));
    return () => observer.disconnect();
  }, [state.active]);

  return <aside ref={navRef} className="journey-nav" aria-label="Story chapters"
    onPointerDown={() => { if (navRef.current) navRef.current.dataset.instant = "false"; }}
    onKeyDown={(event) => { if ((event.key === "Enter" || event.key === " ") && navRef.current) navRef.current.dataset.instant = "true"; }}>
    <div ref={lightRef} className="nav-current-light" aria-hidden="true" />
    {chapters.map((chapter, index) => {
      const available = state.unlocked.includes(chapter.id);
      const kept = chapterFinished(chapter.id, state);
      return <button key={chapter.id} disabled={!available}
        className={`${state.active === chapter.id ? "active" : ""} ${kept ? "visited" : ""}`}
        onClick={() => onNavigate(chapter.id)} aria-current={state.active === chapter.id ? "step" : undefined}
        aria-label={`${chapter.label}${available ? "" : " — locked"}`}>
        <span className="nav-mark">{available ? chapter.mark : "·"}</span>
        <span className="nav-copy"><small>0{index + 1}{kept ? " · kept" : !available ? " · locked" : ""}</small>{chapter.label}</span>
        <span className="nav-mobile-label">{["Finding", "Twins", "Quiet", "Lilies", "Someday", "For you"][index]}</span>
      </button>;
    })}
  </aside>;
}
