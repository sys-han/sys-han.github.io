"use client";

import { useState } from "react";

const lines = [
  {
    text: `A man said to the universe:
    “Sir, I exist!”
    “However,” replied the universe,
    “The fact has not created in me
    A sense of obligation.”`,
    source: "A Man Said to the Universe",
  },

  {
    text: `I was in the darkness;
    I could not see my words
    Nor the wishes of my heart.
    Then suddenly there was a great light —

    “Let me into the darkness again.”`,
    source: "I Was in the Darkness",
  },

  {
    text: `A man went before a strange God —
    The God of many men, sadly wise.
    And the deity thundered loudly,
    Fat with rage, and puffing.

    “Kneel, mortal, and cringe
    And grovel and do homage
    To My Particularly Sublime Majesty.”

    The man fled.

    Then the man went to another God —
    The God of his inner thoughts.
    And this one looked at him
    With soft eyes
    Lit with infinite comprehension,
    And said, “My poor child!”`,
    source: "A Man Went Before a Strange God",
  },
  {
    text: `Three little birds in a row
    Sat musing.

    A man passed near that place.

    Then did the little birds nudge each other.
    They said, "He thinks he can sing."

    They threw back their heads to laugh.`,
    source: "The Black Riders and Other Lines",
  },
  {
    text: `In the desert
    I saw a creature, naked, bestial,
    Who, squatting upon the ground,
    Held his heart in his hands,
    And ate of it.

    I said, "Is it good, friend?"

    "It is bitter—bitter," he answered;
    "But I like it
    Because it is bitter,
    And because it is my heart."`,
    source: "In the Desert",
    },
  {
    text: `Once, I knew a fine song —
    It was all of birds,
    And I held them in a basket.

    When I opened the wicket,
    Heavens! They all flew away.

    I cried, "Come back, little thoughts!"
    But they only laughed.`,
    source: "Once, I Knew a Fine Song",
  },
  {
    text: `"Truth," said a traveller,
    "Is a rock, a mighty fortress."

    "Truth," said a traveller,
    "Is a breath, a wind,
    A shadow, a phantom."

    And I believed the second traveller.`,
    source: "Truth, Said a Traveller",
  },
];

export default function LiteraryVendingMachine() {
  const [current, setCurrent] = useState<number | null>(null);

  function dispense() {
    let next = Math.floor(Math.random() * lines.length);

    if (lines.length > 1 && next === current) {
      next = (next + 1) % lines.length;
    }

    setCurrent(next);
  }

  return (
  <section className="literaryMachine">
    <div className="literaryMachineHead">
      <div>
        <div className="literaryTitleRow">
          <p className="kicker">LITERARY VENDING MACHINE</p>

          <span className="tinyCoffee" aria-hidden="true">
            <span className="coffeeEmoji" aria-hidden="true">☕</span>
          </span>
        </div>

        <p className="literaryMachineLabel">
          Small doses of Stephen Crane.
        </p>
      </div>

      <button className="literaryButton" onClick={dispense}>
        Dispense a poem
      </button>
    </div>

    <div className={`literaryOutput ${current === null ? "isEmpty" : ""}`}>
      {current === null ? (
        <p>25¢ · one poem · existential damage included</p>
      ) : (
        <div className="literaryReceipt" key={current}>
          <blockquote>
            “{lines[current].text.replace(/[“”]/g, "")}”
          </blockquote>
          <span>— Stephen Crane · {lines[current].source}</span>
        </div>
      )}
    </div>
  </section>
  );
}