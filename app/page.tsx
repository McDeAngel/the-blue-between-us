"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Chapter = "arrival" | "twins" | "signal" | "garden" | "future" | "finale";

const chapters: { id: Chapter; label: string; mark: string }[] = [
  { id: "arrival", label: "The Finding", mark: "✦" },
  { id: "twins", label: "Twin Frequency", mark: "≈" },
  { id: "signal", label: "The Quiet", mark: "⌁" },
  { id: "garden", label: "Lily Garden", mark: "✿" },
  { id: "future", label: "Someday", mark: "⌂" },
  { id: "finale", label: "For Shekinah", mark: "♡" },
];

const twinCards = [
  { pair: "mind", symbol: "☁", text: "same strange thoughts" },
  { pair: "laugh", symbol: "⌣", text: "same kind of silly" },
  { pair: "home", symbol: "⌂", text: "same idea of home" },
  { pair: "heart", symbol: "♡", text: "different hearts, one rhythm" },
];

const lilyNotes = [
  "Your softness is not a weakness.",
  "I love the mind behind your beautiful face.",
  "You make ordinary hours feel discovered.",
  "You are allowed to need space—and still be loved.",
  "I admire how we learned, not just how we felt.",
  "I choose the real you, not an imagined perfect you.",
];

const signalChoices = [
  {
    prompt: "When the room inside you becomes too loud…",
    options: ["I will demand an answer.", "I will leave the door gentle and open.", "I will pretend not to care."],
    answer: 1,
    reply: "Love can wait without disappearing.",
  },
  {
    prompt: "When distance turns a silence into a story…",
    options: ["We ask, not assume.", "We believe the worst.", "We count who texted last."],
    answer: 0,
    reply: "Clarity is kinder than guessing.",
  },
  {
    prompt: "When old patterns knock again…",
    options: ["We call it fate.", "We hide it.", "We notice, name it, and choose better."],
    answer: 2,
    reply: "We are not our old survival habits.",
  },
];

function daysBetween() {
  const found = new Date("2025-12-28T00:00:00+08:00");
  const now = new Date();
  return Math.max(0, Math.floor((now.getTime() - found.getTime()) / 86400000));
}

export default function Home() {
  const [started, setStarted] = useState(false);
  const [active, setActive] = useState<Chapter>("arrival");
  const [unlocked, setUnlocked] = useState<Chapter[]>(["arrival"]);
  const [sound, setSound] = useState(false);
  const audioRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("shekinah-blue-between-us");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as { started?: boolean; unlocked?: Chapter[] };
        if (parsed.started) setStarted(true);
        if (parsed.unlocked?.length) setUnlocked(parsed.unlocked);
      } catch { /* a fresh journey is perfectly okay */ }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("shekinah-blue-between-us", JSON.stringify({ started, unlocked }));
  }, [started, unlocked]);

  const unlockNext = (current: Chapter) => {
    const index = chapters.findIndex((chapter) => chapter.id === current);
    const next = chapters[index + 1]?.id;
    if (!next) return;
    setUnlocked((items) => items.includes(next) ? items : [...items, next]);
    window.setTimeout(() => setActive(next), 450);
  };

  const toggleSound = () => {
    if (!sound) {
      const AudioCtx = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const gain = ctx.createGain();
        const osc = ctx.createOscillator();
        gain.gain.value = 0.025;
        osc.frequency.value = 196;
        osc.type = "sine";
        osc.connect(gain).connect(ctx.destination);
        osc.start();
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.4);
        osc.stop(ctx.currentTime + 2.5);
        audioRef.current = ctx;
      }
    }
    setSound(!sound);
  };

  if (!started) {
    return <Opening onStart={() => setStarted(true)} />;
  }

  return (
    <main className="game-shell">
      <div className="sky-noise" aria-hidden="true" />
      <header className="topbar">
        <button className="brand" onClick={() => setActive("arrival")} aria-label="Return to the beginning">
          <span className="brand-mark">M</span>
          <span><b>The Blue Between Us</b><small>made only for Shekinah</small></span>
        </button>
        <button className="sound-button" onClick={toggleSound} aria-label={sound ? "Turn sound off" : "Turn sound on"}>
          {sound ? "♫" : "♪"} <span>{sound ? "a little music" : "sound"}</span>
        </button>
      </header>

      <aside className="journey-nav" aria-label="Story chapters">
        {chapters.map((chapter, index) => {
          const available = unlocked.includes(chapter.id);
          return (
            <button
              key={chapter.id}
              disabled={!available}
              className={active === chapter.id ? "active" : ""}
              onClick={() => setActive(chapter.id)}
              aria-label={`${chapter.label}${available ? "" : " — locked"}`}
            >
              <span className="nav-mark">{available ? chapter.mark : "·"}</span>
              <span className="nav-copy"><small>0{index + 1}</small>{chapter.label}</span>
            </button>
          );
        })}
      </aside>

      <section className="chapter-stage" key={active}>
        {active === "arrival" && <Arrival onComplete={() => unlockNext("arrival")} />}
        {active === "twins" && <TwinGame onComplete={() => unlockNext("twins")} />}
        {active === "signal" && <SignalGame onComplete={() => unlockNext("signal")} />}
        {active === "garden" && <LilyGarden onComplete={() => unlockNext("garden")} />}
        {active === "future" && <FutureRoom onComplete={() => unlockNext("future")} />}
        {active === "finale" && <Finale />}
      </section>
    </main>
  );
}

function Opening({ onStart }: { onStart: () => void }) {
  return (
    <main className="opening">
      <div className="moon" aria-hidden="true"><span /></div>
      <div className="opening-stars" aria-hidden="true">✦　·　✧　　·　✦　　·　✧</div>
      <div className="opening-copy">
        <p className="eyebrow">A small universe from Marc</p>
        <h1>For the girl I found<br /><em>before I could hold her hand.</em></h1>
        <p className="opening-note">Shekinah T. Rosete, this is not a story about having met already.<br />It is about everything real that found us before the meeting.</p>
        <button className="primary-button" onClick={onStart}><span>Open our little universe</span><b>→</b></button>
        <small className="best-note">Best experienced slowly, with your sound on ♫</small>
      </div>
      <p className="signature">M + S <span>—</span> 28 · 12 · 25</p>
    </main>
  );
}

function Arrival({ onComplete }: { onComplete: () => void }) {
  const [aligned, setAligned] = useState(0);
  const complete = aligned >= 99;
  return (
    <article className="chapter arrival-chapter">
      <div className="chapter-copy">
        <p className="eyebrow">Chapter one · December 28, 2025</p>
        <h2>The day the world<br />quietly <em>changed shape.</em></h2>
        <p>I did not find you in a crowded room. There was no cinematic first glance. Just two lives, miles apart, arriving at the same small corner of the universe.</p>
        <div className="date-card"><span>days since I found you</span><b>{daysBetween()}</b><small>and still discovering more</small></div>
      </div>
      <div className="alignment-game">
        <div className="orbit-field" style={{ "--alignment": `${aligned * 3.6}deg` } as React.CSSProperties}>
          <div className="orbit orbit-one"><i>M</i></div>
          <div className="orbit orbit-two"><i>S</i></div>
          <div className={complete ? "center-star lit" : "center-star"}>✦</div>
        </div>
        <label htmlFor="alignment"><span>Align our timelines</span><b>{aligned}%</b></label>
        <input id="alignment" type="range" min="0" max="100" value={aligned} onChange={(e) => setAligned(Number(e.target.value))} />
        {complete ? (
          <div className="success-card"><p>Some meetings happen in coordinates.<br /><b>Ours happened in recognition.</b></p><button onClick={onComplete}>Follow the frequency →</button></div>
        ) : <small>Move the stars until the signal becomes clear.</small>}
      </div>
    </article>
  );
}

function TwinGame({ onComplete }: { onComplete: () => void }) {
  const deck = useMemo(() => [...twinCards, ...twinCards].sort(() => 0.5 - Math.random()), []);
  const [open, setOpen] = useState<number[]>([]);
  const [matched, setMatched] = useState<string[]>([]);

  const flip = (index: number) => {
    if (open.length === 2 || open.includes(index) || matched.includes(deck[index].pair)) return;
    const next = [...open, index];
    setOpen(next);
    if (next.length === 2) {
      if (deck[next[0]].pair === deck[next[1]].pair) {
        window.setTimeout(() => { setMatched((items) => [...items, deck[index].pair]); setOpen([]); }, 500);
      } else window.setTimeout(() => setOpen([]), 750);
    }
  };

  return (
    <article className="chapter twin-chapter">
      <div className="section-heading">
        <p className="eyebrow">Chapter two · 99% similar, 100% compatible</p>
        <h2>Find the <em>matching frequencies.</em></h2>
        <p>Not copies. Not halves. Two complete people with an almost suspicious amount in common.</p>
      </div>
      <div className="memory-grid">
        {deck.map((card, index) => {
          const visible = open.includes(index) || matched.includes(card.pair);
          return <button key={`${card.pair}-${index}`} className={visible ? "memory-card revealed" : "memory-card"} onClick={() => flip(index)} aria-label={visible ? card.text : "Hidden frequency"}>
            <span className="card-back">S</span><span className="card-face"><b>{card.symbol}</b><small>{card.text}</small></span>
          </button>;
        })}
      </div>
      <div className="game-status"><span>{matched.length} / 4 frequencies found</span><div><i style={{ width: `${matched.length * 25}%` }} /></div></div>
      {matched.length === 4 && <div className="completion-note"><p><b>99%</b> familiar. <b>1%</b> mystery.<br />Enough sameness to feel known; enough difference to keep discovering.</p><button className="primary-button small" onClick={onComplete}><span>Enter the quiet chapter</span><b>→</b></button></div>}
    </article>
  );
}

function SignalGame({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);
  const [wrong, setWrong] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const finished = step >= signalChoices.length;
  const choose = (index: number) => {
    if (index === signalChoices[step].answer) {
      setMessage(signalChoices[step].reply);
      window.setTimeout(() => { setStep((value) => value + 1); setMessage(""); setWrong(null); }, 850);
    } else {
      setWrong(index);
      window.setTimeout(() => setWrong(null), 500);
    }
  };
  return (
    <article className="chapter signal-chapter">
      <div className="signal-visual" aria-hidden="true"><span className="island marc-island">M<small>here</small></span><div className="signal-line">·　·　·　♡　·　·　·</div><span className="island shekinah-island">S<small>there</small></span></div>
      <div className="signal-copy">
        <p className="eyebrow">Chapter three · The season without a signal</p>
        <h2>We did not return<br />to the same love.<br /><em>We returned better.</em></h2>
        <p className="honest-note">There was a season when care and fear spoke over each other. You pulled away. I hurt. We were learning. This room does not romanticize the silence—it honors what we chose after it.</p>
        {!finished ? <div className="choice-game">
          <div className="choice-progress">{signalChoices.map((_, i) => <i key={i} className={i < step ? "done" : i === step ? "now" : ""} />)}</div>
          <h3>{signalChoices[step].prompt}</h3>
          <div>{signalChoices[step].options.map((option, index) => <button key={option} className={wrong === index ? "wrong" : ""} onClick={() => choose(index)}><span>{String.fromCharCode(65 + index)}</span>{option}</button>)}</div>
          <small>{message || "Choose what our better love sounds like."}</small>
        </div> : <div className="signal-restored"><span>signal restored</span><h3>Space without abandonment.<br />Honesty without punishment.<br />Love without losing ourselves.</h3><button className="primary-button small" onClick={onComplete}><span>Plant what we learned</span><b>→</b></button></div>}
      </div>
    </article>
  );
}

function LilyGarden({ onComplete }: { onComplete: () => void }) {
  const [bloomed, setBloomed] = useState<number[]>([]);
  const bloom = (index: number) => setBloomed((items) => items.includes(index) ? items : [...items, index]);
  return (
    <article className="chapter garden-chapter">
      <div className="section-heading light">
        <p className="eyebrow">Chapter four · A garden made of noticing</p>
        <h2>Six white lilies.<br /><em>Six things I need you to know.</em></h2>
        <p>Tap each closed lily. Affection lives in the details we keep seeing.</p>
      </div>
      <div className="garden">
        {lilyNotes.map((note, index) => <button key={note} onClick={() => bloom(index)} className={bloomed.includes(index) ? "lily bloomed" : "lily"} aria-label={bloomed.includes(index) ? note : `Bloom lily ${index + 1}`}>
          <span className="petals"><i /><i /><i /><i /><i /><b>✦</b></span><span className="stem" /><small>{bloomed.includes(index) ? note : "touch to bloom"}</small>
        </button>)}
      </div>
      <div className="garden-footer"><span>{bloomed.length} of 6 truths blooming</span>{bloomed.length === 6 && <button className="ivory-button" onClick={onComplete}>Walk toward someday →</button>}</div>
    </article>
  );
}

function FutureRoom({ onComplete }: { onComplete: () => void }) {
  const [note, setNote] = useState<"bogart" | "jelly" | null>(null);
  const [opened, setOpened] = useState<string[]>([]);
  const open = (name: "bogart" | "jelly") => { setNote(name); setOpened((items) => items.includes(name) ? items : [...items, name]); };
  return (
    <article className="chapter future-chapter">
      <div className="future-window"><div className="window-sky">✦　　·　✧</div><div className="window-city">⌂　⌂　　⌂</div></div>
      <div className="future-copy">
        <p className="eyebrow">Chapter five · Not a promise to rush</p>
        <h2>A future can be held<br /><em>gently, not tightly.</em></h2>
        <p>We have not shared a table yet. We have not taken the first real-life photo. So this is not pretending we are already there. It is a window left open for the life we hope to earn, one honest day at a time.</p>
        <div className="future-cards">
          <button onClick={() => open("bogart")}><span>01</span><b>Bogart</b><small>a note for our maybe-boy</small></button>
          <button onClick={() => open("jelly")}><span>02</span><b>Jelly Bean</b><small>a note for our maybe-girl</small></button>
        </div>
        {note && <div className="future-letter"><button onClick={() => setNote(null)} aria-label="Close letter">×</button><p>Dear {note === "bogart" ? "Bogart" : "Jelly Bean"},</p><h3>If someday you become more than a nickname, know that you began as a tiny light in two people&apos;s long-distance conversations—a way of saying, “I can imagine a home with you.”</h3><small>Love, the two hopeful weirdos who named you early</small></div>}
        {opened.length === 2 && !note && <button className="primary-button small" onClick={onComplete}><span>Open the last letter</span><b>→</b></button>}
      </div>
    </article>
  );
}

function Finale() {
  const [yes, setYes] = useState(false);
  return (
    <article className={yes ? "chapter finale-chapter celebrated" : "chapter finale-chapter"}>
      <div className="final-lily" aria-hidden="true"><span>✦</span></div>
      <div className="poem-card">
        <p className="eyebrow">The last room · for Shekinah</p>
        <h2>Before the first hello<br /><em>in the same room</em></h2>
        <div className="poem">
          <p>I know the blue light of your face on a screen,<br />the hour your voice turns soft,<br />the way two people can become familiar<br />without once sharing the same weather.</p>
          <p>We have mistaken silence for safety,<br />and distance for an answer.<br />Still, somehow, we learned to return<br />with gentler hands around each other&apos;s fears.</p>
          <p>I will not call you my missing half.<br />You arrived whole.<br />I only know that life beside your life<br />makes more room for wonder.</p>
          <p>So let the first touch come when it comes.<br />Let the airports, calendars, and miles be real.<br />Until then, I will love you here—<br />not as a placeholder, but as a place.</p>
        </div>
        <p className="signed">Yours, across every blue mile,<br /><b>Marc Ramon Emmanuel C. De Angel</b></p>
        {!yes ? <div className="final-question"><p>Shekinah, will you keep choosing this strange, honest, growing love with me?</p><button onClick={() => setYes(true)}>Yes, still us ♡</button></div> : <div className="yes-moment"><div className="floating-hearts" aria-hidden="true">♡　✦　♡　·　♡　✦　♡</div><span>then the distance is only a chapter.</span><h3>Not the ending.</h3><p>M + S · still becoming · still choosing</p></div>}
      </div>
    </article>
  );
}
