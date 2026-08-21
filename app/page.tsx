import LiteraryVendingMachine from "./literary-vending-machine";

const projects = [
  {
    eyebrow: "MVP · EVALUATION TOOL",
    title: "Data Refinery Lite",
    body:
      "A lightweight synthetic-data workbench for testing whether generated training examples improve low-data classifiers.",
    tags: ["Synthetic Data", "ML Evaluation", "Low-Data Learning"],
    demo: "/data-refinery",
    code: "https://github.com/sys-han/data-refinery-lite",
    disabled: false,
  },
  {
    eyebrow: "RESEARCH PROTOTYPE · TOKENIZATION",
    title: "What Languages Look Like Without Letters",
    body:
      "An experimental interface for looking beyond surface orthography and comparing languages through rhythm, repetition, token burden, and structural patterns.",
    tags: ["Multilingual NLP", "Representation", "Structural Encoding"],
    demo: "/token-vision",
    code: "https://github.com/sys-han/token-vision",
    disabled: false,
  },
  {
    eyebrow: "RESEARCH PROTOTYPE · BUILDING",
    title: "Ontology-Aware Language Model",
    body:
      "An experimental framework for testing whether structured semantic priors can improve tokenization, attention, and low-resource language modeling.",
    tags: ["Knowledge Graphs", "Transformers", "Semantic NLP"],
    demo: "#",
    code: "https://github.com/YOUR-USERNAME",
    disabled: true,
  },
];

const experience = [
  {
    role: "Sr Product Designer",
    company: "Esri",
    detail:
      "Backend, ML, and data systems · distributed multimodal workflows · query/API layers · semantic systems",
  },
  {
    role: "Lead UX Analyst / Engineer",
    company: "Megaputer Intelligence",
    detail:
      "Production ML/NLP components · classification, clustering, anomaly pipelines · enterprise analytics",
  },
  {
    role: "MDP Product Engineer",
    company: "Zenuity",
    detail:
      "Autonomous-system perception · CNN workflows · embedded C++ / Python",
  },
];

export default function Home() {
  return (
    <main>
      <header className="nav shell">
        <a className="mark" href="#top" aria-label="Home">
          Robyn Han.
        </a>
        <nav>
          <a href="#work">Work</a>
          <a href="#experience">Experience</a>
          <a href="https://github.com/sys-han">GitHub ↗</a>
          <a href="https://www.linkedin.com/in/robynh">LinkedIn ↗</a>
        </nav>
      </header>

      <section className="profileIntro shell" id="top">
        <p className="kickerSecondary">SOFTWARE · ML · DATA SYSTEMS</p>
        <div className="introText">
          <p>
            I am an engineer working across backend, data, and machine-learning 
            systems. My experience includes C++/C# systems for time-series and 
            geospatial analytics, distributed multimodal data pipelines, 
            query-processing and API layers, and knowledge-graph systems. 
            </p>
            <p>
            I have also worked on production NLP/ML pipelines for classification, 
            clustering, anomaly detection, feature processing, and automated labeling, 
            along with embedded C++/Python systems for autonomous vehicles. Also, I am 
            currently pursuing a B.S. in Data Science at the University of Michigan 
            alongside full-time work.
          </p>
        </div>
      </section>

      <section className="section shell" id="work">
        <div className="sectionHead sectionHeadSolo">
          <p className="kicker">SELECTED WORK</p>
        </div>

        <div className="projectGrid">
          {projects.map((project, index) => (
            <article
              className={`card ${project.disabled ? "cardDisabled" : ""}`}
              key={project.title}
            >
              <div className="cardTop">
                <span>0{index + 1}</span>
                <span>{project.eyebrow}</span>
              </div>
              <h2>{project.title}</h2>
              <p>{project.body}</p>
              <div className="tags">
                {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
              </div>
              <div className="cardLinks">
                {project.disabled ? (
                  <span className="comingSoon">Coming soon</span>
                  ) : (
                    <>
                <a href={project.demo}>Demo ↗</a>
                <a href={project.code}>Code ↗</a>
                </>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section shell" id="experience">
        <div className="sectionHead sectionHeadSolo">
          <p className="kicker">EXPERIENCE</p>
        </div>
        <div className="experienceList">
          {experience.map((item) => (
            <div className="experienceRow" key={item.role}>
              <h3>
                {item.role}
                <span className="company">@ {item.company}</span>
              </h3>
              <p>{item.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section shell">
        <LiteraryVendingMachine />
      </section>

      <footer className="footer shell">
        <div>
          <p className="kickerSecondary">CONTACT</p>
          <a className="email">
            ryh.post [at] gmail [dot] com
          </a>
          <p className="resumeNote">Resume available upon request.</p>
        </div>
        <p>Built with Next.js · Hosted on GitHub Pages</p>
      </footer>
    </main>
  );
}
