"use client";

import { useMemo, useState } from "react";

const CODE_URL = "https://github.com/sys-han/token-vision";
const GALLERY_URL = "/artifacts/gallery.html";

type Stage = 0 | 1 | 2 | 3;
type Role = "plain" | "laughter" | "emphasis" | "shorthand";

type TokenGroup = {
  text: string;
  label: string;
  script: "latin" | "hangul" | "jamo" | "other";
  units: string[];
  role: Role;
  wordBreakBefore?: boolean;
};

type Preset = {
  id: string;
  label: string;
  note: string;
  text: string;
};

const presets: Preset[] = [
  {
    id: "ko-laughter",
    label: "KR · Laughter",
    note: "Korean chat laughter · Hangul jamo + typed laughter",
    text: "아니ㅋㅋㅋㅋ 이거 진짜 너무 웃긴데",
  },
  {
    id: "ko-emphasis",
    label: "KR · Emphasis",
    note: "Inserted/repeated jamo inside Korean text",
    text: "와 진ㄴㄴㄴ짜 오래 걸렸다",
  },
  {
    id: "en-reaction",
    label: "EN · Reaction",
    note: "English elongation + lol",
    text: "wait nooo that was actually so funny lol",
  },
  {
    id: "en-shorthand",
    label: "EN · Shorthand",
    note: "gonna / idk as typed conversational cues",
    text: "i was gonna reply but idk what to say",
  },
  {
    id: "spatial",
    label: "EN · Grouping",
    note: "Latin letters grouped into 3×3 syllable-like blocks",
    text: "computer architecture",
  },
];

const similarityRows = [
  { pair: "Spanish ↔ Italian", score: 0.877, group: "Romance" },
  { pair: "English ↔ Dutch", score: 0.777, group: "Germanic" },
  { pair: "English ↔ German", score: 0.777, group: "Germanic" },
  { pair: "German ↔ Dutch", score: 0.765, group: "Germanic" },
  { pair: "Spanish ↔ French", score: 0.748, group: "Romance" },
];

const HANGUL_BASE = 0xac00;
const HANGUL_END = 0xd7a3;
const CHOSEONG = [
  "ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ",
];
const JUNGSEONG = [
  "ㅏ", "ㅐ", "ㅑ", "ㅒ", "ㅓ", "ㅔ", "ㅕ", "ㅖ", "ㅗ", "ㅘ", "ㅙ", "ㅚ", "ㅛ", "ㅜ", "ㅝ", "ㅞ", "ㅟ", "ㅠ", "ㅡ", "ㅢ", "ㅣ",
];
const JONGSEONG = [
  "", "ㄱ", "ㄲ", "ㄳ", "ㄴ", "ㄵ", "ㄶ", "ㄷ", "ㄹ", "ㄺ", "ㄻ", "ㄼ", "ㄽ", "ㄾ", "ㄿ", "ㅀ", "ㅁ", "ㅂ", "ㅄ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ",
];

const LATIN_UNITS = "abcdefghijklmnopqrstuvwxyz".split("");
const HANGUL_JAMO_UNITS = "ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ".split("");

export default function TokenVisionPage() {
  const [presetIndex, setPresetIndex] = useState(0);
  const [input, setInput] = useState(presets[0].text);
  const [stage, setStage] = useState<Stage>(0);

  const analysis = useMemo(() => analyzeText(input), [input]);
  const preset = presets[presetIndex];

  const usePreset = (index: number) => {
    setPresetIndex(index);
    setInput(presets[index].text);
    setStage(0);
  };

  return (
    <main className="refineryPage">
      <header className="nav shell">
        <a className="mark" href="/" aria-label="Home">Robyn Han.</a>
        <nav>
          <a href="/">← Home</a>
          <a href={GALLERY_URL}>Static gallery ↗</a>
          <a href={CODE_URL}>Code ↗</a>
        </nav>
      </header>

      <section className="refineryHero shell">
        <div>
          <p className="kicker">TOKEN VISION · INTERACTIVE DEMO</p>
          <h1>What if tokenizers looked past letters?</h1>
          <p className="refineryLead">
            Type or choose a sentence, flatten it into visible units, then group it into
            color-coded 3×3 syllable blocks. The demo sketches how rhythm, repetition,
            chat cues, and token burden change when surface text is treated as structure.
          </p>
          <div style={heroLinkRowStyle}>
            <a href={GALLERY_URL} style={heroLinkStyle}>View static gallery ↗</a>
          </div>
        </div>

        <div className="refineryHeroMeta tokenVisionHeroMeta">
          <span>Color-coded writing units</span>
          <span>3×3 syllable canvas</span>
          <span>Script-aware decomposition</span>
          <span>Token tax flattening sketch</span>
        </div>
      </section>

      <section className="refineryDemo shell">
        <div className="refineryDemoHead" style={demoHeadWithPresetsStyle}>
          <div>
            <p className="kicker">TRY THE APPARATUS</p>
            <p className="refineryStepCopy">
              {preset.label} · {preset.note}
            </p>
          </div>

          <div style={presetRowTopStyle} aria-label="Preset inputs">
            {presets.map((item, index) => (
              <button
                key={item.id}
                className="refineryTextButton"
                onClick={() => usePreset(index)}
                style={{
                  ...presetButtonStyle,
                  borderColor: index === presetIndex ? "var(--ink)" : "var(--line)",
                  color: index === presetIndex ? "var(--ink)" : "var(--muted)",
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="refineryFlow">
          <article className="refineryPanel">
            <div className="refineryPanelTop">
              <span>01</span>
              <span>RAW TEXT</span>
            </div>

            <textarea
              aria-label="Token Vision input"
              value={input}
              onChange={(event) => {
                setInput(event.target.value);
                setStage(0);
              }}
              style={inputStyle}
            />

            <div className="refineryActionRow">
              <button className="refineryButton" onClick={() => setStage(1)}>
                Flatten it
              </button>
            </div>
          </article>

          <div className={`refineryConnector ${stage >= 1 ? "isActive" : ""}`}>↓</div>

          <article className={`refineryPanel ${stage < 1 ? "isMuted" : ""}`}>
            <div className="refineryPanelTop">
              <span>02</span>
              <span>SURFACE VIEW</span>
            </div>
            {stage >= 1 ? (
              <div style={tokenWrapStyle}>{renderSurfaceTokens(analysis.surfaceUnits)}</div>
            ) : (
              <p>A flat tokenizer-style view appears here.</p>
            )}
            <div className="refineryActionRow">
              <button
                className="refineryButton"
                disabled={stage < 1}
                onClick={() => setStage(2)}
              >
                Group into 3×3 blocks
              </button>
            </div>
          </article>

          <div className={`refineryConnector ${stage >= 2 ? "isActive" : ""}`}>↓</div>

          <div className={`refineryVariants ${stage < 2 ? "isMuted" : ""}`}>
            <article className="refineryPanel refineryVariant">
              <div className="refineryPanelTop">
                <span>03A</span>
                <span>SPATIAL BLOCKS</span>
              </div>
              {stage >= 2 ? (
                <div style={blockWrapStyle}>{analysis.groups.map(renderBlock)}</div>
              ) : (
                <p>Letters or jamo will be placed inside fixed 3×3 syllable blocks.</p>
              )}
              <span className="refineryMethodNote">
                Same-word syllable blocks stay close; word breaks create wider gaps.
              </span>
            </article>

            <article className="refineryPanel refineryVariant">
              <div className="refineryPanelTop">
                <span>03B</span>
                <span>COLOR + CHAT CUES</span>
              </div>
              {stage >= 2 ? (
                <div style={legendPanelStyle}>
                  <p style={smallCopyStyle}>
                    Fill colors replace letterforms. Bars underneath mark typed speech-like cues:
                    laughter, stretched emphasis, or chat shorthand.
                  </p>
                  <div style={miniLegendStyle}>
                    <LegendItem color="#4dd8c4" label="unit color" />
                    <LegendItem color="#33bf75" label="laughter bar" bar />
                    <LegendItem color="#ff7a3d" label="emphasis bar" bar />
                    <LegendItem color="#27b7b5" label="shorthand bar" bar />
                  </div>
                  <div style={tokenCueListStyle}>
                    {analysis.groups.filter((group) => group.role !== "plain").length > 0
                      ? analysis.groups.filter((group) => group.role !== "plain").map((group, index) => (
                        <span key={`${group.text}-${index}`} style={cuePillStyle}>
                          {group.text} · {roleLabel(group.role)}
                        </span>
                      ))
                      : <span style={cuePillStyle}>No chat cue detected</span>}
                  </div>
                </div>
              ) : (
                <p>Color and cue annotations appear after grouping.</p>
              )}
              <span className="refineryMethodNote">
                Chat cues account for written language that behaves like speech.
              </span>
            </article>
          </div>

          <div className={`refineryConnector ${stage >= 2 ? "isActive" : ""}`}>↓</div>

          <div className="refineryRunRow">
            <button
              className="refineryButton refineryButtonStrong"
              disabled={stage < 2}
              onClick={() => setStage(3)}
            >
              Compare burden
            </button>
          </div>

          <div className={`refineryResults ${stage < 3 ? "isMuted" : ""}`}>
            <div className="refineryResultsHead">
              <div>
                <p className="kicker">OUTPUT SUMMARY</p>
                <h2>What changed after grouping?</h2>
              </div>
              {stage >= 3 && (
                <div className="refineryWinner">
                  <span>V0 VISUAL METRIC</span>
                  <strong>{analysis.tokenTaxSaved} saved</strong>
                  <small>Δ {formatSigned(analysis.delta)} groups − surface</small>
                </div>
              )}
            </div>

            <div style={summaryGridStyle}>
              <SummaryCard
                label="surface chunks"
                value={stage >= 3 ? analysis.surfaceChunks : "—"}
                note="flat visible units"
              />
              <SummaryCard
                label="structure groups"
                value={stage >= 3 ? analysis.structureGroups : "—"}
                note="3×3 syllable blocks"
              />
              <SummaryCard
                label="token tax saved"
                value={stage >= 3 ? analysis.tokenTaxSaved : "—"}
                note="surface − groups"
              />
              <SummaryCard
                label="chat cues"
                value={stage >= 3 ? analysis.chatCues : "—"}
                note="laughter / emphasis / shorthand"
              />
            </div>

            <p style={summaryNoteStyle}>
              Surface chunks are the flat units a surface-oriented view exposes. Structure groups are
              the proposed 3×3 syllable-like blocks. A larger saved value means more visible-unit cost
              was absorbed by grouping; the signed Δ keeps the formula explicit.
            </p>
            <p style={nextReadNoteStyle}>
              Next: read the apparatus rules, then the full color key.
            </p>
          </div>
        </div>
      </section>

      <section className="refineryExplain shell" style={wideExplainSectionStyle}>
        <div className="refineryExplainIntro" style={explainIntroFullStyle}>
          <p className="kicker">WHAT THIS TESTS</p>
          <h2 style={sectionTitleStyle}>Surface text is not the only possible unit of comparison.</h2>
          <p className="refineryStepCopy" style={sectionCopyStyle}>
            This comes after the apparatus on purpose: try the transformation first, then read the rules behind it.
            The important split is: colors identify decomposed writing units, blocks preserve local grouping, and thin bars mark typed conversational signals.
          </p>
        </div>

        <div style={contextCardGridStyle}>
          <article className="refineryPanel" style={compactExplainCardStyle}>
            <p className="kicker">WHY 3×3?</p>
            <h3 style={compactCardTitleStyle}>A capacity-based syllable canvas.</h3>
            <p style={compactCardCopyStyle}>
              The 3×3 block is not claiming that every language has nine-part syllables. It is a fixed visual canvas for comparing how writing systems package sound-like units.
            </p>
            <p style={compactCardCopyStyle}>
              English syllable-like groups fill the grid with Latin letters. Korean syllables fill the same grid with jamo. Empty cells stay visible so density and grouping are easier to compare.
            </p>
          </article>

          <article className="refineryPanel" style={compactExplainCardStyle}>
            <p className="kicker">WHAT IS JAMO?</p>
            <h3 style={compactCardTitleStyle}>Jamo are Korean alphabet pieces.</h3>
            <p style={compactCardCopyStyle}>
              Hangul looks like square syllable characters, but each block is built from smaller alphabet-like parts called jamo.
            </p>
            <p style={compactCardCopyStyle}>
              For example, <strong>국</strong> decomposes into <strong>ㄱ + ㅜ + ㄱ</strong>. This lets a Korean syllable block be compared with an English group like <strong>com</strong> inside the same 3×3 canvas.
            </p>
          </article>

          <article className="refineryPanel" style={compactExplainCardStyle}>
            <p className="kicker">WHY CHAT CUES?</p>
            <h3 style={compactCardTitleStyle}>Written language is getting speech-like.</h3>
            <p style={compactCardCopyStyle}>
              Chat, captions, ASR transcripts, and comments often carry typed prosody: laughter, stretched emphasis, and shorthand.
            </p>
            <p style={compactCardCopyStyle}>
              Thin bars under a block mark those conversational signals without replacing the unit colors. The color still identifies the writing unit; the bar marks how that unit is being used.
            </p>
          </article>
        </div>
      </section>

      <section className="refineryMethod shell" style={colorKeySectionStyle}>
        <div className="refineryExplainIntro" style={colorKeyIntroStyle}>
          <p className="kicker">COLOR KEY</p>
          <h2 style={sectionTitleStyle}>How the legend should be read</h2>
          <p className="refineryStepCopy" style={sectionCopyStyle}>
            Use this after seeing the blocks. Fill colors replace letterforms: Latin A–Z and Hangul jamo each get one stable HEX color by evenly spacing the unit set across color space. The exact hue is not the claim; the claim is that once letterforms are removed, rhythm, repetition, density, and transitions can still be compared.
          </p>
        </div>

        <div style={legendHowToReadStyle}>
          <LegendRule title="Fill color" copy="Which decomposed writing unit is inside the block. Each Latin letter and each Hangul jamo has its own stable HEX color." color="#4dd8c4" />
          <LegendRule title="Empty cells" copy="Unused capacity inside the fixed 3×3 canvas. Empty space is part of the density signal." color="rgba(42,42,40,.06)" />
          <LegendRule title="Bottom bar" copy="A second channel for chat cues such as laughter, stretched emphasis, or shorthand." color="#ff7a3d" bar />
          <LegendRule title="Static gallery" copy="Open the generated HTML gallery from the research repo for the full artifact set." href={GALLERY_URL} color="#8f8d86" />
        </div>

        <div style={colorAssignmentGridStyle}>
          <ColorAssignment title="Latin A–Z · 26 unique colors" units={LATIN_UNITS} script="latin" />
          <ColorAssignment title="Hangul jamo · 40 unique colors" units={HANGUL_JAMO_UNITS} script="jamo" />
        </div>
      </section>

      <section className="refineryMethod shell">
        <p className="kicker">LATIN-FAMILY SIMILARITY SKETCH</p>
        <div className="refineryExplainIntro" style={similarityIntroStyle}>
          <h2 style={sectionTitleStyle}>Do structural color patterns recover any expected grouping?</h2>
          <p className="refineryStepCopy" style={sectionCopyStyle}>
            The score is computed without family labels. It compares unit distribution,
            adjacent transitions, rhythm, and 3×3 block density. Labels are shown only after scoring
            as a sanity check, not as model input.
          </p>
        </div>
        <div style={similarityGridStyle}>
          {similarityRows.map((row) => (
            <div className="refineryMetric" key={row.pair}>
              <div className="refineryMetricLabel">
                <span>{row.pair}</span>
                <span>{row.score.toFixed(3)}</span>
              </div>
              <div className="refineryBarTrack">
                <div className="refineryBar" style={{ width: `${row.score * 100}%` }} />
              </div>
              <div className="refineryMetricFoot">
                <span>{row.group}</span>
                <span>labels shown after scoring</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="refineryMethod shell">
        <p className="kicker">UNDER THE HOOD</p>
        <div className="refineryMethodRow">
          <span>01</span><strong>Flatten</strong><p>Count visible surface units as a deliberately simple tokenizer-style baseline.</p>
        </div>
        <div className="refineryMethodRow">
          <span>02</span><strong>Decompose</strong><p>Map Latin letters and Hangul jamo to stable colors after removing letterform dependence.</p>
        </div>
        <div className="refineryMethodRow">
          <span>03</span><strong>Group</strong><p>Place syllable-like units into fixed 3×3 blocks to preserve local structure.</p>
        </div>
        <div className="refineryMethodRow">
          <span>04</span><strong>Compare</strong><p>Sketch token burden, chat cues, and unsupervised structural similarity before full tokenizer benchmarks.</p>
        </div>
      </section>

      <footer className="footer shell">
        <div>
          <p className="kicker">TOKEN VISION</p>
          <p className="resumeNote">Interactive interface for a visual tokenizer prototype.</p>
        </div>
        <p>Next.js demo · <a href={CODE_URL}>Experiment code in GitHub ↗</a></p>
      </footer>
    </main>
  );
}

function SummaryCard({ label, value, note }: { label: string; value: number | string; note: string }) {
  return (
    <article style={summaryCardStyle}>
      <span style={summaryLabelStyle}>{label}</span>
      <strong style={summaryValueStyle}>{value}</strong>
      <small style={summaryFootStyle}>{note}</small>
    </article>
  );
}

function analyzeText(text: string) {
  const groups = structuralGroups(text);
  const surfaceUnits = [...text].filter((char) => !/\s/.test(char));
  const surfaceChunks = surfaceUnits.length;
  const structureGroups = groups.length;
  const chatCues = groups.filter((group) => group.role !== "plain").length;
  const tokenTaxSaved = Math.max(0, surfaceChunks - structureGroups);
  const delta = structureGroups - surfaceChunks;

  return {
    groups,
    surfaceUnits,
    surfaceChunks,
    structureGroups,
    chatCues,
    tokenTaxSaved,
    delta,
  };
}

function structuralGroups(text: string): TokenGroup[] {
  const groups: TokenGroup[] = [];
  let index = 0;
  let wordBreakBefore = false;

  while (index < text.length) {
    const char = text[index];

    if (/\s/.test(char)) {
      wordBreakBefore = true;
      index += 1;
      continue;
    }

    const rest = text.slice(index);
    const latinMatch = rest.match(/^[A-Za-z]+/);
    if (latinMatch) {
      const word = latinMatch[0];
      const role = latinRole(word);
      const chunks = role === "plain" ? splitLatinWord(word) : [word.toLowerCase()];
      chunks.forEach((chunk, chunkIndex) => {
        groups.push({
          text: chunk,
          label: chunk,
          script: "latin",
          units: [...chunk.toLowerCase()].slice(0, 9),
          role,
          wordBreakBefore: wordBreakBefore && chunkIndex === 0,
        });
      });
      index += word.length;
      wordBreakBefore = false;
      continue;
    }

    const laughterMatch = rest.match(/^[ㅋㅎ]{2,}/);
    if (laughterMatch) {
      const token = laughterMatch[0];
      groups.push({ text: token, label: token, script: "jamo", units: [...token].slice(0, 9), role: "laughter", wordBreakBefore });
      index += token.length;
      wordBreakBefore = false;
      continue;
    }

    const jamoEmphasisMatch = rest.match(/^([ㄱ-ㅎㅏ-ㅣ])\1{1,}/);
    if (jamoEmphasisMatch) {
      const token = jamoEmphasisMatch[0];
      groups.push({ text: token, label: token, script: "jamo", units: [...token].slice(0, 9), role: "emphasis", wordBreakBefore });
      index += token.length;
      wordBreakBefore = false;
      continue;
    }

    if (isHangulSyllable(char)) {
      groups.push({
        text: char,
        label: char,
        script: "hangul",
        units: decomposeHangul(char),
        role: "plain",
        wordBreakBefore,
      });
      index += 1;
      wordBreakBefore = false;
      continue;
    }

    if (isHangulJamo(char)) {
      groups.push({ text: char, label: char, script: "jamo", units: [char], role: "plain", wordBreakBefore });
      index += 1;
      wordBreakBefore = false;
      continue;
    }

    groups.push({ text: char, label: char, script: "other", units: [char], role: "plain", wordBreakBefore });
    index += 1;
    wordBreakBefore = false;
  }

  return groups;
}

function splitLatinWord(word: string) {
  const lower = word.toLowerCase();
  if (lower.length <= 4) return [lower];

  const special: Record<string, string[]> = {
    computer: ["com", "pu", "ter"],
    architecture: ["ar", "chi", "tec", "ture"],
    actually: ["ac", "tu", "al", "ly"],
    funny: ["fun", "ny"],
    internationalization: ["in", "ter", "na", "tion", "al", "i", "za", "tion"],
  };
  if (special[lower]) return special[lower];

  const chunks: string[] = [];
  let current = "";
  const vowels = "aeiouy";

  for (let i = 0; i < lower.length; i += 1) {
    current += lower[i];
    const currentIsVowel = vowels.includes(lower[i]);
    const next = lower[i + 1];
    const nextIsVowel = next ? vowels.includes(next) : false;
    const afterNext = lower[i + 2];

    if (current.length >= 2 && currentIsVowel && next && !nextIsVowel && afterNext && vowels.includes(afterNext)) {
      chunks.push(current + next);
      current = "";
      i += 1;
    } else if (current.length >= 3 && currentIsVowel) {
      chunks.push(current);
      current = "";
    }
  }

  if (current) chunks.push(current);
  return chunks.length ? chunks : [lower];
}

function latinRole(word: string): Role {
  const lower = word.toLowerCase();
  if (/^lol+$/.test(lower) || lower === "lmao") return "laughter";
  if (["idk", "omg", "gonna", "wanna"].includes(lower)) return "shorthand";
  if (/(.)\1\1/.test(lower)) return "emphasis";
  return "plain";
}

const JONGSEONG_SPLIT: Record<string, string[]> = {
  ㄳ: ["ㄱ", "ㅅ"],
  ㄵ: ["ㄴ", "ㅈ"],
  ㄶ: ["ㄴ", "ㅎ"],
  ㄺ: ["ㄹ", "ㄱ"],
  ㄻ: ["ㄹ", "ㅁ"],
  ㄼ: ["ㄹ", "ㅂ"],
  ㄽ: ["ㄹ", "ㅅ"],
  ㄾ: ["ㄹ", "ㅌ"],
  ㄿ: ["ㄹ", "ㅍ"],
  ㅀ: ["ㄹ", "ㅎ"],
  ㅄ: ["ㅂ", "ㅅ"],
};

function decomposeHangul(char: string) {
  const code = char.charCodeAt(0) - HANGUL_BASE;
  const choseong = Math.floor(code / 588);
  const jungseong = Math.floor((code % 588) / 28);
  const jongseong = code % 28;
  const finalJamo = JONGSEONG[jongseong];

  return [
    CHOSEONG[choseong],
    JUNGSEONG[jungseong],
    ...(finalJamo ? JONGSEONG_SPLIT[finalJamo] ?? [finalJamo] : []),
  ];
}

function isHangulSyllable(char: string) {
  const code = char.charCodeAt(0);
  return code >= HANGUL_BASE && code <= HANGUL_END;
}

function isHangulJamo(char: string) {
  return /^[ㄱ-ㅎㅏ-ㅣ]$/.test(char);
}

function renderSurfaceTokens(tokens: string[]) {
  return tokens.map((token, index) => (
    <span key={`${token}-${index}`} style={surfaceTokenStyle}>{token}</span>
  ));
}

function renderBlock(group: TokenGroup, index: number) {
  const roleColor = roleBarColor(group.role);
  const cells = Array.from({ length: 9 }, (_, cellIndex) => group.units[cellIndex] ?? "");

  return (
    <div
      key={`${group.text}-${index}`}
      style={{
        ...blockOuterStyle,
        marginLeft: group.wordBreakBefore ? 20 : 0,
      }}
    >
      <div style={gridStyle}>
        {cells.map((unit, cellIndex) => (
          <div
            key={`${group.text}-${cellIndex}`}
            style={{
              ...cellStyle,
              background: unit ? unitColor(unit, group.script) : "rgba(42,42,40,.025)",
              color: unit ? "#242422" : "transparent",
            }}
          >
            {unit}
          </div>
        ))}
      </div>
      {group.role !== "plain" && <div style={{ ...roleBarStyle, background: roleColor }} />}
      <span style={blockLabelStyle}>{group.label}</span>
    </div>
  );
}

function LegendItem({ color, label, bar = false }: { color: string; label: string; bar?: boolean }) {
  return (
    <span style={legendItemStyle}>
      <span style={{ ...legendSwatchStyle, background: bar ? "transparent" : color, borderColor: color }}>
        {bar ? <span style={{ ...legendBarStyle, background: color }} /> : null}
      </span>
      {label}
    </span>
  );
}


function LegendRule({ title, copy, color, bar = false, href }: { title: string; copy: string; color: string; bar?: boolean; href?: string }) {
  return (
    <article style={legendRuleStyle}>
      <span style={{ ...legendRuleSwatchStyle, background: bar ? "transparent" : color, borderColor: color }}>
        {bar ? <span style={{ ...legendRuleBarStyle, background: color }} /> : null}
      </span>
      <div>
        <strong style={legendRuleTitleStyle}>{title}</strong>
        <p style={legendRuleCopyStyle}>{copy}</p>
        {href ? <a href={href} style={legendRuleLinkStyle}>Open gallery ↗</a> : null}
      </div>
    </article>
  );
}

function ColorAssignment({ title, units, script }: { title: string; units: string[]; script: TokenGroup["script"] }) {
  return (
    <article className="refineryPanel" style={colorAssignmentCardStyle}>
      <div className="refineryPanelTop">
        <span>{script === "latin" ? "A–Z" : "JAMO"}</span>
        <span>{title}</span>
      </div>
      <div style={colorMapGridStyle}>
        {units.map((unit) => {
          const color = unitColor(unit, script);
          return (
            <span key={`${title}-${unit}`} style={colorMapItemStyle} title={`${unit}: ${color}`}>
              <span style={{ ...colorMapSwatchStyle, background: color }}>{unit}</span>
              <code style={colorMapCodeStyle}>{color}</code>
            </span>
          );
        })}
      </div>
    </article>
  );
}

function roleLabel(role: Role) {
  if (role === "laughter") return "laughter";
  if (role === "emphasis") return "stretched emphasis";
  if (role === "shorthand") return "chat shorthand";
  return "plain";
}

function roleBarColor(role: Role) {
  if (role === "laughter") return "#33bf75";
  if (role === "emphasis") return "#ff7a3d";
  if (role === "shorthand") return "#27b7b5";
  return "transparent";
}

function unitColor(unit: string, script: TokenGroup["script"]) {
  const latinIndex = LATIN_UNITS.indexOf(unit.toLowerCase());
  if (script === "latin" && latinIndex >= 0) {
    return distinctWheelColor(latinIndex, LATIN_UNITS.length);
  }

  const jamoIndex = HANGUL_JAMO_UNITS.indexOf(unit);
  if ((script === "hangul" || script === "jamo") && jamoIndex >= 0) {
    return distinctWheelColor(jamoIndex, HANGUL_JAMO_UNITS.length);
  }

  return "#dad7cf";
}

function distinctWheelColor(index: number, total: number) {
  // Stable, non-repeating assignment: split the hue wheel by the number of units,
  // then convert to HEX so the legend mirrors the static gallery artifacts.
  const hue = (index * 360) / total;
  return hslToHex(hue, 72, 62);
}

function hslToHex(h: number, s: number, l: number) {
  s /= 100;
  l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;

  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];

  const toHex = (value: number) => Math.round((value + m) * 255).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function formatSigned(value: number) {
  return value > 0 ? `+${value}` : `${value}`;
}

const heroLinkRowStyle = {
  display: "flex",
  flexWrap: "wrap" as const,
  gap: 12,
  marginTop: 26,
};

const heroLinkStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "9px 13px",
  border: "1px solid var(--line)",
  borderRadius: 999,
  color: "var(--ink)",
  textDecoration: "none",
  fontSize: 13,
};

const sectionTitleStyle = {
  maxWidth: 980,
  margin: "10px 0 8px",
  color: "var(--ink)",
  fontSize: "clamp(26px, 2.6vw, 28px)",
  lineHeight: 1.08,
  letterSpacing: "-0.045em",
};

const sectionCopyStyle = {
  maxWidth: 1080,
  lineHeight: 1.62,
  fontSize: "clamp(14px, 1.4vw, 15px)",
};

const inputStyle = {
  width: "100%",
  minHeight: 110,
  margin: "34px 0 18px",
  padding: 0,
  border: 0,
  outline: 0,
  resize: "vertical" as const,
  background: "transparent",
  color: "var(--ink)",
  font: "inherit",
  fontSize: "clamp(20px, 3vw, 30px)",
  lineHeight: 1.35,
  letterSpacing: "-0.035em",
};

const demoHeadWithPresetsStyle = {
  alignItems: "flex-start",
  gap: 22,
};

const presetRowTopStyle = {
  display: "flex",
  flexWrap: "wrap" as const,
  justifyContent: "flex-end",
  gap: 8,
  maxWidth: 650,
};

const presetButtonStyle = {
  padding: "7px 10px",
  border: "1px solid var(--line)",
  borderRadius: 999,
};

const tokenWrapStyle = {
  display: "flex",
  flexWrap: "wrap" as const,
  gap: 7,
  margin: "34px 0 28px",
};

const surfaceTokenStyle = {
  minWidth: 28,
  height: 34,
  padding: "0 9px",
  display: "inline-grid",
  placeItems: "center",
  border: "1px solid var(--line)",
  background: "rgba(250,249,246,.65)",
  color: "var(--muted)",
  fontSize: 15,
};

const blockWrapStyle = {
  display: "flex",
  flexWrap: "wrap" as const,
  alignItems: "flex-start",
  gap: "12px 8px",
  margin: "30px 0 16px",
};

const blockOuterStyle = {
  width: 92,
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 28px)",
  gridTemplateRows: "repeat(3, 28px)",
  gap: 1,
};

const cellStyle = {
  width: 28,
  height: 28,
  display: "grid",
  placeItems: "center",
  fontSize: 13,
  fontWeight: 600,
};

const roleBarStyle = {
  width: 86,
  height: 5,
  marginTop: 4,
  borderRadius: 999,
};

const blockLabelStyle = {
  display: "block",
  marginTop: 7,
  color: "var(--muted)",
  fontSize: 11,
};

const legendPanelStyle = {
  marginTop: 30,
};

const smallCopyStyle = {
  margin: "0 0 16px",
  color: "var(--muted)",
  fontSize: 13,
  lineHeight: 1.65,
};

const miniLegendStyle = {
  display: "grid",
  gap: 10,
  marginBottom: 20,
};

const legendItemStyle = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  color: "var(--muted)",
  fontSize: 12,
};

const legendSwatchStyle = {
  width: 28,
  height: 22,
  display: "inline-flex",
  alignItems: "flex-end",
  border: "1px solid transparent",
};

const legendBarStyle = {
  display: "block",
  width: "100%",
  height: 5,
  borderRadius: 999,
};

const tokenCueListStyle = {
  display: "flex",
  flexWrap: "wrap" as const,
  gap: 8,
};

const cuePillStyle = {
  padding: "7px 10px",
  border: "1px solid var(--line)",
  borderRadius: 999,
  color: "var(--muted)",
  fontSize: 11,
};

const summaryGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
  gap: 18,
  marginTop: 32,
};

const summaryCardStyle = {
  border: "1px solid var(--line)",
  borderRadius: 22,
  padding: "22px 24px",
  minHeight: 128,
  display: "grid",
  alignContent: "start",
  gap: 8,
};

const summaryLabelStyle = {
  color: "var(--muted)",
  fontSize: 16,
  textTransform: "lowercase" as const,
};

const summaryValueStyle = {
  color: "var(--ink)",
  fontSize: "clamp(32px, 4vw, 48px)",
  lineHeight: 0.98,
};

const summaryFootStyle = {
  color: "var(--muted)",
  fontSize: 13,
  lineHeight: 1.5,
};

const summaryNoteStyle = {
  maxWidth: 920,
  marginTop: 24,
  color: "var(--muted)",
  fontSize: 14,
  lineHeight: 1.7,
};

const nextReadNoteStyle = {
  marginTop: 10,
  color: "var(--soft)",
  fontSize: 12,
  letterSpacing: "0.08em",
  textTransform: "uppercase" as const,
};

const explainCardGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: 28,
};

const explainCardStyle = {
  minHeight: 300,
};

const explainCardTitleStyle = {
  margin: "34px 0 22px",
  color: "var(--ink)",
  fontSize: "clamp(34px, 5vw, 52px)",
  lineHeight: 1.04,
  letterSpacing: "-0.055em",
};

const explainCardCopyStyle = {
  margin: "0 0 16px",
  color: "var(--muted)",
  fontSize: "clamp(17px, 2.1vw, 22px)",
  lineHeight: 1.6,
  letterSpacing: "-0.02em",
};

const similarityIntroStyle = {
  marginBottom: 24,
};

const similarityGridStyle = {
  display: "grid",
  gap: 20,
  borderTop: "1px solid var(--line)",
  paddingTop: 22,
};


const wideExplainSectionStyle = {
  display: "block",
};

const explainIntroFullStyle = {
  maxWidth: 980,
  marginBottom: 26,
};

const explainIntroCopyStyle = {
  maxWidth: 980,
  lineHeight: 1.65,
};

const contextCardGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: 18,
};

const compactExplainCardStyle = {
  minHeight: 0,
  padding: "24px 24px",
};

const compactCardTitleStyle = {
  margin: "12px 0 12px",
  color: "var(--ink)",
  fontSize: "clamp(16px, 1.55vw, 20px)",
  fontWeight: 520,
  lineHeight: 1.18,
  letterSpacing: "-0.032em",
};

const compactCardCopyStyle = {
  margin: "0 0 10px",
  color: "var(--muted)",
  fontSize: "clamp(13px, 1.15vw, 14px)",
  lineHeight: 1.6,
  letterSpacing: "-0.01em",
};

const colorKeySectionStyle = {
  display: "block",
};

const colorKeyIntroStyle = {
  maxWidth: 1040,
  marginBottom: 24,
};


const galleryCalloutStyle = {
  display: "flex",
  alignItems: "center",
  gap: 14,
  margin: "0 0 24px",
  padding: "14px 18px",
  border: "1px solid var(--line)",
  color: "var(--muted)",
  fontSize: 14,
};

const legendHowToReadStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
  gap: 14,
  marginBottom: 24,
};

const legendRuleStyle = {
  border: "1px solid var(--line)",
  padding: "18px 18px",
  minHeight: 118,
  display: "flex",
  gap: 14,
  alignItems: "flex-start",
};

const legendRuleSwatchStyle = {
  width: 34,
  height: 28,
  flex: "0 0 auto",
  border: "1px solid transparent",
  display: "flex",
  alignItems: "flex-end",
};

const legendRuleBarStyle = {
  display: "block",
  width: "100%",
  height: 6,
  borderRadius: 999,
};

const legendRuleTitleStyle = {
  display: "block",
  color: "var(--ink)",
  fontSize: 16,
  marginBottom: 8,
};

const legendRuleCopyStyle = {
  margin: 0,
  color: "var(--muted)",
  fontSize: 13,
  lineHeight: 1.55,
};

const legendRuleLinkStyle = {
  display: "inline-block",
  marginTop: 10,
  color: "var(--ink)",
  fontSize: 13,
};

const colorAssignmentGridStyle = {
  display: "grid",
  gridTemplateColumns: "minmax(0, .95fr) minmax(0, 1.45fr)",
  gap: 20,
};

const colorAssignmentCardStyle = {
  minHeight: 0,
  padding: "24px 26px",
};

const colorMapGridStyle = {
  display: "flex",
  flexWrap: "wrap" as const,
  gap: "10px 9px",
  marginTop: 22,
};

const colorMapItemStyle = {
  display: "grid",
  gap: 5,
  justifyItems: "center",
};

const colorMapSwatchStyle = {
  minWidth: 30,
  height: 30,
  padding: "0 4px",
  display: "grid",
  placeItems: "center",
  color: "#242422",
  fontSize: 12,
  fontWeight: 650,
};

const colorMapCodeStyle = {
  color: "var(--muted)",
  fontSize: 9,
  letterSpacing: "-.03em",
};
