"use client";

import { useEffect, useRef, useState } from "react";

type Chapter = "arrival" | "twins" | "signal" | "garden" | "future" | "finale";

const chapters: { id: Chapter; label: string; mark: string }[] = [
  { id: "arrival", label: "The Finding", mark: "✦" },
  { id: "twins", label: "Twin Frequency", mark: "≈" },
  { id: "signal", label: "The Quiet", mark: "⌁" },
  { id: "garden", label: "Lily Garden", mark: "✿" },
  { id: "future", label: "Someday", mark: "⌂" },
  { id: "finale", label: "For Shekinah", mark: "♡" },
];

const arrivalTraces = [
  { label: "The page", title: "An ordinary corner of the internet.", body: "ChatKool was only a webpage. Neither of us knew it was about to hold a beginning." },
  { label: "The words", title: "No shared room. Still, we met.", body: "There was no first glance or held hand—only attention finding its way through a screen." },
  { label: "The staying", title: "The conversation became less ordinary.", body: "Nothing needed a grand entrance. We simply kept discovering reasons not to leave the conversation." },
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
  { mark: "06", title: "The real you.", body: "I choose the real you—not an imagined perfect version, not someone easier. Simply Shekinah.", stem: 224, lean: 2 },
];

const futureMoments = [
  { mark: "01", title: "Our first same-room hello", note: "No screen between the smile and the person." },
  { mark: "02", title: "Our first shared meal", note: "Something ordinary made unforgettable because it is finally ours." },
  { mark: "03", title: "A white lily in our vase", note: "Not proof that we rushed—proof that someday arrived gently." },
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
  const [started, setStarted] = useState(false);
  const [active, setActive] = useState<Chapter>("arrival");
  const [unlocked, setUnlocked] = useState<Chapter[]>(["arrival"]);
  const [sound, setSound] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
  }, [active]);

  const unlockNext = (current: Chapter) => {
    const index = chapters.findIndex((chapter) => chapter.id === current);
    const next = chapters[index + 1]?.id;
    if (!next) return;
    setUnlocked((items) => items.includes(next) ? items : [...items, next]);
    window.setTimeout(() => setActive(next), 450);
  };

  const toggleSound = () => {
    if (sound) {
      audioRef.current?.pause();
      setSound(false);
      return;
    }
    void audioRef.current?.play().then(() => setSound(true)).catch(() => setSound(false));
  };

  const startJourney = () => {
    setStarted(true);
    void audioRef.current?.play().then(() => setSound(true)).catch(() => setSound(false));
  };

  return (
    <>
      <audio ref={audioRef} src="/if-by-bread-piano-instrumental.mp3" loop preload="auto" />
      {!started ? <Opening onStart={startJourney} /> : <main className="game-shell">
      <div className="sky-noise" aria-hidden="true" />
      <header className="topbar">
        <button className="brand" onClick={() => setActive("arrival")} aria-label="Return to the beginning">
          <span className="brand-mark">M</span>
          <span><b>The Blue Between Us</b><small>made only for Shekinah</small></span>
        </button>
        <button className="sound-button" onClick={toggleSound} aria-label={sound ? "Turn sound off" : "Turn sound on"}>
          {sound ? "♫" : "♪"} <span>{sound ? "If — piano playing" : "play our song"}</span>
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
      </main>}
    </>
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
  const [trace, setTrace] = useState(0);
  const complete = trace === arrivalTraces.length - 1;
  const progress = (trace / (arrivalTraces.length - 1)) * 100;
  const currentTrace = arrivalTraces[trace];
  return (
    <article className="chapter arrival-chapter">
      <div className="arrival-layout">
        <div className="arrival-copy">
          <p className="eyebrow">Chapter one · The first connection archive</p>
          <h2>Nothing looked important.<br /><em>Then you stayed.</em></h2>
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
            {arrivalTraces.map((item, index) => <div key={item.label} className={index <= trace ? "found" : ""}><i>{index <= trace ? "✦" : "·"}</i><span>{item.label}</span></div>)}
          </div>
          <div className="arrival-trace-card" aria-live="polite">
            <span>{String(trace + 1).padStart(2, "0")} · {currentTrace.label}</span>
            <h3>{currentTrace.title}</h3>
            <p>{currentTrace.body}</p>
          </div>
          {!complete ? <button className="archive-action" onClick={() => setTrace((value) => value + 1)}><span>Reveal the next trace</span><b>→</b></button> : <div className="archive-success">
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
  const [matched, setMatched] = useState<string[]>([]);
  const [feedback, setFeedback] = useState({ title: "Choose one signal from each side.", body: "Compatibility is not about being copies. Find the two expressions that belong to the same frequency." });
  const [checking, setChecking] = useState(false);
  const complete = matched.length === twinFrequencies.length;
  const shekinahOrder = ["home", "mind", "heart", "laugh"];

  const checkPair = (marcId: string, shekinahId: string) => {
    setChecking(true);
    if (marcId === shekinahId) {
      const frequency = twinFrequencies.find((item) => item.id === marcId)!;
      setMatched((items) => [...items, marcId]);
      setFeedback({ title: `${frequency.symbol} ${frequency.name} frequency connected.`, body: frequency.note });
      window.setTimeout(() => { setSelectedMarc(null); setSelectedShekinah(null); setChecking(false); }, 450);
    } else {
      setFeedback({ title: "Close—this signal belongs somewhere else.", body: "The right match will feel less like sameness and more like two expressions recognizing one another." });
      window.setTimeout(() => { setSelectedMarc(null); setSelectedShekinah(null); setChecking(false); }, 650);
    }
  };

  const chooseMarc = (id: string) => {
    if (checking || matched.includes(id)) return;
    setSelectedMarc(id);
    if (selectedShekinah) checkPair(id, selectedShekinah);
  };

  const chooseShekinah = (id: string) => {
    if (checking || matched.includes(id)) return;
    setSelectedShekinah(id);
    if (selectedMarc) checkPair(selectedMarc, id);
  };

  return (
    <article className={complete ? "chapter twin-chapter observatory-complete" : "chapter twin-chapter"}>
      <div className="twin-layout">
        <div className="twin-copy">
          <p className="eyebrow">Chapter two · The twin observatory</p>
          <h2>Not copies.<br /><em>Compatible constellations.</em></h2>
          <p>Choose one Marc signal and one Shekinah signal. Match what sounds different but belongs to the same part of our shared frequency.</p>
          <div className="twin-discovery" aria-live="polite">
            <span>{complete ? "4 of 4 connected · final frequency" : `${matched.length} of ${twinFrequencies.length} connected`}</span>
            <h3>{feedback.title}</h3>
            <p>{feedback.body}</p>
          </div>
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
              {twinFrequencies.map((frequency) => <button key={frequency.id} className={`${selectedMarc === frequency.id ? "selected" : ""} ${matched.includes(frequency.id) ? "matched" : ""}`} disabled={matched.includes(frequency.id)} aria-pressed={selectedMarc === frequency.id || matched.includes(frequency.id)} onClick={() => chooseMarc(frequency.id)}><span>{frequency.symbol}</span><b>{frequency.marc}</b></button>)}
            </div>
            <div className="signal-bank shekinah-bank">
              <small>choose from Shekinah</small>
              {shekinahOrder.map((id) => {
                const frequency = twinFrequencies.find((item) => item.id === id)!;
                return <button key={frequency.id} className={`${selectedShekinah === frequency.id ? "selected" : ""} ${matched.includes(frequency.id) ? "matched" : ""}`} disabled={matched.includes(frequency.id)} aria-pressed={selectedShekinah === frequency.id || matched.includes(frequency.id)} onClick={() => chooseShekinah(frequency.id)}><span>{frequency.symbol}</span><b>{frequency.shekinah}</b></button>;
              })}
            </div>
          </div>
          {complete && <div className="twin-completion">
            <span>✦ two complete people · one living constellation ✦</span>
            <h3>99% familiar. 1% still waiting for us to discover.</h3>
            <p>100% compatible—not because we are copies, but because our differences know how to make room.</p>
            <button className="primary-button small" onClick={onComplete}><span>Enter the quiet chapter</span><b>→</b></button>
          </div>}
        </div>
      </div>
    </article>
  );
}

function SignalGame({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);
  const [wrong, setWrong] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [correct, setCorrect] = useState(false);
  const finished = step >= signalChoices.length;
  const choose = (index: number) => {
    if (correct) return;
    if (index === signalChoices[step].answer) {
      setMessage(signalChoices[step].reply);
      setCorrect(true);
    } else {
      setWrong(index);
      window.setTimeout(() => setWrong(null), 650);
    }
  };
  const continueSignal = () => {
    setStep((value) => value + 1);
    setMessage("");
    setWrong(null);
    setCorrect(false);
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
        <h2>We did not return<br />to the same love.<br /><em>We returned better.</em></h2>
        <p className="honest-note">There was a season when you pulled away because you believed I deserved someone better—as if loving you would somehow be unfair to me. I was hurt, but I never saw you as a burden. This room does not romanticize the silence; it remembers what we learned after it: you do not have to disqualify yourself from a love that sees you clearly.</p>
        {!finished ? <div className="choice-game">
          <div className="choice-progress" aria-label={`Question ${step + 1} of ${signalChoices.length}`}>{signalChoices.map((_, i) => <i key={i} className={i < step ? "done" : i === step ? "now" : ""} />)}<span>{step + 1} / {signalChoices.length}</span></div>
          <h3>{signalChoices[step].prompt}</h3>
          <div className="choice-options">{signalChoices[step].options.map((option, index) => {
            const isAnswer = index === signalChoices[step].answer;
            const className = wrong === index ? "wrong" : correct && isAnswer ? "correct" : "";
            return <button key={option} className={className} disabled={correct} onClick={() => choose(index)}><span>{correct && isAnswer ? "✓" : String.fromCharCode(65 + index)}</span>{option}</button>;
          })}</div>
          {!correct ? <small className="choice-hint">Choose what our better love sounds like.</small> : <div className="answer-reveal" role="status">
            <span>frequency found</span>
            <p>{message}</p>
            <button onClick={continueSignal}>{step === signalChoices.length - 1 ? "Complete the signal" : "Let the next note arrive"} <b>→</b></button>
          </div>}
        </div> : <div className="signal-restored">
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
  const [bloomed, setBloomed] = useState<number[]>([]);
  const [activeLily, setActiveLily] = useState<number | null>(null);
  const complete = bloomed.length === lilyNotes.length;
  const bloom = (index: number) => {
    setBloomed((items) => items.includes(index) ? items : [...items, index]);
    setActiveLily(index);
  };
  const activeNote = activeLily === null ? null : lilyNotes[activeLily];
  return (
    <article className="chapter garden-chapter">
      <div className="garden-layout">
        <div className="garden-copy">
          <p className="eyebrow">Chapter four · A moonlit garden of being seen</p>
          <h2>Every lily keeps<br /><em>one truth about you.</em></h2>
          <p className="garden-intro">Bloom them slowly. This is not a list of compliments; it is a garden made from the parts of you I keep noticing.</p>
          <div className={activeNote ? "truth-card visible" : "truth-card"} aria-live="polite">
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
  const [note, setNote] = useState<"bogart" | "jelly" | null>(null);
  const [opened, setOpened] = useState<string[]>([]);
  const [lit, setLit] = useState<number[]>([]);
  const roomReady = lit.length === futureMoments.length;
  const open = (name: "bogart" | "jelly") => { setNote(name); setOpened((items) => items.includes(name) ? items : [...items, name]); };
  const lightMoment = (index: number) => setLit((items) => items.includes(index) ? items : [...items, index]);
  return (
    <article className="chapter future-chapter">
      <div className={roomReady ? "future-window room-ready" : "future-window"}>
        <div className="window-sky" aria-hidden="true"><span>✦</span><span>·</span><span>✧</span><i /></div>
        <div className="window-moon" aria-hidden="true" />
        <div className="window-city" aria-hidden="true">
          <i className={lit.includes(0) ? "lit" : ""} /><i className={lit.includes(1) ? "lit" : ""} /><i className={lit.includes(2) ? "lit" : ""} />
        </div>
        <div className="window-caption"><span>{roomReady ? "three little lights are waiting" : `${lit.length} of 3 future lights awake`}</span><b>M　♡　S</b></div>
      </div>
      <div className="future-copy">
        <p className="eyebrow">Chapter five · The someday room</p>
        <h2>Light the moments<br /><em>we refuse to rush.</em></h2>
        <p>We have not shared a table yet. We have not taken the first real-life photo. So this is not pretending we are already there. It is a window left open for the life we hope to earn, one honest day at a time.</p>
        <div className="future-lights">
          {futureMoments.map((moment, index) => <button key={moment.mark} onClick={() => lightMoment(index)} className={lit.includes(index) ? "lit" : ""} aria-pressed={lit.includes(index)}>
            <span>{lit.includes(index) ? "✦" : moment.mark}</span><b>{moment.title}</b><small>{lit.includes(index) ? moment.note : "touch to imagine gently"}</small>
          </button>)}
        </div>
        {!roomReady ? <p className="future-whisper">When all three lights are awake, two small letters will appear.</p> : <div className="letters-stage">
          <div className="letters-heading"><span>Two letters kept for a possible someday</span><b>{opened.length} / 2 opened</b></div>
          <div className="future-cards">
            <button className={`envelope bogart ${opened.includes("bogart") ? "opened" : ""} ${note === "bogart" ? "selected" : ""}`} onClick={() => open("bogart")} aria-expanded={note === "bogart"}><span>{opened.includes("bogart") ? "✓ opened · Bogart" : "01 · Bogart"}</span><b>Little Marc</b><small>navy envelope · our maybe-boy</small><i>⌁</i></button>
            <button className={`envelope jelly ${opened.includes("jelly") ? "opened" : ""} ${note === "jelly" ? "selected" : ""}`} onClick={() => open("jelly")} aria-expanded={note === "jelly"}><span>{opened.includes("jelly") ? "✓ opened · Jelly Bean" : "02 · Jelly Bean"}</span><b>Little Shekinah</b><small>lily-blue envelope · our maybe-girl</small><i>✿</i></button>
          </div>
          <div className={`letter-reader ${note ? `reading-${note}` : ""}`} aria-live="polite">
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
  const [yes, setYes] = useState(false);
  const [revealed, setRevealed] = useState(1);
  const [sent, setSent] = useState(false);
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
        <h2>Four stars before<br /><em>the same-room hello.</em></h2>
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
          {!yes ? <div className="final-question"><p>Shekinah, will you keep choosing this strange, honest, growing love with me?</p><button onClick={() => setYes(true)}>Yes, still us ♡</button></div> : <div className="yes-moment"><div className="floating-hearts" aria-hidden="true">♡　✦　♡　·　♡　✦　♡</div><span>then the miles are only part of the map.</span><h3>Still us. Still choosing.</h3><p>M + S · 99% twins · 100% compatible</p><button onClick={resetFinale}>Read our stars again ↺</button></div>}
        </div>}
      </div>
    </article>
  );
}
