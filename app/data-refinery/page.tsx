"use client";

import { useMemo, useState } from "react";

const examples = [
  {
    id: 1,
    sentiment: "negative",
    original: "the master of disguise may have made a great saturday night live sketch , but a great movie it is not .",
    masked: "the master of disguise may have made a great saturday night live sketch , but a <mask> is not .",
    guided: "The Master of Disguise might have worked wonderfully as a Saturday Night Live skit, but it fails as a feature film.",
    direct: "The Master of Disguise might have worked wonderfully as a Saturday Night Live sketch, but it does not work as a great film.",
  },
  {
    id: 2,
    sentiment: "positive",
    original: "ms . seigner and mr . serrault bring fresh , unforced naturalism to their characters .",
    masked: "ms . <mask> mr . serrault bring fresh , unforced naturalism to their characters .",
    guided: "Ms. Seigner and Mr. Serrault give their roles a fresh, effortless sense of realism.",
    direct: "Ms. Seigner and Mr. Serrault give their characters a fresh, effortless sense of naturalism.",
  },
  {
    id: 3,
    sentiment: "negative",
    original: "eight legged freaks ? no big hairy deal .",
    masked: "eight legged freaks ? <mask> big hairy deal .",
    guided: "Eight Legged Freaks? It is hardly anything to get excited about.",
    direct: "Eight Legged Freaks? It is hardly a big, hairy deal.",
  },
  {
    id: 4,
    sentiment: "positive",
    original: "the bard as black comedy -- willie would have loved it .",
    masked: "the bard as black comedy -- <mask> have loved it .",
    guided: "The Bard recast as black comedy—Willie would have relished it.",
    direct: "The Bard recast as black comedy—Willie would have adored it.",
  },
  {
    id: 5,
    sentiment: "positive",
    original: "generally provides its target audience of youngsters enough stimulating eye and ear candy to make its moral medicine go down .",
    masked: "generally provides its target audience of youngsters enough stimulating eye and ear candy <mask> moral medicine go down .",
    guided: "It generally gives its young target audience enough visual and aural stimulation to help the moral lesson go down.",
    direct: "For the most part, it gives its young target audience enough visual and auditory stimulation to help the moral lesson go down.",
  },
  {
    id: 6,
    sentiment: "negative",
    original: "the cold turkey would've been a far better title .",
    masked: "the cold turkey would've been a <mask> title .",
    guided: "The Cold Turkey would have been a much better title.",
    direct: "Cold Turkey would have been a much better title.",
  },
  {
    id: 7,
    sentiment: "negative",
    original: "couldn't someone take rob schneider and have him switch bodies with a funny person ?",
    masked: "couldn't someone take rob schneider <mask> him switch bodies with a funny person ?",
    guided: "Could someone arrange for Rob Schneider to trade bodies with a person who is actually funny?",
    direct: "Could someone arrange for Rob Schneider to swap bodies with somebody funny?",
  },
  {
    id: 8,
    sentiment: "positive",
    original: "the underworld urban angst is derivative of martin scorsese's taxi driver and goodfellas , but this film speaks for itself .",
    masked: "the underworld urban angst is derivative of martin scorsese's taxi driver and <mask> this film speaks for itself .",
    guided: "Its urban underworld anxiety borrows from Martin Scorsese's Taxi Driver and Goodfellas, yet the film still stands on its own.",
    direct: "Its urban underworld angst draws heavily from Martin Scorsese's Taxi Driver and Goodfellas, yet the film still speaks on its own behalf.",
  },
  {
    id: 9,
    sentiment: "positive",
    original: "a sensitive , cultivated treatment of greene's work as well as a remarkably faithful one .",
    masked: "a sensitive , cultivated treatment <mask> work as well as a remarkably faithful one .",
    guided: "This is a sensitive, cultivated handling of Greene's work as well as an impressively faithful one.",
    direct: "A refined and sensitive interpretation of Greene's work that is also impressively faithful.",
  },
  {
    id: 10,
    sentiment: "negative",
    original: "like its title character , esther kahn is unusual but unfortunately also irritating .",
    masked: "like its title character , esther kahn is unusual <mask> also irritating .",
    guided: "Like the character named in its title, Esther Kahn is distinctive but regrettably irritating as well.",
    direct: "Like the character named in its title, Esther Kahn is distinctive but, regrettably, irritating as well.",
  },
  {
    id: 11,
    sentiment: "negative",
    original: "talky , artificial and opaque . . . an interesting technical exercise , but a tedious picture .",
    masked: "talky , artificial and opaque . . . an interesting technical exercise , <mask> picture .",
    guided: "Verbose, contrived, and impenetrable, it is technically intriguing but tedious as a film.",
    direct: "Verbose, contrived, and impenetrable, it is an intriguing technical experiment but a tiresome film.",
  },
  {
    id: 12,
    sentiment: "negative",
    original: "essentially a collection of bits -- and they're all naughty .",
    masked: "essentially a collection of bits -- <mask> all naughty .",
    guided: "It is essentially a series of separate bits, every one of them naughty.",
    direct: "It is basically an assortment of sketches, every one of them naughty.",
  },
  {
    id: 13,
    sentiment: "negative",
    original: "you come away wishing , though , that the movie spent a lot less time trying to make a credible case for reports from the afterlife and a lot more time on the romantic urgency that's at the center of the story .",
    masked: "you come away wishing , though , that the movie spent a lot less time trying to make a credible case for reports from <mask> lot more time on the romantic urgency that's at the center of the story .",
    guided: "You leave wishing the movie had devoted far less effort to validating reports from the afterlife and far more to the romantic urgency at its core.",
    direct: "Still, you leave wishing the film had devoted far less time to establishing the credibility of messages from the afterlife and far more to the romantic urgency at the story's core.",
  },
  {
    id: 14,
    sentiment: "positive",
    original: "smith is careful not to make fun of these curious owners of architectural oddities . instead , he shows them the respect they are due .",
    masked: "smith is careful not to make fun of these curious owners of architectural oddities . instead , he shows them <mask> due .",
    guided: "Smith never mocks these unusual owners of architectural curiosities; instead, he treats them with the respect they deserve.",
    direct: "Smith avoids ridiculing these unusual owners of architectural curiosities and instead treats them with the respect they deserve.",
  },
  {
    id: 15,
    sentiment: "negative",
    original: "a sentimental hybrid that could benefit from the spice of specificity .",
    masked: "a sentimental hybrid that <mask> from the spice of specificity .",
    guided: "This sentimental blend would benefit from a stronger dose of specificity.",
    direct: "This sentimental blend would be improved by a stronger dose of specificity.",
  },
  {
    id: 16,
    sentiment: "positive",
    original: "russian ark is a new treasure of the hermitage .",
    masked: "russian ark <mask> new treasure of the hermitage .",
    guided: "The Hermitage has a new treasure in Russian Ark.",
    direct: "Russian Ark is a newly discovered treasure of the Hermitage.",
  },
  {
    id: 17,
    sentiment: "negative",
    original: "for all its impressive craftsmanship , and despite an overbearing series of third-act crescendos , lily chou-chou never really builds up a head of emotional steam .",
    masked: "for all its impressive craftsmanship , and despite an overbearing <mask> , lily chou-chou never really builds up a head of emotional steam .",
    guided: "Despite its impressive craft and an overbearing succession of third-act climaxes, Lily Chou-Chou never develops much emotional momentum.",
    direct: "Despite its accomplished craftsmanship and an overpowering succession of third-act climaxes, Lily Chou-Chou never generates much emotional momentum.",
  },
  {
    id: 18,
    sentiment: "negative",
    original: "peralta's mythmaking could have used some informed , adult hindsight .",
    masked: "peralta's mythmaking could have used some <mask> adult hindsight .",
    guided: "A better-informed adult perspective would have improved Peralta's mythmaking.",
    direct: "Peralta's creation of myth would have benefited from informed, mature hindsight.",
  },
  {
    id: 19,
    sentiment: "positive",
    original: "not the best herzog perhaps , but unmistakably herzog .",
    masked: "not the best herzog <mask> but unmistakably herzog .",
    guided: "Perhaps not Herzog at his finest, but unmistakably his work.",
    direct: "It may not be Herzog at his finest, but it is unmistakably his work.",
  },
  {
    id: 20,
    sentiment: "positive",
    original: "films are made of little moments . changing lanes tries for more . it doesn't reach them , but the effort is gratefully received .",
    masked: "films are made of little moments . changing lanes tries for more . <mask> , but the effort is gratefully received .",
    guided: "Movies are built from small moments, while Changing Lanes reaches for something more. It falls short, though the attempt is welcome.",
    direct: "Movies are composed of small moments, but Changing Lanes reaches for something larger. It falls short, though the attempt is appreciated.",
  },
  {
    id: 21,
    sentiment: "negative",
    original: "no , it's not nearly as good as any of its influences .",
    masked: "no , it's not nearly as good <mask> of its influences .",
    guided: "No, it does not come close to matching any of the works that influenced it.",
    direct: "No, it comes nowhere close to matching any of the works that influenced it.",
  },
  {
    id: 22,
    sentiment: "positive",
    original: "visually fascinating . . . an often intense character study about fathers and sons , loyalty and duty .",
    masked: "visually fascinating . . . an often intense character study about <mask> , loyalty and duty .",
    guided: "Visually absorbing, it is also an often intense study of fathers and sons, loyalty, and duty.",
    direct: "Visually absorbing, it is an often powerful character study of fathers and sons, loyalty, and duty.",
  },
  {
    id: 23,
    sentiment: "positive",
    original: "one of [herzog's] least inspired works .",
    masked: "one of [herzog's] least <mask> works .",
    guided: "This ranks among Herzog's least inspired creations.",
    direct: "It ranks among Herzog's least imaginative efforts.",
  },
  {
    id: 24,
    sentiment: "positive",
    original: "with youthful high spirits , tautou remains captivating throughout michele's religious and romantic quests , and she is backed by a likable cast .",
    masked: "with youthful high spirits , tautou remains captivating throughout <mask> quests , and she is backed by a likable cast .",
    guided: "Buoyed by youthful energy, Tautou stays captivating through Michele's religious and romantic pursuits, supported by an appealing cast.",
    direct: "Brimming with youthful energy, Tautou stays captivating through Michele's religious and romantic pursuits, supported by an appealing cast.",
  },
  {
    id: 25,
    sentiment: "positive",
    original: "a dazzling thing to behold -- as long as you're wearing the somewhat cumbersome 3d goggles the theater provides .",
    masked: "a dazzling thing to behold <mask> as you're wearing the somewhat cumbersome 3d goggles the theater provides .",
    guided: "It is dazzling to look at, provided you are wearing the theater's rather cumbersome 3D glasses.",
    direct: "It is spectacular to look at, provided you are wearing the theater's somewhat unwieldy 3D glasses.",
  },
  {
    id: 26,
    sentiment: "negative",
    original: "ice age posits a heretofore unfathomable question : is it possible for computer-generated characters to go through the motions ?",
    masked: "ice age posits a heretofore unfathomable question : is it possible for computer-generated characters <mask> the motions ?",
    guided: "Ice Age raises a previously inconceivable question: can computer-generated characters merely go through the motions?",
    direct: "Ice Age raises a previously inconceivable question: can computer-generated characters simply go through the motions?",
  },
  {
    id: 27,
    sentiment: "positive",
    original: "\" brown sugar \" admirably aspires to be more than another \" best man \" clone by weaving a theme throughout this funny film .",
    masked: "\" brown sugar \" admirably aspires to be more than another \" best man <mask> a theme throughout this funny film .",
    guided: "\"Brown Sugar\" commendably tries to be more than another \"Best Man\" imitation by threading a theme through this funny movie.",
    direct: "Brown Sugar commendably tries to become more than another Best Man imitation by threading a consistent theme through this amusing film.",
  },
  {
    id: 28,
    sentiment: "positive",
    original: "notorious c . h . o . has oodles of vulgar highlights .",
    masked: "notorious c . h . o . <mask> of vulgar highlights .",
    guided: "Notorious C.H.O. offers an abundance of vulgar high points.",
    direct: "Notorious C.H.O. contains an abundance of crude high points.",
  },
  {
    id: 29,
    sentiment: "negative",
    original: "the pivotal narrative point is so ripe the film can't help but go soft and stinky .",
    masked: "the pivotal <mask> so ripe the film can't help but go soft and stinky .",
    guided: "The crucial narrative turn is so overripe that the film inevitably becomes soft and foul.",
    direct: "The central turn in the story is so overripe that the movie inevitably becomes mushy and foul.",
  },
  {
    id: 30,
    sentiment: "negative",
    original: "another wholly unnecessary addition to the growing , moldering pile of , well , extreme stunt pictures .",
    masked: "another wholly unnecessary addition <mask> , moldering pile of , well , extreme stunt pictures .",
    guided: "It is another completely needless contribution to the growing, decaying heap of extreme-stunt films.",
    direct: "Yet another completely needless entry in the expanding, decaying heap of extreme-stunt movies.",
  },
  {
    id: 31,
    sentiment: "positive",
    original: "lathan and diggs have considerable personal charm , and their screen rapport makes the old story seem new .",
    masked: "lathan and diggs have considerable personal charm , and their screen <mask> old story seem new .",
    guided: "Lathan and Diggs possess substantial personal charm, and their on-screen chemistry makes a familiar story feel fresh.",
    direct: "Lathan and Diggs possess plenty of individual charm, and their on-screen chemistry makes the familiar tale feel fresh.",
  },
  {
    id: 32,
    sentiment: "negative",
    original: "you may be galled that you've wasted nearly two hours of your own precious life with this silly little puddle of a movie .",
    masked: "you may be galled that you've wasted nearly two hours of your own precious life with this <mask> a movie .",
    guided: "You may resent surrendering almost two precious hours of your life to this slight, silly excuse for a movie.",
    direct: "You may resent having squandered almost two precious hours of your life on this foolish little puddle of a film.",
  }
];

const metrics = [
  { label: "32 real", short: "Real only", f1: 0.5295662717, delta: 0 },
  { label: "+ 32 masked, unrecovered", short: "Damaged data", f1: 0.5240147544, delta: -0.0055515173 },
  { label: "+ 32 corruption-guided rewrites", short: "Refined rewrites", f1: 0.5452413251, delta: 0.0156750534, best: true },
  { label: "+ 32 direct paraphrases", short: "Direct paraphrases", f1: 0.5309212228, delta: 0.0013549511 },
];

export default function DataRefineryPage() {
  const [exampleIndex, setExampleIndex] = useState(0);
  const [stage, setStage] = useState<0 | 1 | 2 | 3>(0);

  const example = examples[exampleIndex];

  const nextExample = () => {
    setExampleIndex((current) => (current + 1) % examples.length);
    setStage(0);
  };

  const maxF1 = useMemo(() => Math.max(...metrics.map((item) => item.f1)), []);

  return (
    <main className="refineryPage">
      <header className="nav shell">
        <a className="mark" href="/" aria-label="Home">Robyn Han.</a>
        <nav>
          <a href="/">← Home</a>
          <a href="https://github.com/sys-han/data-refinery-lite">Code ↗</a>
        </nav>
      </header>

      <section className="refineryHero shell">
        <div>
          <p className="kicker">DATA REFINERY LITE · INTERACTIVE DEMO</p>
          <h1>Can synthetic text actually make a tiny classifier better?</h1>
          <p className="refineryLead">
            Start with a real movie review, damage part of it, then compare two ways
            of generating synthetic training data. The final step shows what happened
            when each version was added to the same low-data classifier.
          </p>
        </div>

        <div className="refineryHeroMeta">
          <span>32 real examples</span>
          <span>32 synthetic additions</span>
          <span>TF-IDF + Logistic Regression</span>
          <span>Rotten Tomatoes sentiment</span>
        </div>
      </section>

      <section className="refineryDemo shell">
        <div className="refineryDemoHead">
          <div>
            <p className="kicker">TRY THE PIPELINE</p>
            <p className="refineryStepCopy">
              Example {example.id} of {examples.length} · {example.sentiment} review
            </p>
          </div>
          <button className="refineryTextButton" onClick={nextExample}>
            Try another review ↻
          </button>
        </div>

        <div className="refineryFlow">
          <article className="refineryPanel">
            <div className="refineryPanelTop">
              <span>01</span>
              <span>REAL EXAMPLE</span>
            </div>
            <p>{example.original}</p>
            <div className="refineryActionRow">
              <button className="refineryButton" onClick={() => setStage(1)}>
                Corrupt it
              </button>
            </div>
          </article>

          <div className={`refineryConnector ${stage >= 1 ? "isActive" : ""}`}>↓</div>

          <article className={`refineryPanel ${stage < 1 ? "isMuted" : ""}`}>
            <div className="refineryPanelTop">
              <span>02</span>
              <span>CONTROLLED CORRUPTION</span>
            </div>
            <p className="refineryMasked">
              {stage >= 1 ? renderMasked(example.masked) : "A short span will be hidden here."}
            </p>
            <div className="refineryActionRow">
              <button
                className="refineryButton"
                disabled={stage < 1}
                onClick={() => setStage(2)}
              >
                Generate variants
              </button>
            </div>
          </article>

          <div className={`refineryConnector ${stage >= 2 ? "isActive" : ""}`}>↓</div>

          <div className={`refineryVariants ${stage < 2 ? "isMuted" : ""}`}>
            <article className="refineryPanel refineryVariant">
              <div className="refineryPanelTop">
                <span>03A</span>
                <span>CORRUPTION-GUIDED</span>
              </div>
              <p>
                {stage >= 2
                  ? example.guided
                  : "A rewrite generated from the damaged input appears here."}
              </p>
              <span className="refineryMethodNote">Rewrite from masked context</span>
            </article>

            <article className="refineryPanel refineryVariant">
              <div className="refineryPanelTop">
                <span>03B</span>
                <span>DIRECT PARAPHRASE</span>
              </div>
              <p>
                {stage >= 2
                  ? example.direct
                  : "A conventional paraphrase of the original appears here."}
              </p>
              <span className="refineryMethodNote">Paraphrase from full original</span>
            </article>
          </div>

          <div className={`refineryConnector ${stage >= 2 ? "isActive" : ""}`}>↓</div>

          <div className="refineryRunRow">
            <button
              className="refineryButton refineryButtonStrong"
              disabled={stage < 2}
              onClick={() => setStage(3)}
            >
              Run the experiment
            </button>
          </div>

          <div className={`refineryResults ${stage < 3 ? "isMuted" : ""}`}>
            <div className="refineryResultsHead">
              <div>
                <p className="kicker">DOWNSTREAM RESULT</p>
                <h2>Which training data actually helped?</h2>
              </div>
              {stage >= 3 && (
                <div className="refineryWinner">
                  <span>BEST PILOT RESULT</span>
                  <strong>+0.0157 Macro-F1</strong>
                  <small>vs. 32-example real-only baseline</small>
                </div>
              )}
            </div>

            <div className="refineryBars">
              {metrics.map((item) => {
                const relativeWidth = 30 + ((item.f1 - 0.52) / (maxF1 - 0.52)) * 70;
                return (
                  <div className="refineryMetric" key={item.label}>
                    <div className="refineryMetricLabel">
                      <span>{item.short}</span>
                      <span>{stage >= 3 ? item.f1.toFixed(4) : "—"}</span>
                    </div>
                    <div className="refineryBarTrack">
                      <div
                        className={`refineryBar ${item.best ? "isBest" : ""}`}
                        style={{
                          width: stage >= 3 ? `${relativeWidth}%` : "0%",
                        }}
                      />
                    </div>
                    <div className="refineryMetricFoot">
                      <span>{item.label}</span>
                      <span>
                        {stage >= 3
                          ? item.delta === 0
                            ? "baseline"
                            : `${item.delta > 0 ? "+" : ""}${item.delta.toFixed(4)}`
                          : ""}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="refineryExplain shell">
        <div className="refineryExplainIntro">
          <p className="kicker">WHAT THIS TESTS</p>
          <h2>Good-looking synthetic data is not necessarily useful training data.</h2>
        </div>
        <div className="refineryExplainGrid">
          <p>
            The experiment keeps the original 32 examples, augmentation budget, and
            test split fixed. Only the added training data changes.
          </p>
          <p>
            In the fixed seed-11 pilot, corruption-guided rewrites outperformed direct
            paraphrases and unrecovered masked examples on downstream Macro-F1.
          </p>
          <p>
            This is a directional one-seed result, not evidence that the method
            generalizes across datasets, classifiers, seeds, or model snapshots.
          </p>
        </div>
      </section>

      <section className="refineryMethod shell">
        <p className="kicker">UNDER THE HOOD</p>
        <div className="refineryMethodRow">
          <span>01</span><strong>Sample</strong><p>16 positive + 16 negative labeled reviews.</p>
        </div>
        <div className="refineryMethodRow">
          <span>02</span><strong>Corrupt</strong><p>Mask a controlled span in each source example.</p>
        </div>
        <div className="refineryMethodRow">
          <span>03</span><strong>Generate</strong><p>Collect corruption-guided rewrites and direct paraphrases.</p>
        </div>
        <div className="refineryMethodRow">
          <span>04</span><strong>Evaluate</strong><p>Train the same TF-IDF + Logistic Regression classifier under four conditions.</p>
        </div>
      </section>

      <footer className="footer shell">
        <div>
          <p className="kicker">DATA REFINERY LITE</p>
          <p className="resumeNote">Interactive replay of saved experiment artifacts.</p>
        </div>
        <p>Next.js demo · Experiment code in GitHub ↗</p>
      </footer>
    </main>
  );
}

function renderMasked(text: string) {
  const parts = text.split("<mask>");
  if (parts.length === 1) return text;

  return (
    <>
      {parts[0]}
      <mark className="refineryMask">[MASK]</mark>
      {parts.slice(1).join("<mask>")}
    </>
  );
}
