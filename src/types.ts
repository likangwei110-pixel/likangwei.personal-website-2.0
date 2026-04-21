export type Language = 'CN' | 'EN' | 'DE';

export interface Internship {
  company: string;
  role: string;
  period: string;
  task: string;
  action: string[];
  impact: string;
}

export interface Translation {
  hero: {
    greeting: string;
    name: string;
    subLabel: string;
    cta: string;
    questionsLabel: string;
    questions: string[];
    tags: string[];
    searchPlaceholder: string;
  };
  navigation: {
    home: string;
    experience: string;
    skills: string;
    hobbies: string;
    contact: string;
  };
  skills: {
    title: string;
    competitive: string;
    market: string;
    aigc: string;
    crossCultural: string;
  };
  experience: {
    title: string;
    items: Internship[];
  };
  hobbies: {
    title: string;
    photography: string;
    photographyDesc: string;
    cinema: string;
    cinemaDesc: string;
  };
  contact: {
    title: string;
    email: string;
    phone: string;
    links: string;
  };
}

export const translations: Record<Language, Translation> = {
  CN: {
    hero: {
      greeting: "你好，我是",
      name: "李康炜",
      subLabel: "作为一名拥有德语背景的产品经理候选人，我致力于利用 AI 工具 (AIGC) 优化产品体验。我曾在字节跳动、奥迪中国等公司实习，擅长从数据中挖掘增长机会。让我们聊聊。",
      cta: "联系我",
      questionsLabel: "你想问我什么问题？",
      questions: [
        "你对产品设计的整体思路是什么？",
        "你通常如何开始一个新项目？",
        "在团队中你通常扮演什么角色？",
        "你如何平衡用户需求与业务目标？"
      ],
      tags: ["产品管理", "AIGC 应用", "德语/英语", "竞品分析", "用户调研", "交互设计", "数据分析", "跨文化协作"],
      searchPlaceholder: "咨询、写作或搜索任何关于我的内容..."
    },
    navigation: {
      home: "首页",
      experience: "实习经历",
      skills: "核心技能",
      hobbies: "兴趣爱好",
      contact: "联系方式"
    },
    skills: {
      title: "核心能力",
      competitive: "竞品分析",
      market: "市场研究",
      aigc: "AIGC 应用 (Gemini, Cursor, Claude)",
      crossCultural: "跨文化沟通"
    },
    experience: {
      title: "实习经历",
      items: [
        {
          company: "TikTok (字节跳动)",
          role: "德语热门内容运营",
          period: "2026 至今",
          task: "2026 米兰冬奥会运营",
          action: [
            "通过数据分析识别用户意图（运动员 59%，赛事 25%）",
            "构建用于新闻抓取的 AI Agents"
          ],
          impact: "热门内容识别效率提升 30%"
        },
        {
          company: "奥迪中国",
          role: "PMO 实习生",
          period: "2025 - 2026",
          task: "项目工作流标准化",
          action: [
            "为全球团队建立版本控制和异步协作机制"
          ],
          impact: "文档流转效率提升 30%"
        },
        {
          company: "FastMoss",
          role: "德国市场运营 (产品增长)",
          period: "2025",
          task: "德国市场扩张",
          action: [
            "UI 本地化及广告文案 A/B 测试"
          ],
          impact: "广告点击率 (CTR) 提升 15%"
        }
      ]
    },
    hobbies: {
      title: "兴趣人格",
      photography: "摄影画廊",
      photographyDesc: "极简主义海洋与建筑画廊",
      cinema: "电影评论",
      cinemaDesc: "电影作品年表 (基于 AI 工具构建)"
    },
    contact: {
      title: "建立连接",
      email: "电子邮箱",
      phone: "联系电话",
      links: "社交媒体"
    }
  },
  EN: {
    hero: {
      greeting: "Hi, I'm",
      name: "Kangwei Li",
      subLabel: "As an AI-driven Product Manager candidate with a background in German, I have spent my internships at ByteDance and Audi China bridging the gap between user needs and technical implementation. I thrive on clarity and digital efficiency. Let's talk.",
      cta: "Let's talk",
      questionsLabel: "Want to ask me a question?",
      questions: [
        "What's your overall approach to product management?",
        "How do you typically start a new project?",
        "What role do you usually play on a team?",
        "How do you balance user needs with business goals?"
      ],
      tags: ["Product Management", "AI Workflows", "DE / EN / CN", "Competitive Analysis", "User Research", "Interaction Design", "Data Analysis", "Cross-cultural Collaboration"],
      searchPlaceholder: "Ask, write or search for anything..."
    },
    navigation: {
      home: "Home",
      experience: "Experience",
      skills: "Skills",
      hobbies: "Hobbies",
      contact: "Connect"
    },
    skills: {
      title: "Core Skills",
      competitive: "Competitive Analysis",
      market: "Market Research",
      aigc: "AIGC (Gemini, Cursor, Claude)",
      crossCultural: "Cross-cultural Communication"
    },
    experience: {
      title: "Experience",
      items: [
        {
          company: "TikTok (ByteDance)",
          role: "Hot Content Ops (DE)",
          period: "2026 - Present",
          task: "2026 Milan Winter Olympics Ops",
          action: [
            "Identified intent (Athlete 59%, Event 25%) through data analysis",
            "Built AI Agents for news scraping"
          ],
          impact: "30% efficiency boost in hot content identification"
        },
        {
          company: "Audi China",
          role: "PMO Intern",
          period: "2025 - 2026",
          task: "Project workflow standardization",
          action: [
            "Established version control and asynchronous collaboration for global teams"
          ],
          impact: "30% increase in document flow efficiency"
        },
        {
          company: "FastMoss",
          role: "DE Ops (Product Growth)",
          period: "2025",
          task: "German market expansion",
          action: [
            "UI localization and A/B testing for ad copy"
          ],
          impact: "15% increase in CTR"
        }
      ]
    },
    hobbies: {
      title: "Curated Content",
      photography: "Photography",
      photographyDesc: "Minimalist ocean and architecture gallery",
      cinema: "Cinema",
      cinemaDesc: "Filmography Timeline (Built with AI tools)"
    },
    contact: {
      title: "Connect",
      email: "Email",
      phone: "Phone",
      links: "Links"
    }
  },
  DE: {
    hero: {
      greeting: "Hallo, ich bin",
      name: "Kangwei Li",
      subLabel: "Als KI-orientierter Produktmanager-Kandidat mit Hintergrund in Germanistik habe ich meine Praktika bei ByteDance und Audi China genutzt, um digitale Prozesse zu optimieren. Ich begeistere mich für klare Strukturen und effiziente Workflows. Kontaktieren Sie mich.",
      cta: "Melden Sie sich",
      questionsLabel: "Möchten Sie mir eine Frage stellen?",
      questions: [
        "Wie ist Ihr Ansatz für das Produktmanagement?",
        "Wie starten Sie normalerweise ein neues Projekt?",
        "Welche Rolle spielen Sie normalerweise in einem Team?",
        "Wie bringen Sie Nutzerbedürfnisse mit Geschäftszielen in Einklang?"
      ],
      tags: ["Produktmanagement", "KI-Workflows", "DE / EN / CN", "Wettbewerbsanalyse", "Nutzerforschung", "Interaktionsdesign", "Datenanalyse", "Interkulturelle Kollaboration"],
      searchPlaceholder: "Fragen, schreiben oder suchen Sie nach allem..."
    },
    navigation: {
      home: "Startseite",
      experience: "Erfahrung",
      skills: "Fähigkeiten",
      hobbies: "Hobbys",
      contact: "Kontakt"
    },
    skills: {
      title: "Kernkompetenzen",
      competitive: "Wettbewerbsanalyse",
      market: "Marktforschung",
      aigc: "AIGC (Gemini, Cursor, Claude)",
      crossCultural: "Interkulturelle Kommunikation"
    },
    experience: {
      title: "Berufserfahrung",
      items: [
        {
          company: "TikTok (ByteDance)",
          role: "Hot Content Ops (DE)",
          period: "2026 - Heute",
          task: "2026 Mailänder Winterolympiade Ops",
          action: [
            "Identifizierte Intentionen (Athlet 59%, Event 25%) durch Datenanalyse",
            "Entwickelte KI-Agenten für News-Scraping"
          ],
          impact: "30% Effizienzsteigerung bei der Identifizierung heißer Inhalte"
        },
        {
          company: "Audi China",
          role: "PMO Praktikant",
          period: "2025 - 2026",
          task: "Standardisierung des Projektworkflows",
          action: [
            "Einführung von Versionskontrolle und asynchroner Zusammenarbeit für globale Teams"
          ],
          impact: "30% Steigerung der Effizienz im Dokumentenfluss"
        },
        {
          company: "FastMoss",
          role: "DE Ops (Product Growth)",
          period: "2025",
          task: "Expansion auf dem deutschen Markt",
          action: [
            "UI-Lokalisierung und A/B-Tests für Werbetexte"
          ],
          impact: "15% Steigerung der CTR"
        }
      ]
    },
    hobbies: {
      title: "Persönlichkeit",
      photography: "Fotografie",
      photographyDesc: "Minimalistische Meeres- und Architektur-Galerie",
      cinema: "Kino",
      cinemaDesc: "Filmografie Zeitstrahl (Mit KI-Tools erstellt)"
    },
    contact: {
      title: "Kontakt",
      email: "E-Mail",
      phone: "Telefon",
      links: "Links"
    }
  }
};
