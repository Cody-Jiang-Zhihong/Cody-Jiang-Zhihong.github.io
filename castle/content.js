// Content preserved from the existing portfolio and approved castle prototype.
// Pending media and facts must be supplied by Cody; do not invent results.
export const content = {
  "rooms": {
    "great-hall": {
      "title": "The Gallery",
      "kicker": "01 / SELECTED WORK",
      "subtitle": "A collection of things I build.",
      "description": "Start with a project. Explore gameplay AI, machine learning, and software built around data.",
      "entries": [
        "abyssalpact",
        "jepa",
        "steam",
        "options",
        "airline",
        "web"
      ]
    },
    "observatory": {
      "title": "The Observatory",
      "kicker": "02 / RESEARCH",
      "subtitle": "Questions worth looking into.",
      "description": "Machine learning, world models, and the questions that follow when AI becomes part of software development.",
      "entries": [
        "jepa",
        "debt"
      ]
    },
    "workshop": {
      "title": "The Workshop",
      "kicker": "03 / MAKING",
      "subtitle": "Code, paint, and small worlds.",
      "description": "A place for games, miniature painting, and the work that happens away from a finished project page.",
      "entries": [
        "games",
        "craft",
        "jiji"
      ]
    },
    "study": {
      "title": "The Study",
      "kicker": "04 / ABOUT & CV",
      "subtitle": "The person behind the projects.",
      "description": "Meet Cody, read the CV, or get in touch. There is always a direct route to the essentials.",
      "entries": [
        "about",
        "cv",
        "experience",
        "contact",
        "album"
      ]
    }
  },
  "details": {
    "abyssalpact": {
      "title": "Gameplay AI for AbyssalPact",
      "eyebrow": "SELECTED WORK / GAME AI",
      "summary": "Enemy AI for a turn-based card game built with a Unity, C#, and XLua hybrid runtime.",
      "sections": [
        {
          "heading": "The system",
          "body": "My work covers the enemy AI architecture and its runtime behavior. Extensible AI tags and metadata provide a foundation for different enemy behaviors."
        },
        {
          "heading": "What I built",
          "body": "I built the enemy-turn execution pipeline, including scoring, target selection, summon placement, and fallback handling, with runtime parameters and debugging safeguards."
        }
      ],
      "links": [
        {
          "label": "Explore my games on itch.io",
          "href": "https://cody-jiang.itch.io/"
        }
      ],
      "media": [
        {
          "type": "pending",
          "label": "Gameplay recording and actual AI/debugging screenshots to be added."
        }
      ],
      "missing": [
        "Demo / release link",
        "Approved source-code link",
        "Current role, dates, and team attribution"
      ]
    },
    "jepa": {
      "title": "JEPA World Model",
      "eyebrow": "RESEARCH / NYU COURSE PROJECT",
      "summary": "An end-to-end implementation and training workflow for future latent-state prediction, developed for the NYU Deep Learning course, September–December 2024.",
      "sections": [
        {
          "heading": "Approach",
          "body": "The recurrent variant combines image sequences with action inputs to predict future latent states. The work spans model implementation and the training workflow."
        },
        {
          "heading": "Training & evaluation",
          "body": "The workflow uses VICReg/BYOL-style regularization constraints and probe-based evaluation to examine the learned representations. This is a course project."
        }
      ],
      "links": [],
      "media": [
        {
          "type": "pending",
          "label": "Model diagram, prediction video, and evaluation plots to be added."
        }
      ],
      "missing": [
        "Course report / poster",
        "Approved code repository",
        "Experiment settings and verified results"
      ]
    },
    "steam": {
      "title": "Steam Review Radar",
      "eyebrow": "SELECTED WORK / DATA & SOFTWARE",
      "summary": "Platform behavior and signal-quality analysis, built around Steam reviews and a large-scale data pipeline.",
      "sections": [
        {
          "heading": "The system",
          "body": "A large-scale pipeline brings Steam review data into a workflow for examining platform behavior and the quality of review signals."
        },
        {
          "heading": "Approach",
          "body": "The analysis uses Negative Binomial modeling and XGBoost, connecting statistical methods and machine learning with the data pipeline."
        }
      ],
      "links": [],
      "media": [
        {
          "type": "pending",
          "label": "Actual dashboard screenshots and data visualizations to be added."
        }
      ],
      "missing": [
        "Demo and code links",
        "Dataset scope, personal contribution, and verified findings"
      ]
    },
    "debt": {
      "title": "AI-Generated Code & Technical Debt",
      "eyebrow": "RESEARCH / SOFTWARE ENGINEERING",
      "summary": "A system for analyzing technical debt in AI-generated code, combining code analysis with a practical data-processing workflow.",
      "sections": [
        {
          "heading": "The system",
          "body": "The AI-Generated Code Technical Debt Analysis System brings static analysis and visualization together to examine technical debt in generated software."
        },
        {
          "heading": "Approach",
          "body": "The project uses Python and Dask for processing, with Git and Docker in the workflow. Static analysis provides material for inspection and visualization."
        }
      ],
      "links": [],
      "media": [
        {
          "type": "pending",
          "label": "Actual analysis dashboard or report screenshots to be added."
        }
      ],
      "missing": [
        "Demo and code links",
        "Study method, personal contribution, and verified findings"
      ]
    },
    "games": {
      "title": "Games & Playable Experiments",
      "eyebrow": "WORKSHOP / GAME DEVELOPMENT",
      "summary": "Game projects you can open and explore, alongside my gameplay AI work.",
      "sections": [
        {
          "heading": "Try a build",
          "body": "Open Project 150 or a Contra-like arcade game with 1P / 2P modes. The original browser builds remain available at their existing addresses. These older games are best played with a desktop keyboard."
        },
        {
          "heading": "More games",
          "body": "My itch.io page is another entrance to this part of my work. AbyssalPact also has its own exhibit in the Gallery."
        },
        {
          "heading": "Starting these archived builds",
          "body": "Project 150: click the game and hold Space briefly to begin. The Contra-like game: click the game, press 1 or 2 to select a player mode, then hold Space briefly. These GameMaker builds read keyboard input on game frames."
        }
      ],
      "links": [
        {
          "label": "Play Project 150",
          "href": "/myGame/PROJECT_150/index.html",
          "kind": "Demo"
        },
        {
          "label": "Play Contra-like arcade game (1P / 2P)",
          "href": "/myGame/Codys_Final_Proj/index.html",
          "kind": "Demo"
        },
        {
          "label": "Visit my itch.io page",
          "href": "https://cody-jiang.itch.io/",
          "kind": "Portfolio"
        },
        {
          "label": "Arcade mechanics study · Build 0",
          "kind": "Demo",
          "href": "/myGame/Prototype_0/index.html"
        },
        {
          "label": "Arcade mechanics study · Build 1",
          "kind": "Demo",
          "href": "/myGame/Prototype_1/index.html"
        },
        {
          "label": "Arcade mechanics study · Build 2",
          "kind": "Demo",
          "href": "/myGame/Prototype_2/index.html"
        },
        {
          "label": "Arcade mechanics study · Build 3",
          "kind": "Demo",
          "href": "/myGame/Prototype_3/index.html"
        },
        {
          "label": "Arcade mechanics study · Build 4",
          "kind": "Demo",
          "href": "/myGame/Prototype_4/index.html"
        },
        {
          "label": "Arcade mechanics study · Build 6",
          "kind": "Demo",
          "href": "/myGame/Prototype_6/index.html"
        },
        {
          "label": "Knightfall rulebook",
          "kind": "PDF",
          "href": "/myGame/Knightfall_RuleBook.pdf"
        },
        {
          "label": "New Oregon Trail · 2023 edition",
          "kind": "PDF",
          "href": "/myGame/New Oregon Trail 2023 Summer Edition.pdf"
        }
      ],
      "media": [
        {
          "type": "image",
          "src": "/castle/media/project-150.webp",
          "alt": "Actual Project 150 browser build, captured locally.",
          "caption": "Project 150 · actual browser build"
        },
        {
          "type": "image",
          "src": "/castle/media/arcade.webp",
          "alt": "Actual Contra-like arcade browser build, captured locally.",
          "caption": "Contra-like arcade · actual browser build"
        },
        {
          "type": "video",
          "src": "/castle/media/arcade-demo.webm",
          "poster": "/castle/media/arcade.webp",
          "caption": "Silent, unedited recording of the original Contra-like browser build: title menu and the opening single-player platform scene."
        }
      ],
      "missing": [
        "Original source repositories",
        "Complete keyboard controls guide"
      ]
    },
    "craft": {
      "title": "The Miniature Bench",
      "eyebrow": "WORKSHOP / PAINTING & KITBASHING",
      "summary": "Small worlds made by hand: miniature painting, kitbashing, and the details that make a model feel personal.",
      "sections": [
        {
          "heading": "On the bench",
          "body": "Warhammer miniatures are part of my creative life, from painting Ultramarines to modifying models and building terrain."
        },
        {
          "heading": "The collection",
          "body": "This space is intended for finished pieces, close-up details, and work in progress, with room to show how each model takes shape."
        },
        {
          "heading": "About the imagery",
          "body": "The castle and its rooms are concept illustrations, not project screenshots. Scene artwork is illustrative; the finished gallery will use photographs of my own miniatures."
        }
      ],
      "links": [],
      "media": [
        {
          "type": "pending",
          "label": "Photographs of Cody’s own miniatures: finished pieces, details, and work in progress."
        }
      ],
      "missing": [
        "Original model photographs",
        "Model names, dates, materials, and process notes"
      ]
    },
    "jiji": {
      "title": "Meet JiJi",
      "eyebrow": "WORKSHOP / STUDIO COMPANION",
      "summary": "JiJi is my black shorthair cat and studio companion.",
      "sections": [
        {
          "heading": "A personal corner",
          "body": "There is room in the castle for the life around the projects, too. This small corner belongs to JiJi."
        },
        {
          "heading": "Back to the workshop",
          "body": "The game projects and miniature bench are just a few steps away."
        }
      ],
      "links": [],
      "media": [
        {
          "type": "pending",
          "label": "An actual photograph of JiJi to be added. The illustrated cat is concept art."
        }
      ]
    },
    "cv": {
      "title": "Curriculum Vitae",
      "eyebrow": "STUDY / BACKGROUND & EXPERIENCE",
      "summary": "A direct route to my academic and professional background.",
      "sections": [
        {
          "heading": "February 2026 edition",
          "body": "This link opens the February 2026 edition of the CV hosted on my existing website."
        },
        {
          "heading": "Areas of focus",
          "body": "My background brings together computer science study at NYU and project work in ML systems, gameplay AI, and software engineering."
        }
      ],
      "links": [
        {
          "label": "Curriculum vitae · February 2026",
          "href": "/myResume/ZhihongJiang_CurriculumVitae_Feb2026.pdf",
          "kind": "PDF"
        },
        {
          "label": "Basic CV · February 2026",
          "href": "/myResume/[Basic]ZhihongJiang_CurriculumVitae_Feb2026.pdf",
          "kind": "PDF"
        },
        {
          "label": "Systems resume · February 2026",
          "href": "/myResume/[SDE]ZhihongJiang_résumé_Feb2026.pdf",
          "kind": "PDF"
        },
        {
          "label": "Data resume · February 2026",
          "href": "/myResume/[DS]ZhihongJiang_résumé_Feb2026.pdf",
          "kind": "PDF"
        },
        {
          "label": "ML resume · February 2026",
          "href": "/myResume/[MLE]ZhihongJiang_résumé_Feb2026.pdf",
          "kind": "PDF"
        },
        {
          "label": "Background & experience",
          "href": "/read.html#experience"
        }
      ],
      "missing": [
        "A newer CV and current SDE / DS / MLE resumes, if available"
      ]
    },
    "about": {
      "title": "Cody Jiang",
      "eyebrow": "STUDY / ABOUT",
      "summary": "Zhihong Jiang / 姜知泓. I work on ML systems, gameplay AI, and software people can use.",
      "sections": [
        {
          "heading": "Background",
          "body": "My existing portfolio lists an NYU M.S. in Computer Science (expected December 2026), following an NYU B.S. in Computer Science with minors in Applied Mathematics and Game Design (2021–2024). Current education and employment details are awaiting an update."
        },
        {
          "heading": "Away from the screen",
          "body": "I paint and kitbash miniatures, build small worlds, and share my space with JiJi, my black shorthair cat."
        },
        {
          "heading": "Why a castle?",
          "body": "Each room gives a different part of my work a place of its own. You can explore slowly, or head straight to a project, the CV, or my contact details."
        }
      ],
      "links": [
        {
          "label": "Read the concise portfolio",
          "href": "/read.html#about"
        },
        {
          "label": "Email Cody",
          "href": "mailto:cody.jiang@nyu.edu"
        }
      ],
      "media": [
        {
          "type": "image",
          "src": "/castle/media/portrait.webp",
          "alt": "Portrait of Cody Jiang from the existing portfolio.",
          "caption": "From the existing portfolio",
          "fullSrc": "/MyPhotos/tx1.jpg"
        }
      ]
    },
    "contact": {
      "title": "Get in Touch",
      "eyebrow": "STUDY / CONTACT",
      "summary": "Have a question about a project, research, or working together? Send me a note.",
      "sections": [
        {
          "heading": "Email",
          "body": "cody.jiang@nyu.edu"
        },
        {
          "heading": "Elsewhere",
          "body": "The concise portfolio collects my background and archived project links. My itch.io page is another entrance to my game projects."
        }
      ],
      "links": [
        {
          "label": "Email Cody",
          "href": "mailto:cody.jiang@nyu.edu"
        },
        {
          "label": "Game portfolio on itch.io",
          "href": "https://cody-jiang.itch.io/"
        },
        {
          "label": "Concise portfolio",
          "href": "/read.html#contact"
        }
      ]
    },
    "options": {
      "title": "NVIDIA Options Market Pipeline",
      "eyebrow": "GALLERY / DATA ENGINEERING",
      "summary": "An options-market pipeline and visualization project listed in the existing portfolio.",
      "sections": [
        {
          "heading": "Tools",
          "body": "Python, Pandas, D3.js, and ETL. Dataset dates, current availability, and project outcomes have not yet been supplied."
        }
      ],
      "links": [],
      "media": [
        {
          "type": "pending",
          "label": "Actual pipeline diagram and visualization screenshots to be added."
        }
      ],
      "missing": [
        "Demo and code links",
        "Dataset dates, personal contribution, and verified results"
      ]
    },
    "airline": {
      "title": "Airline Ticket Booking System",
      "eyebrow": "GALLERY / DATABASE & BACKEND",
      "summary": "A Flask and SQL coursework project for airline ticket reservations, with customer and airline-staff workflows.",
      "sections": [
        {
          "heading": "Explore the source",
          "body": "The original Flask application, SQL schema, seed data, and test scenarios remain in this repository. GitHub Pages cannot run the Python server. The archived template is available for inspection; it is not a working booking service."
        }
      ],
      "links": [
        {
          "label": "Flask application and SQL",
          "kind": "Code",
          "href": "https://github.com/Cody-Jiang-Zhihong/Cody-Jiang-Zhihong.github.io/tree/main/Air-Ticket-Reservation-System"
        },
        {
          "label": "Archived HTML template · static only",
          "href": "/Air-Ticket-Reservation-System/templates/index.html"
        }
      ],
      "media": [
        {
          "type": "pending",
          "label": "Running Flask application screenshots to be supplied. The static template is not presented as a live demo."
        }
      ]
    },
    "web": {
      "title": "Web & Interactive Studies",
      "eyebrow": "GALLERY / COURSEWORK ARCHIVE",
      "summary": "Web experiments and response sites from the original portfolio. The original addresses remain available.",
      "sections": [
        {
          "heading": "An archive of small experiments",
          "body": "Front-end coursework includes visual essays, CSS illustration, generative sketches, and interactive storytelling."
        }
      ],
      "links": [
        {
          "label": "Future Recording Technology response",
          "href": "/webDev_C_Fall2022/week2/week2.html",
          "kind": "Demo"
        },
        {
          "label": "Ways of Seeing response",
          "href": "/webDev_C_Fall2022/week4/week4.html",
          "kind": "Demo"
        },
        {
          "label": "Interactive hypertext story",
          "href": "/webDev_C_Fall2022/week5/week5.html",
          "kind": "Demo"
        },
        {
          "label": "Camera or Weapon photo essay",
          "href": "/webDev_C_Fall2022/week7/Codys week7.html",
          "kind": "Demo"
        },
        {
          "label": "CSS coffee cup",
          "href": "/webDev_C_Fall2022/week8/week8.html",
          "kind": "Demo"
        },
        {
          "label": "Net.Art / BIGDOLL presentation",
          "href": "/webDev_C_Fall2022/week10/index.html",
          "kind": "Demo"
        },
        {
          "label": "p5.js generative sketch",
          "href": "/webDev_C_Fall2022/week11/index.html",
          "kind": "Demo"
        },
        {
          "label": "Checkbox experiment",
          "href": "/webDev_C_Fall2022/week12/index.html",
          "kind": "Demo"
        },
        {
          "label": "The Medium Is the Massage",
          "href": "/webDev_C_Fall2022/TheMediumIsTheMassage/index.html",
          "kind": "Demo"
        },
        {
          "label": "Pokemon World web game",
          "href": "/webDev_C_Fall2022/PKM/index.html",
          "kind": "Demo"
        },
        {
          "label": "Coursework source files",
          "kind": "Code",
          "href": "https://github.com/Cody-Jiang-Zhihong/Cody-Jiang-Zhihong.github.io/tree/main/webDev_C_Fall2022"
        }
      ],
      "media": [
        {
          "type": "image",
          "src": "/castle/media/coffee.webp",
          "alt": "The original CSS coffee cup rendered in a browser.",
          "caption": "CSS coffee cup · actual coursework page"
        }
      ]
    },
    "experience": {
      "title": "Background & Experience",
      "eyebrow": "STUDY / ARCHIVE",
      "summary": "Experience preserved from the existing portfolio. Current roles, dates, attribution, and results should be reviewed against an updated CV.",
      "sections": [
        {
          "heading": "Gameplay / AI Systems Developer · AbyssalPact",
          "body": "Listed from April 2025 in the previous portfolio. Enemy-turn execution, scoring, target selection, summon placement, fallback handling, extensible AI tags, and runtime debugging in Unity, C#, and XLua. Current status awaits confirmation."
        },
        {
          "heading": "NYU Deep Learning course · September–December 2024",
          "body": "JEPA sequential prediction course project: recurrent image/action modeling, training workflow, representation regularization, and probe-based evaluation."
        },
        {
          "heading": "AI-powered interview simulation · October 2023–March 2024",
          "body": "Engineering work on NLP and audio/video analysis for structured interview feedback, using Python, PyTorch, Transformers, Torchaudio, and SpaCy. Collaborator attribution awaits confirmation."
        },
        {
          "heading": "Software Engineering Intern · June–August 2023",
          "body": "Anhui Yuntai Transportation Development Limited. Mobile operations workflows and a C++ reporting module for bus routes, revenue, trip duration, and passenger flow."
        },
        {
          "heading": "CNN application in cancer diagnosis · June–August 2021",
          "body": "The previous portfolio describes model training, inference integration, UI, and NLP support. Institutional attribution, publication details, and numerical results are awaiting supporting materials and are not asserted here."
        }
      ],
      "links": [
        {
          "label": "February 2026 CV",
          "href": "/myResume/ZhihongJiang_CurriculumVitae_Feb2026.pdf",
          "kind": "PDF"
        },
        {
          "label": "Preserved previous portfolio · historical claims",
          "href": "/legacy/index.html#experience"
        }
      ]
    },
    "album": {
      "title": "Off the Resume",
      "eyebrow": "STUDY / PHOTO ALBUM",
      "summary": "A few photographs preserved from the existing portfolio.",
      "sections": [],
      "links": [],
      "media": [
        {
          "type": "image",
          "src": "/castle/media/gdc.webp",
          "alt": "GDC photograph",
          "caption": "From the existing portfolio · GDC photograph",
          "fullSrc": "/MyPhotos/GDC1.JPG"
        },
        {
          "type": "image",
          "src": "/castle/media/graduation.webp",
          "alt": "Graduation photograph",
          "caption": "From the existing portfolio · Graduation photograph",
          "fullSrc": "/MyPhotos/grad1.jpg"
        },
        {
          "type": "image",
          "src": "/castle/media/life-1.webp",
          "alt": "Life photograph 1",
          "caption": "From the existing portfolio · Life photograph 1",
          "fullSrc": "/MyPhotos/life1.jpg"
        },
        {
          "type": "image",
          "src": "/castle/media/life-2.webp",
          "alt": "Life photograph 2",
          "caption": "From the existing portfolio · Life photograph 2",
          "fullSrc": "/MyPhotos/life2.jpg"
        }
      ]
    }
  }
};
