"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { chapterFinished, initialJourney, restoreJourney, type Chapter, type Journey } from "./journey";
import { JourneyNav, UniverseSky } from "./universe";

const JourneyContext = createContext<{ state: Journey; update: <K extends keyof Journey>(key: K, value: React.SetStateAction<Journey[K]>) => void } | null>(null);
function useJourneyField<K extends keyof Journey>(key: K): [Journey[K], (value: React.SetStateAction<Journey[K]>) => void] {
  const journey = useContext(JourneyContext)!;
  return [journey.state[key], (value) => journey.update(key, value)];
}

function scrollToReveal(id: string) {
  requestAnimationFrame(() => {
    const element = document.getElementById(id);
    if (!element) return;
    const box = element.getBoundingClientRect();
    if (box.top < 80 || box.bottom > innerHeight - 100) {
      element.scrollIntoView({ block: "center", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
    }
  });
}

const chapters: { id: Chapter; label: string; mark: string }[] = [
  { id: "arrival", label: "The Finding", mark: "✦" },
  { id: "twins", label: "Twin Frequency", mark: "≈" },
  { id: "signal", label: "The Quiet", mark: "⌁" },
  { id: "garden", label: "Lily Garden", mark: "✿" },
  { id: "future", label: "Someday", mark: "⌂" },
  { id: "finale", label: "For Shekinah", mark: "♡" },
];

const arrivalTraces = [
  { label: "The page", title: "An ordinary corner of the internet.", body: "The website was temporary; the conversation was not. We left the page behind without leaving each other there." },
  { label: "The words", title: "No shared room. Still, we met.", body: "No one formally introduced our souls. They simply behaved as though they had met before, and every conversation kept proving how naturally we belonged together." },
  { label: "The continuation", title: "One conversation quietly became many.", body: "What began as passing time became time we looked forward to—because somewhere between the replies, being there started to matter." },
  { label: "The recognition", title: "December 28 became ours.", body: "It did not promise our whole future. It gave us a beginning worth continuing." },
];

const twinFrequencies = [
  { id: "mind", symbol: "☁", name: "Mind", marc: "follows the strange thought", shekinah: "finds the same hidden path", note: "Our minds do not merely agree. They keep finding the same hidden page—maybe that is why being each other's twin never felt like an exaggeration." },
  { id: "laugh", symbol: "⌣", name: "Silly", marc: "laughs hysterically first", shekinah: "catches it with her cute, silly laugh", note: "I am usually the first one laughing hysterically. Then your cute, silly laugh catches mine, and somehow we end up laughing at the fact that we are still laughing." },
  { id: "home", symbol: "⌂", name: "Home", marc: "imagines our ordinary days", shekinah: "pictures those very same days too", note: "Our future home does not have an address yet. We only know that, wherever and whenever it finds us, we have both been imagining its ordinary days—with Bogart, Jelly Bean, shared chaos, and two minds that somehow keep arriving at the same future." },
  { id: "heart", symbol: "♡", name: "Heart", marc: "loves always, in all ways", shekinah: "loves in the very same language", note: "Our hearts love in the same language: always, in all ways. Loudly, quietly, patiently, and honestly—even after the seasons that taught us how to return better." },
];

const lilyNotes = [
  { mark: "01", title: "Soft is not fragile.", body: "Your softness is not a weakness. It is the way you make people feel safe without asking for credit.", stem: 190, lean: -4 },
  { mark: "02", title: "A beautiful mind.", body: "I love the mind behind your beautiful face—the questions, the strange thoughts, and the details you notice that others miss.", stem: 230, lean: 3 },
  { mark: "03", title: "Ordinary, discovered.", body: "You make ordinary hours feel discovered. Even a small conversation with you can change the weather of my whole day.", stem: 205, lean: -1 },
  { mark: "04", title: "Space can stay loved.", body: "You are allowed to need space without believing love will leave. I want your honesty, never a performance.", stem: 218, lean: 4 },
  { mark: "05", title: "We learned on purpose.", body: "I admire not only how deeply we felt, but how bravely we learned to meet each other better.", stem: 185, lean: -3 },
  { mark: "06", title: "Every version belongs.", body: "I love the Shekinah who laughs, the Shekinah who thinks too much, the one who needs quiet, and the one still learning to receive love. None of you has to be edited out. To me, you're perfectly, imperfectly perfect as you are.", stem: 224, lean: 2 },
];

const futureMoments = [
  { mark: "01", title: "Our first same-room hello", note: "No screen between the smile and the person." },
  { mark: "02", title: "Our first shared meal", note: "Something ordinary made unforgettable because it is finally ours." },
  { mark: "03", title: "The first white lilies I give you in person", note: "Your favorite flowers, finally handed to you by me instead of imagined from afar." },
];

const finaleStanzas = [
  { mark: "01", label: "ChatKool", lines: ["I found you where strangers went to pass an hour,", "on one ordinary page called ChatKool.", "No room held us, no hands met—", "yet something in me stopped wandering."] },
  { mark: "02", label: "The quiet", lines: ["There was a season you chose silence,", "thinking it might protect me from loving you;", "as if the goodness you saw in me", "made the goodness in you less true."] },
  { mark: "03", label: "Our return", lines: ["But I was never too good for you.", "I was simply close enough to recognize", "the genuine, sincere, caring heart", "that could not yet recognize itself."] },
  { mark: "04", label: "Same room", lines: ["The miles are not an answer, only geography.", "Our answer was returning more honestly.", "Until our weather is finally the same,", "I choose you—not an idea of you, but you."] },
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
  const [state, setState] = useState<Journey>(initialJourney);
  const [ready, setReady] = useState(false);
  const [saveIssue, setSaveIssue] = useState(false);
  const { started, active } = state;
  const [sound, setSound] = useState(false);
  const [soundIssue, setSoundIssue] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const previousChapter = useRef<Chapter>("arrival");
  const update = <K extends keyof Journey,>(key: K, value: React.SetStateAction<Journey[K]>) => {
    setState((previous) => ({ ...previous, [key]: typeof value === "function" ? (value as (old: Journey[K]) => Journey[K])(previous[key]) : value }));
  };

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      try {
        const saved = localStorage.getItem("shekinah-blue-between-us-v2") || localStorage.getItem("shekinah-blue-between-us");
        if (saved) {
          const restored = restoreJourney(JSON.parse(saved));
          previousChapter.current = restored.active === "constellation" ? restored.unlocked[restored.unlocked.length - 1] : restored.active;
          setState(restored);
        }
      } catch { /* A fresh journey is okay, including when storage is unavailable. */ }
      setReady(true);
    });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem("shekinah-blue-between-us-v2", JSON.stringify(state)); }
    catch { queueMicrotask(() => setSaveIssue(true)); }
  }, [state, ready]);

  useEffect(() => {
    if (active !== "constellation") previousChapter.current = active;
    window.scrollTo({ top: 0, behavior: "instant" });
    if (started && ready) requestAnimationFrame(() => document.getElementById("chapter-content")?.focus({ preventScroll: true }));
  }, [active, started, ready]);

  const unlockNext = (current: Chapter) => {
    const index = chapters.findIndex((chapter) => chapter.id === current);
    const next = chapters[index + 1]?.id;
    if (!next) return;
    setState((previous) => ({ ...previous, unlocked: [...new Set([...previous.unlocked, next])], active: next }));
  };

  const toggleSound = () => {
    if (sound) {
      audioRef.current?.pause();
      setSound(false);
      return;
    }
    setSoundIssue(false);
    void audioRef.current?.play().then(() => setSound(true)).catch(() => { setSound(false); setSoundIssue(true); });
  };

  const startJourney = () => {
    update("started", true);
  };

  return (
    <JourneyContext.Provider value={{ state, update }}>
      <audio ref={audioRef} src="/if-by-bread-piano-instrumental.mp3" loop preload="none" />
      <UniverseSky />
      {!started ? <Opening onStart={startJourney} /> : <main className="game-shell">
      <a href="#chapter-content" className="skip-link">Skip to the chapter</a>
      <header className="topbar">
        <button className="brand" onClick={() => update("active", "arrival")} aria-label="Return to the beginning">
          <span className="brand-mark">M</span>
          <span><b>The Blue Between Us</b><small>made only for Shekinah</small></span>
        </button>
        <div className="topbar-actions">
          <button className="map-toggle" onClick={() => update("active", active === "constellation" ? previousChapter.current : "constellation")} aria-pressed={active === "constellation"}>Our constellation <span>{chapters.filter((chapter) => chapterFinished(chapter.id, state)).length}/6</span></button>
          <button className="sound-button" onClick={toggleSound} aria-pressed={sound} aria-label={sound ? "Pause our song" : "Play our song"}>
            {sound ? "♫" : "♪"} <span>{sound ? "pause our song" : "play our song"}</span>
          </button>
        </div>
      </header>

      <JourneyNav chapters={chapters} state={state} onNavigate={(chapter) => update("active", chapter)} />

      <section className="chapter-stage" id="chapter-content" tabIndex={-1} key={active} aria-label={active === "constellation" ? "Our constellation" : chapters.find((chapter) => chapter.id === active)?.label}>
        {(saveIssue || soundIssue) && <p className="status-notice" role="status">{saveIssue ? "Your browser can't save progress right now. You can still enjoy every chapter in this visit." : "The song couldn't start. Tap the music button to try again."}</p>}
        {active === "constellation" && <Constellation state={state} onVisit={(id) => update("active", id)} />}
        {active === "arrival" && <Arrival onComplete={() => unlockNext("arrival")} />}
        {active === "twins" && <TwinGame onComplete={() => unlockNext("twins")} />}
        {active === "signal" && <SignalGame onComplete={() => unlockNext("signal")} />}
        {active === "garden" && <LilyGarden onComplete={() => unlockNext("garden")} />}
        {active === "future" && <FutureRoom onComplete={() => unlockNext("future")} />}
        {active === "finale" && <Finale />}
      </section>
      </main>}
    </JourneyContext.Provider>
  );
}

function Opening({ onStart }: { onStart: () => void }) {
  return (
    <main className="opening">
      <div className="opening-orbit" aria-hidden="true"><div className="orbit-center">M <span>♡</span> S</div>{chapters.map((chapter, index) => <span key={chapter.id} className={`orbit-keepsake keepsake-${index}`}>{chapter.mark}</span>)}<p>Six chapters.<br />One little universe that is ours.</p></div>
      <div className="opening-copy">
        <p className="opening-dedication">A small universe from Marc</p>
        <h1>For the girl I found <br /><em>before I could hold her hand.</em></h1>
        <p className="opening-note">Shekinah T. Rosete, this is not a story about having met already. It is about everything real that found us before the meeting.</p>
        <button className="primary-button" onClick={onStart}><span>Open our little universe</span><b>→</b></button>
        <small className="best-note">Take your time. Your place is kept on this device.</small>
      </div>
      <p className="signature">M + S <span>—</span> 28 · 12 · 25</p>
    </main>
  );
}

const keepsakes = [
  { name: "A beginning", detail: "An ordinary page. A conversation we kept.", action: "Reveal our traces" },
  { name: "A familiar frequency", detail: "Two minds, one wonderfully familiar direction.", action: "Find our matches" },
  { name: "A clearer signal", detail: "What we learned when we returned better.", action: "Restore our signal" },
  { name: "A garden of truths", detail: "Six white lilies. Six things I see in you.", action: "Bloom the lilies" },
  { name: "A possible someday", detail: "Three unwritten memories. Two little letters.", action: "Develop our someday" },
  { name: "A heart, received", detail: "Four stars, and everything I wanted to say.", action: "Read our last room" },
];

function Constellation({ state, onVisit }: { state: Journey; onVisit: (id: Chapter) => void }) {
  const [selected, setSelected] = useState(() => Math.max(0, chapters.findIndex((chapter) => chapter.id === state.unlocked[state.unlocked.length - 1])));
  const kept = chapters.filter((chapter) => chapterFinished(chapter.id, state)).length;
  const chosen = chapters[selected];
  const available = state.unlocked.includes(chosen.id);
  return <article className="chapter constellation-chapter">
    <header className="constellation-intro"><h1>Everything we keep.<br /><em>One constellation.</em></h1><p>Not a map of the miles between us. A little record of what we keep finding in each other.</p></header>
    <div className="keepsake-observatory">
      <div className="keepsake-map" aria-label="Choose a chapter keepsake">
        <svg viewBox="0 0 600 420" preserveAspectRatio="none" aria-hidden="true"><path className="map-thread" d="M90 220 L180 90 L360 60 L510 170 L420 330 L230 350 Z" />{[[90,220],[180,90],[360,60],[510,170],[420,330],[230,350]].map(([x,y],i) => <path key={i} className={chapterFinished(chapters[i].id,state) ? "map-ray lit" : "map-ray"} d={`M300 210 L${x} ${y}`} />)}</svg>
        <div className="keepsake-center"><b>M <i>♡</i> S</b><span>{kept} of 6 keepsakes</span></div>
        {chapters.map((chapter,index) => <button key={chapter.id} className={`keepsake-star star-${index} ${selected === index ? "selected" : ""} ${chapterFinished(chapter.id,state) ? "kept" : ""}`} aria-pressed={selected === index} aria-label={`${chapter.label}: ${chapterFinished(chapter.id,state) ? "keepsake collected" : state.unlocked.includes(chapter.id) ? "ready to explore" : "not yet unlocked"}`} onClick={() => setSelected(index)}><b>{chapter.mark}</b><span>{chapter.label}</span></button>)}
      </div>
      <div className="keepsake-detail" aria-live="polite"><span className="keepsake-count">Chapter {selected + 1} / 6 · {chapterFinished(chosen.id,state) ? "kept" : available ? "ready for you" : "still waiting"}</span><h2>{keepsakes[selected].name}</h2><p>{keepsakes[selected].detail}</p>{available ? <button className="primary-button" onClick={() => onVisit(chosen.id)}><span>{chapterFinished(chosen.id,state) ? "Visit this chapter again" : keepsakes[selected].action}</span><b>→</b></button> : <p className="locked-note">Keep exploring the earlier chapters. This little part of us will open along the way.</p>}<small>Every reveal is saved only on this device.</small></div>
    </div>
  </article>;
}

function Arrival({ onComplete }: { onComplete: () => void }) {
  const [trace, setTrace] = useJourneyField("trace");
  const [viewedTrace, setViewedTrace] = useState(trace);
  const complete = trace === arrivalTraces.length - 1;
  const progress = (trace / (arrivalTraces.length - 1)) * 100;
  const currentTrace = arrivalTraces[viewedTrace];
  return (
    <article className="chapter arrival-chapter">
      <div className="arrival-layout">
        <div className="arrival-copy">
          <p className="eyebrow">Chapter one · The first connection archive</p>
          <h1 className="chapter-title">Nothing looked important. <br /><em>Then you stayed.</em></h1>
          <p>I did not find you in a crowded room. There was no cinematic first glance—just an ordinary page, two separate screens, and a conversation that slowly stopped feeling accidental.</p>
          <div className="arrival-facts">
            <div><span>where</span><b>ChatKool.com</b></div>
            <div><span>when</span><b>28 · 12 · 2025</b></div>
            <div><span>since</span><b>{daysBetween()} days</b></div>
          </div>
        </div>
        <div className={complete ? "connection-archive archive-complete" : "connection-archive"} style={{ "--arrival-progress": `${progress}%` } as React.CSSProperties}>
          <div className="archive-header"><span>CHATKOOL.COM · CONNECTION ARCHIVE</span><b>{complete ? "KEPT" : `TRACE 0${trace + 1}`}</b></div>
          <div className="archive-sky" aria-hidden="true">
            <div className="archive-stars">✦　·　　✧　　·　✦　·</div>
            <span className="archive-beacon marc-beacon">M<small>one screen</small></span>
            <div className="connection-path"><i /><b>♡</b></div>
            <span className="archive-beacon shekinah-beacon">S<small>another screen</small></span>
            <div className="chatkool-node"><small>unexpected meeting place</small><b>ChatKool</b></div>
          </div>
          <div className="archive-markers" aria-label={`Trace ${trace + 1} of ${arrivalTraces.length}`}>
            {arrivalTraces.map((item, index) => <button key={item.label} disabled={index > trace} onClick={() => setViewedTrace(index)} className={index <= trace ? "found" : ""} aria-label={`Read ${item.label}`} aria-current={index === viewedTrace ? "step" : undefined}><i>{index <= trace ? "✦" : "·"}</i><span>{item.label}</span></button>)}
          </div>
          <div className="arrival-trace-card" aria-live="polite">
            <span>{String(viewedTrace + 1).padStart(2, "0")} · {currentTrace.label}</span>
            <h3>{currentTrace.title}</h3>
            <p>{currentTrace.body}</p>
          </div>
          {!complete ? <button className="archive-action" onClick={() => { setViewedTrace(trace + 1); setTrace(trace + 1); }}><span>Reveal the next trace</span><b>→</b></button> : <div className="archive-success">
            <span>✦ connection kept · 28.12.2025 ✦</span>
            <h3>Some meetings happen in coordinates.<br />Ours happened in recognition.</h3>
            <button className="primary-button small" onClick={onComplete}><span>Follow the twin frequency</span><b>→</b></button>
          </div>}
        </div>
      </div>
    </article>
  );
}

function TwinGame({ onComplete }: { onComplete: () => void }) {
  const [selectedMarc, setSelectedMarc] = useState<string | null>(null);
  const [selectedShekinah, setSelectedShekinah] = useState<string | null>(null);
  const [matched, setMatched] = useJourneyField("matched");
  const [feedback, setFeedback] = useState(() => {
    const previous = twinFrequencies.find((item) => item.id === matched[matched.length - 1]);
    return previous ? { title: `${previous.symbol} ${previous.name} frequency connected.`, body: previous.note } : { title: "Choose one signal from each side.", body: "Compatibility is not about being copies. Find the two expressions that belong to the same frequency." };
  });
  const [checking, setChecking] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  const complete = matched.length === twinFrequencies.length;
  const shekinahOrder = ["home", "mind", "heart", "laugh"];

  const checkPair = (marcId: string, shekinahId: string) => {
    setChecking(true);
    if (marcId === shekinahId) {
      const frequency = twinFrequencies.find((item) => item.id === marcId)!;
      setMatched((items) => [...new Set([...items, marcId])]);
      setFeedback({ title: `${frequency.symbol} ${frequency.name} frequency connected.`, body: frequency.note });
      timer.current = setTimeout(() => { setSelectedMarc(null); setSelectedShekinah(null); setChecking(false); }, 250);
    } else {
      setFeedback({ title: "Close—this signal belongs somewhere else.", body: "The right match will feel less like sameness and more like two expressions recognizing one another." });
      timer.current = setTimeout(() => { setSelectedMarc(null); setSelectedShekinah(null); setChecking(false); }, 450);
    }
    scrollToReveal("frequency-note");
  };

  const reread = (id: string) => {
    const frequency = twinFrequencies.find((item) => item.id === id)!;
    setFeedback({ title: `${frequency.symbol} ${frequency.name} frequency connected.`, body: frequency.note });
    scrollToReveal("frequency-note");
  };

  const chooseMarc = (id: string) => {
    if (checking) return;
    if (matched.includes(id)) { reread(id); return; }
    setSelectedMarc(id);
    if (selectedShekinah) checkPair(id, selectedShekinah);
  };

  const chooseShekinah = (id: string) => {
    if (checking) return;
    if (matched.includes(id)) { reread(id); return; }
    setSelectedShekinah(id);
    if (selectedMarc) checkPair(selectedMarc, id);
  };

  return (
    <article className={complete ? "chapter twin-chapter observatory-complete" : "chapter twin-chapter"}>
      <div className="twin-layout">
        <div className="twin-copy">
          <p className="eyebrow">Chapter two · The twin observatory</p>
          <h1 className="chapter-title">Not copies. <br /><em>Compatible constellations.</em></h1>
          <p>Choose one Marc signal and one Shekinah signal. Match what sounds different but belongs to the same part of our shared frequency.</p>
          <div className="twin-progress">{twinFrequencies.map((frequency) => <div key={frequency.id} className={matched.includes(frequency.id) ? "matched" : ""}><i>{matched.includes(frequency.id) ? frequency.symbol : "·"}</i><span>{frequency.name}</span></div>)}</div>
        </div>
        <div className="observatory-board">
          <div className="observatory-header"><span>MARC · SIGNAL BANK</span><b>≈</b><span>SHEKINAH · SIGNAL BANK</span></div>
          <div className="twin-constellation" aria-hidden="true">
            <span>M</span>
            <div>{twinFrequencies.map((frequency) => <i key={frequency.id} className={matched.includes(frequency.id) ? "live" : ""}>{matched.includes(frequency.id) ? frequency.symbol : "·"}</i>)}</div>
            <span>S</span>
          </div>
          <div className="signal-banks">
            <div className="signal-bank marc-bank">
              <small>choose from Marc</small>
              {twinFrequencies.map((frequency) => <button key={frequency.id} className={`${selectedMarc === frequency.id ? "selected" : ""} ${matched.includes(frequency.id) ? "matched" : ""}`} aria-pressed={selectedMarc === frequency.id || matched.includes(frequency.id)} onClick={() => chooseMarc(frequency.id)}><span>{matched.includes(frequency.id) ? "✓" : frequency.symbol}</span><b>{frequency.marc}</b></button>)}
            </div>
            <div className="signal-bank shekinah-bank">
              <small>choose from Shekinah</small>
              {shekinahOrder.map((id) => {
                const frequency = twinFrequencies.find((item) => item.id === id)!;
                return <button key={frequency.id} className={`${selectedShekinah === frequency.id ? "selected" : ""} ${matched.includes(frequency.id) ? "matched" : ""}`} aria-pressed={selectedShekinah === frequency.id || matched.includes(frequency.id)} onClick={() => chooseShekinah(frequency.id)}><span>{matched.includes(frequency.id) ? "✓" : frequency.symbol}</span><b>{frequency.shekinah}</b></button>;
              })}
            </div>
          </div>
          <div className="twin-discovery" id="frequency-note" aria-live="polite">
            <span>{matched.length} of {twinFrequencies.length} connected{complete ? " · tap any match to reread" : ""}</span>
            <h3>{feedback.title}</h3><p>{feedback.body}</p>
          </div>
          {complete && <div className="twin-completion">
            <span>✦ two complete people · one living constellation ✦</span>
            <h3>99% familiar. 1% still waiting for us to discover.</h3>
            <p>100% compatible: suspiciously alike, entirely ourselves, and somehow even better together.</p>
            <button className="primary-button small" onClick={onComplete}><span>Enter the quiet chapter</span><b>→</b></button>
          </div>}
        </div>
      </div>
    </article>
  );
}

function SignalGame({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useJourneyField("step");
  const [wrong, setWrong] = useState<number | null>(null);
  const [correct, setCorrect] = useJourneyField("correct");
  const message = signalChoices[Math.min(step, 2)].reply;
  const finished = step >= signalChoices.length;
  const choose = (index: number) => {
    if (correct) return;
    if (index === signalChoices[step].answer) {
      setWrong(null);
      setCorrect(true);
      scrollToReveal("answer-note");
    } else {
      setWrong(index);
    }
  };
  const continueSignal = () => {
    setStep((value) => value + 1);
    setWrong(null);
    setCorrect(false);
    requestAnimationFrame(() => document.getElementById(step === signalChoices.length - 1 ? "restored-note" : "signal-question")?.focus({ preventScroll: true }));
  };
  return (
    <article className="chapter signal-chapter">
      <div className={finished ? "signal-visual is-restored" : "signal-visual"} aria-hidden="true">
        <span className="island marc-island">M<small>here</small></span>
        <div className="signal-beam">
          <i /><i /><i />
          <b>♡</b>
          <small>{finished ? "signal found · clear and steady" : `searching · ${step} of ${signalChoices.length} notes found`}</small>
        </div>
        <span className="island shekinah-island">S<small>there</small></span>
      </div>
      <div className="signal-copy">
        <p className="eyebrow">Chapter three · The season without a signal</p>
        <h1 className="chapter-title">We did not return <br />to the same love. <br /><em>We returned better.</em></h1>
        <p className="honest-note">There was a season when you pulled away because you believed I deserved someone better—as if loving you would somehow be unfair to me. I was hurt, but I never saw you as a burden. This room does not romanticize the silence; it remembers what we learned after it: you do not have to disqualify yourself from a love that sees you clearly.</p>
        {!finished ? <div className="choice-game">
          <div className="choice-progress" aria-label={`Question ${step + 1} of ${signalChoices.length}`}>{signalChoices.map((_, i) => <i key={i} className={i < step ? "done" : i === step ? "now" : ""} />)}<span>{step + 1} / {signalChoices.length}</span></div>
          <h3 id="signal-question" tabIndex={-1}>{signalChoices[step].prompt}</h3>
          <div className="choice-options">{signalChoices[step].options.map((option, index) => {
            const isAnswer = index === signalChoices[step].answer;
            const className = wrong === index ? "wrong" : correct && isAnswer ? "correct" : "";
            return <button key={option} className={className} disabled={correct} onClick={() => choose(index)}><span>{correct && isAnswer ? "✓" : String.fromCharCode(65 + index)}</span>{option}</button>;
          })}</div>
          {!correct ? <small className="choice-hint" role="status">{wrong === null ? "Choose what our better love sounds like." : "That isn't the love we're learning. Try a gentler choice."}</small> : <div className="answer-reveal" id="answer-note" role="status">
            <span>frequency found</span>
            <p>{message}</p>
            <button onClick={continueSignal}>{step === signalChoices.length - 1 ? "Complete the signal" : "Let the next note arrive"} <b>→</b></button>
          </div>}
        </div> : <div className="signal-restored" id="restored-note" tabIndex={-1}>
          <span>✦ signal restored ✦</span>
          <h3>The signal is not merely back.<br />It is clearer than before.</h3>
          <p>Space without abandonment. Honesty without punishment. A love where fear can speak—and neither of us has to disappear.</p>
          <div className="signal-vow"><i>01</i><b>I see you.</b><i>02</i><b>I hear you.</b><i>03</i><b>I am still here.</b></div>
          <button className="primary-button small" onClick={onComplete}><span>Plant what we learned</span><b>→</b></button>
        </div>}
      </div>
    </article>
  );
}

function LilyGarden({ onComplete }: { onComplete: () => void }) {
  const [bloomed, setBloomed] = useJourneyField("bloomed");
  const [activeLily, setActiveLily] = useJourneyField("activeLily");
  const complete = bloomed.length === lilyNotes.length;
  const bloom = (index: number) => {
    setBloomed((items) => items.includes(index) ? items : [...items, index]);
    setActiveLily(index);
    scrollToReveal("lily-note");
  };
  const activeNote = activeLily === null ? null : lilyNotes[activeLily];
  return (
    <article className="chapter garden-chapter">
      <div className="garden-layout">
        <div className="garden-copy">
          <p className="eyebrow">Chapter four · A moonlit garden of being seen</p>
          <h1 className="chapter-title">Every lily keeps <br /><em>one truth about you.</em></h1>
          <p className="garden-intro">Bloom them slowly. This is not a list of compliments; it is a garden made from the parts of you I keep noticing.</p>
          <div className={activeNote ? "truth-card visible" : "truth-card"} id="lily-note" aria-live="polite">
            {activeNote ? <>
              <span>{activeNote.mark} · a truth in bloom</span>
              <h3>{activeNote.title}</h3>
              <p>{activeNote.body}</p>
            </> : <>
              <span>the garden is waiting</span>
              <h3>Choose the first closed lily.</h3>
              <p>Each flower opens into a thought I never want you to forget.</p>
            </>}
          </div>
          <div className="garden-progress" aria-label={`${bloomed.length} of ${lilyNotes.length} truths blooming`}>
            <div>{lilyNotes.map((note, index) => <i key={note.mark} className={bloomed.includes(index) ? "lit" : ""} />)}</div>
            <span>{bloomed.length} / {lilyNotes.length} truths blooming</span>
          </div>
          {complete && <div className="garden-completion">
            <span>✦ the whole garden can see you now ✦</span>
            <p>You never had to become perfect to deserve this garden. You only had to be seen—genuinely, patiently, and as yourself.</p>
            <button className="ivory-button" onClick={onComplete}>Carry these truths toward someday →</button>
          </div>}
        </div>
        <div className={complete ? "garden-scene garden-complete" : "garden-scene"}>
          <div className="garden-moon" aria-hidden="true" />
          <div className="garden-fireflies" aria-hidden="true">·　✦　　·　　✧　·　　✦</div>
          <div className="garden">
            {lilyNotes.map((note, index) => {
              const isBloomed = bloomed.includes(index);
              return <button
                key={note.mark}
                onClick={() => bloom(index)}
                className={isBloomed ? "lily bloomed" : "lily"}
                aria-pressed={isBloomed}
                aria-label={isBloomed ? `Read truth ${note.mark}: ${note.title}` : `Bloom lily ${note.mark}`}
                style={{ "--stem-height": `${note.stem}px`, "--lean": `${note.lean}deg`, "--bloom-delay": `${index * 45}ms` } as React.CSSProperties}
              >
                <span className="petals"><i /><i /><i /><i /><i /><b>✦</b></span>
                <span className="stem"><i /><i /></span>
                <small>{isBloomed ? note.mark : "·"}</small>
              </button>;
            })}
          </div>
          <div className="garden-ground" aria-hidden="true" />
        </div>
      </div>
    </article>
  );
}

function FutureRoom({ onComplete }: { onComplete: () => void }) {
  const [note, setNote] = useJourneyField("letter");
  const [opened, setOpened] = useJourneyField("opened");
  const [developed, setDeveloped] = useJourneyField("developed");
  const filmReady = developed.length === futureMoments.length;
  const open = (name: "bogart" | "jelly") => { setNote(name); setOpened((items) => items.includes(name) ? items : [...items, name]); scrollToReveal("little-letter"); };
  const developMoment = (index: number) => setDeveloped((items) => items.includes(index) ? items : [...items, index]);
  return (
    <article className="chapter future-chapter">
      <div className={filmReady ? "future-film film-ready" : "future-film"} role="img" aria-label={`${developed.length} of 3 future photographs developed`}>
        <div className="film-header"><span>M + S · UNDEVELOPED ROLL</span><b>{String(developed.length).padStart(2, "0")} / 03</b></div>
        <div className="film-strip" aria-hidden="true">
          <div className={developed.includes(0) ? "future-frame hello-frame developed" : "future-frame hello-frame"}>
            <span>01</span>
            <div className="hello-photo">
              <i className="hello-person marc-person"><span className="hello-hair" /></i>
              <b>✦</b>
              <i className="hello-person shekinah-person"><span className="hello-hair" /></i>
            </div>
            <small>{developed.includes(0) ? "our first same-room hello" : "memory waiting for light"}</small>
          </div>
          <div className={developed.includes(1) ? "future-frame meal-frame developed" : "future-frame meal-frame"}>
            <span>02</span>
            <div className="meal-photo">
              <i><span>🍤</span><small>🍓</small></i>
              <b>♡</b>
              <i><span>🍤</span><small>🥭</small></i>
            </div>
            <small>{developed.includes(1) ? "our first shared meal" : "memory waiting for light"}</small>
          </div>
          <div className={developed.includes(2) ? "future-frame lilies-frame developed" : "future-frame lilies-frame"}>
            <span>03</span>
            <div className="lilies-photo"><i /><b>✿　✿　✿</b><i /></div>
            <small>{developed.includes(2) ? "white lilies, from my hands to yours" : "memory waiting for light"}</small>
          </div>
        </div>
        <div className="film-caption"><span>{filmReady ? "our first memories are still waiting to be made" : "develop each frame gently"}</span><b>M　♡　S</b></div>
      </div>
      <div className="future-copy">
        <p className="eyebrow">Chapter five · The someday room</p>
        <h1 className="chapter-title">Develop the moments <br /><em>we refuse to rush.</em></h1>
        <p>We have not shared a table yet. We have not taken the first real-life photo. So this is not pretending we are already there. These are three undeveloped frames for moments we hope to make real, one honest day at a time.</p>
        <div className="future-lights">
          {futureMoments.map((moment, index) => <button key={moment.mark} onClick={() => developMoment(index)} className={developed.includes(index) ? "lit" : ""} aria-pressed={developed.includes(index)}>
            <span>{developed.includes(index) ? "✦" : moment.mark}</span><b>{moment.title}</b><small>{developed.includes(index) ? moment.note : "touch to develop gently"}</small>
          </button>)}
        </div>
        {!filmReady ? <p className="future-whisper">When all three frames have developed, two small letters will appear.</p> : <div className="letters-stage">
          <div className="letters-heading"><span>Two letters kept for a possible someday</span><b>{opened.length} / 2 opened</b></div>
          <div className="future-cards">
            <button className={`envelope bogart ${opened.includes("bogart") ? "opened" : ""} ${note === "bogart" ? "selected" : ""}`} onClick={() => open("bogart")} aria-expanded={note === "bogart"}><span>{opened.includes("bogart") ? "✓ opened · Bogart" : "01 · Bogart"}</span><b>Little Marc</b><small>navy envelope · our maybe-boy</small><i>⌁</i></button>
            <button className={`envelope jelly ${opened.includes("jelly") ? "opened" : ""} ${note === "jelly" ? "selected" : ""}`} onClick={() => open("jelly")} aria-expanded={note === "jelly"}><span>{opened.includes("jelly") ? "✓ opened · Jelly Bean" : "02 · Jelly Bean"}</span><b>Little Shekinah</b><small>lily-blue envelope · our maybe-girl</small><i>✿</i></button>
          </div>
          <div className={`letter-reader ${note ? `reading-${note}` : ""}`} id="little-letter" aria-live="polite">
            {!note && <div className="letter-placeholder"><span>♡</span><p>Choose either envelope. Both letters are different because both little lights are their own person.</p></div>}
            {note === "bogart" && <div className="future-letter"><button onClick={() => setNote(null)} aria-label="Close Little Marc's letter">×</button><p>Dear Little Marc—our Bogart,</p><h3>If someday you become more than the nickname we smile about now, I hope you inherit your mama&apos;s sincere heart and learn from both of us that gentleness never makes a boy less brave. Long before we could hold you, you were our way of picturing breakfast noise, scraped knees, curious questions, and a home built honestly—one conversation at a time.</h3><small>Love, Mama Shekinah and Papa Marc</small></div>}
            {note === "jelly" && <div className="future-letter"><button onClick={() => setNote(null)} aria-label="Close Little Shekinah's letter">×</button><p>Dear Little Shekinah—our Jelly Bean,</p><h3>You began as a little sweetness tucked inside a future we speak about carefully. If we meet you someday, I hope you carry your mama&apos;s tenderness and always know it is a strength. You never have to earn your place in a loving home or become smaller to be kept; you would be wanted as your own whole, bright, wonderfully strange self.</h3><small>Love, Mama Shekinah and Papa Marc</small></div>}
          </div>
          {opened.length === 2 && <div className="future-completion"><span>✦ both little lights found ✦</span><p>The future is still unwritten. That is what makes imagining it together so tender.</p><button className="primary-button small" onClick={onComplete}><span>Open the last room</span><b>→</b></button></div>}
        </div>}
      </div>
    </article>
  );
}

function Finale() {
  const [yes, setYes] = useJourneyField("yes");
  const [revealed, setRevealed] = useJourneyField("revealed");
  const [sent, setSent] = useJourneyField("sent");
  const [, setFinaleKept] = useJourneyField("finaleKept");
  const allRevealed = revealed === finaleStanzas.length;
  const resetFinale = () => { setYes(false); setSent(false); setRevealed(1); };
  const classes = ["chapter", "finale-chapter", sent ? "signal-sent" : "", yes ? "celebrated" : ""].filter(Boolean).join(" ");
  return (
    <article className={classes}>
      <div className="final-visual" aria-hidden="true">
        <div className={sent ? "final-lily bloomed" : "final-lily"}><span>✦</span></div>
        <div className={sent ? "final-signal sent" : "final-signal"}><span>M</span><i /><b>♡</b><i /><span>S</span></div>
        <small>{sent ? "signal received" : "four stars across the blue"}</small>
      </div>
      <div className="poem-card">
        <p className="eyebrow">The last room · for Shekinah</p>
        <h1 className="chapter-title">Four stars before <br /><em>the same-room hello.</em></h1>
        <div className="final-constellation" aria-label={`${revealed} of ${finaleStanzas.length} memories revealed`}>
          <div className="constellation-line"><i style={{ width: `${((revealed - 1) / (finaleStanzas.length - 1)) * 100}%` }} /></div>
          {finaleStanzas.map((stanza, index) => <div key={stanza.mark} className={index < revealed ? "revealed" : ""}><b>{index < revealed ? "✦" : "·"}</b><span>{stanza.label}</span></div>)}
        </div>
        <div className="poem interactive-poem">
          {finaleStanzas.slice(0, revealed).map((stanza) => <p key={stanza.mark}><span>{stanza.mark} · {stanza.label}</span>{stanza.lines.map((line) => <span key={line}>{line}</span>)}</p>)}
        </div>
        {!allRevealed && <button className="reveal-star" onClick={() => setRevealed((value) => value + 1)}><span>Reveal star {revealed + 1}: {finaleStanzas[revealed].label}</span><b>✦</b></button>}
        {allRevealed && !sent && <div className="send-heart">
          <span>all four stars are awake</span>
          <p>There is one last thing to send across the miles.</p>
          <button onClick={() => setSent(true)}>Send my heart from M to S <b>♡</b></button>
        </div>}
        {sent && <div className="final-received">
          <span>✦ signal received, Shekinah ✦</span>
          <h3>Until our first hello in the same room, I will keep meeting you here—honestly.</h3>
          <p className="signed">Yours, across every blue mile,<br /><b>Marc Ramon Emmanuel C. De Angel</b></p>
          {!yes ? <div className="final-question"><p>Shekinah, will you keep choosing this strange, honest, growing love with me?</p><button onClick={() => { setYes(true); setFinaleKept(true); }}>Yes, still us ♡</button></div> : <div className="yes-moment"><div className="floating-hearts" aria-hidden="true">♡　✦　♡　·　♡　✦　♡</div><span>then the miles are only part of the map.</span><h3>Still us. Still choosing.</h3><p>M + S · 99% twins · 100% compatible</p><button onClick={resetFinale}>Read our stars again ↺</button></div>}
        </div>}
      </div>
    </article>
  );
}
