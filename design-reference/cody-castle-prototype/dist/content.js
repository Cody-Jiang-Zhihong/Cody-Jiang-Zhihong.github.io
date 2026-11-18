window.CASTLE_CONTENT = {
  rooms: {
    "great-hall": {
      title: "The Gallery",
      kicker: "01 / SELECTED WORK",
      subtitle: "A collection of things I build.",
      description: "Start with a project. Explore gameplay AI, machine learning, and software built around data.",
      hotspots: [
        { x: 0.25, y: 0.73, label: "Gameplay AI", detail: "abyssalpact" },
        { x: 0.57, y: 0.50, label: "JEPA World Model", detail: "jepa" },
        { x: 0.82, y: 0.64, label: "Steam Review Radar", detail: "steam" }
      ]
    },
    observatory: {
      title: "The Observatory",
      kicker: "02 / RESEARCH",
      subtitle: "Questions worth looking into.",
      description: "Machine learning, world models, and the questions that follow when AI becomes part of software development.",
      hotspots: [
        { x: 0.50, y: 0.42, label: "JEPA World Model", detail: "jepa" },
        { x: 0.24, y: 0.70, label: "Code & Technical Debt", detail: "debt" }
      ]
    },
    workshop: {
      title: "The Workshop",
      kicker: "03 / MAKING",
      subtitle: "Code, paint, and small worlds.",
      description: "A place for games, miniature painting, and the work that happens away from a finished project page.",
      hotspots: [
        { x: 0.30, y: 0.57, label: "Games", detail: "games" },
        { x: 0.63, y: 0.53, label: "Miniature Bench", detail: "craft" },
        { x: 0.90, y: 0.57, label: "JiJi", detail: "jiji" }
      ]
    },
    study: {
      title: "The Study",
      kicker: "04 / ABOUT & CV",
      subtitle: "The person behind the projects.",
      description: "Meet Cody, read the CV, or get in touch. There is always a direct route to the essentials.",
      hotspots: [
        { x: 0.35, y: 0.74, label: "Curriculum Vitae", detail: "cv" },
        { x: 0.64, y: 0.30, label: "About Cody", detail: "about" },
        { x: 0.82, y: 0.62, label: "Get in Touch", detail: "contact" }
      ]
    }
  },
  details: {
    abyssalpact: {
      title: "Gameplay AI for AbyssalPact",
      eyebrow: "SELECTED WORK / GAME AI",
      summary: "Enemy AI for a turn-based card game built with a Unity, C#, and XLua hybrid runtime.",
      sections: [
        {
          heading: "The system",
          body: "My work covers the enemy AI architecture and its runtime behavior. Extensible AI tags and metadata provide a foundation for different enemy behaviors."
        },
        {
          heading: "What I built",
          body: "I built the enemy-turn execution pipeline, including scoring, target selection, summon placement, and fallback handling, with runtime parameters and debugging safeguards."
        }
      ],
      links: [
        { label: "Project context ↗", href: "https://codyjiang.com/#experience" },
        { label: "Explore my games on itch.io", href: "https://cody-jiang.itch.io/" }
      ]
    },
    jepa: {
      title: "JEPA World Model",
      eyebrow: "RESEARCH / NYU COURSE PROJECT",
      summary: "An end-to-end implementation and training workflow for future latent-state prediction, developed for the NYU Deep Learning course, September–December 2024.",
      sections: [
        {
          heading: "Approach",
          body: "The recurrent variant combines image sequences with action inputs to predict future latent states. The work spans model implementation and the training workflow."
        },
        {
          heading: "Training & evaluation",
          body: "The workflow uses VICReg/BYOL-style regularization constraints and probe-based evaluation to examine the learned representations. This is a course project."
        }
      ],
      links: [
        { label: "Project context ↗", href: "https://codyjiang.com/#experience" }
      ]
    },
    steam: {
      title: "Steam Review Radar",
      eyebrow: "SELECTED WORK / DATA & SOFTWARE",
      summary: "Platform behavior and signal-quality analysis, built around Steam reviews and a large-scale data pipeline.",
      sections: [
        {
          heading: "The system",
          body: "A large-scale pipeline brings Steam review data into a workflow for examining platform behavior and the quality of review signals."
        },
        {
          heading: "Approach",
          body: "The analysis uses Negative Binomial modeling and XGBoost, connecting statistical methods and machine learning with the data pipeline."
        }
      ],
      links: [
        { label: "Portfolio entry", href: "https://codyjiang.com/#projects" }
      ]
    },
    debt: {
      title: "AI-Generated Code & Technical Debt",
      eyebrow: "RESEARCH / SOFTWARE ENGINEERING",
      summary: "A system for analyzing technical debt in AI-generated code, combining code analysis with a practical data-processing workflow.",
      sections: [
        {
          heading: "The system",
          body: "The AI-Generated Code Technical Debt Analysis System brings static analysis and visualization together to examine technical debt in generated software."
        },
        {
          heading: "Approach",
          body: "The project uses Python and Dask for processing, with Git and Docker in the workflow. Static analysis provides material for inspection and visualization."
        }
      ],
      links: [
        { label: "Portfolio entry", href: "https://codyjiang.com/#projects" }
      ]
    },
    games: {
      title: "Games & Playable Experiments",
      eyebrow: "WORKSHOP / GAME DEVELOPMENT",
      summary: "Game projects you can open and explore, alongside my gameplay AI work.",
      sections: [
        {
          heading: "Try a build",
          body: "Open Project 150 or a Contra-like arcade game with 1P / 2P modes. Both builds are hosted on my original website."
        },
        {
          heading: "More games",
          body: "My itch.io page is another entrance to this part of my work. AbyssalPact also has its own exhibit in the Gallery."
        }
      ],
      links: [
        { label: "Play Project 150", href: "https://codyjiang.com/myGame/PROJECT_150/index.html" },
        { label: "Play Contra-like arcade game (1P / 2P)", href: "https://codyjiang.com/myGame/Codys_Final_Proj/index.html" },
        { label: "Visit my itch.io page", href: "https://cody-jiang.itch.io/" }
      ]
    },
    craft: {
      title: "The Miniature Bench",
      eyebrow: "WORKSHOP / PAINTING & KITBASHING",
      summary: "Small worlds made by hand: miniature painting, kitbashing, and the details that make a model feel personal.",
      sections: [
        {
          heading: "On the bench",
          body: "Warhammer miniatures are part of my creative life, from painting Ultramarines to modifying models and building terrain."
        },
        {
          heading: "The collection",
          body: "This space is intended for finished pieces, close-up details, and work in progress, with room to show how each model takes shape."
        },
        {
          heading: "About the imagery",
          body: "The castle and its rooms are concept illustrations, not project screenshots. Scene artwork is illustrative; the finished gallery will use photographs of my own miniatures."
        }
      ],
      links: []
    },
    jiji: {
      title: "Meet JiJi",
      eyebrow: "WORKSHOP / STUDIO COMPANION",
      summary: "JiJi is my black shorthair cat and studio companion.",
      sections: [
        {
          heading: "A personal corner",
          body: "There is room in the castle for the life around the projects, too. This small corner belongs to JiJi."
        },
        {
          heading: "Back to the workshop",
          body: "The game projects and miniature bench are just a few steps away."
        }
      ],
      links: []
    },
    cv: {
      title: "Curriculum Vitae",
      eyebrow: "STUDY / BACKGROUND & EXPERIENCE",
      summary: "A direct route to my academic and professional background.",
      sections: [
        {
          heading: "February 2026 edition",
          body: "This link opens the February 2026 edition of the CV hosted on my existing website."
        },
        {
          heading: "Areas of focus",
          body: "My background brings together computer science study at NYU and project work in ML systems, gameplay AI, and software engineering."
        }
      ],
      links: [
        { label: "Open February 2026 CV", href: "https://codyjiang.com/myResume/ZhihongJiang_CurriculumVitae_Feb2026.pdf" },
        { label: "View original portfolio", href: "https://codyjiang.com/" }
      ]
    },
    about: {
      title: "Cody Jiang",
      eyebrow: "STUDY / ABOUT",
      summary: "Zhihong Jiang / 姜知泓. I work on ML systems, gameplay AI, and software people can use.",
      sections: [
        {
          heading: "Background",
          body: "I am an M.S. in Computer Science student at NYU. My portfolio brings together machine learning, games, and software engineering."
        },
        {
          heading: "Away from the screen",
          body: "I paint and kitbash miniatures, build small worlds, and share my space with JiJi, my black shorthair cat."
        },
        {
          heading: "Why a castle?",
          body: "Each room gives a different part of my work a place of its own. You can explore slowly, or head straight to a project, the CV, or my contact details."
        }
      ],
      links: [
        { label: "Visit original portfolio", href: "https://codyjiang.com/" },
        { label: "Email Cody", href: "mailto:cody.jiang@nyu.edu" }
      ]
    },
    contact: {
      title: "Get in Touch",
      eyebrow: "STUDY / CONTACT",
      summary: "Have a question about a project, research, or working together? Send me a note.",
      sections: [
        {
          heading: "Email",
          body: "cody.jiang@nyu.edu"
        },
        {
          heading: "Elsewhere",
          body: "The original portfolio collects my existing work. My itch.io page is the place to explore more of my game projects."
        }
      ],
      links: [
        { label: "Email Cody", href: "mailto:cody.jiang@nyu.edu" },
        { label: "Visit original portfolio", href: "https://codyjiang.com/" },
        { label: "Visit my itch.io page", href: "https://cody-jiang.itch.io/" }
      ]
    }
  }
};
