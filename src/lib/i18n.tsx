import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Lang = "en" | "de" | "fr" | "it" | "es" | "zh" | "ja";

export const LANGUAGES: { code: Lang; label: string; native: string }[] = [
  { code: "en", label: "English", native: "English" },
  { code: "de", label: "German", native: "Deutsch" },
  { code: "fr", label: "French", native: "Français" },
  { code: "it", label: "Italian", native: "Italiano" },
  { code: "es", label: "Spanish", native: "Español" },
  { code: "zh", label: "Chinese", native: "中文" },
  { code: "ja", label: "Japanese", native: "日本語" },
];

type Dict = Record<string, string>;

const dictionaries: Record<Exclude<Lang, "en">, Dict> = {
  de: {
    // Nav
    "Overview": "Übersicht",
    "Jobs Applied": "Bewerbungen",
    "Suggested Jobs": "Empfohlene Jobs",
    "Mock Interviews": "Übungsinterviews",
    "Certifications": "Zertifizierungen",
    "Messages": "Nachrichten",
    "Settings": "Einstellungen",
    // Page titles
    "Career overview": "Karriereübersicht",
    "Jobs applied": "Beworbene Jobs",
    "Suggested for you": "Für dich empfohlen",
    "Mock interviews": "Übungsinterviews",
    "Recruiter messages": "Recruiter-Nachrichten",
    "Connect apps": "Apps verbinden",
    "Profile center": "Profilzentrum",
    "CareerHub PRO": "CareerHub PRO",
    // Topbar / misc
    "Your intelligent career workspace": "Dein intelligenter Karriere-Arbeitsbereich",
    "Upgrade": "Upgraden",
    "Notifications": "Benachrichtigungen",
    "3 new": "3 neu",
    "plan": "Plan",
    // Eyebrows
    "APPLICATION PIPELINE": "BEWERBUNGS-PIPELINE",
    "AI MATCHING": "KI-MATCHING",
    "PRACTICE STUDIO": "ÜBUNGSSTUDIO",
    "LEARNING PATHS": "LERNPFADE",
    "RECRUITER NETWORK": "RECRUITER-NETZWERK",
    "CONNECTED ECOSYSTEM": "VERBUNDENES ÖKOSYSTEM",
    "PROFILE CENTER": "PROFILZENTRUM",
    "CAREERHUB PRO": "CAREERHUB PRO",
    "PREFERENCES": "EINSTELLUNGEN",
    // Titles
    "Every application, in sync.": "Jede Bewerbung, synchronisiert.",
    "Roles worth your attention.": "Rollen, die deine Aufmerksamkeit verdienen.",
    "Interview with confidence.": "Selbstbewusst ins Interview.",
    "Certifications that move careers.": "Zertifizierungen, die Karrieren bewegen.",
    "Conversations that matter.": "Gespräche, die zählen.",
    "Your career, connected.": "Deine Karriere, vernetzt.",
    "Your professional story.": "Deine berufliche Geschichte.",
    "Move faster. Stand out sooner.": "Schneller voran. Früher auffallen.",
    "Make CareerHub yours.": "Mach CareerHub zu deinem.",
    // Subtitles
    "Search, filter, and follow every opportunity through your pipeline.":
      "Suche, filtere und verfolge jede Gelegenheit in deiner Pipeline.",
    "Recommendations shaped by your skills, experience, and application history.":
      "Empfehlungen basierend auf deinen Fähigkeiten, Erfahrungen und Bewerbungen.",
    "Targeted mock sessions designed around your role.":
      "Gezielte Übungssitzungen, abgestimmt auf deine Rolle.",
    "Choose a role, pick a time, and sharpen your story.":
      "Wähle eine Rolle, eine Zeit und schärfe deine Geschichte.",
    "Personalized learning matched to your next role.":
      "Personalisiertes Lernen für deine nächste Rolle.",
    "Personalized to your skills and growing interests.":
      "Personalisiert auf deine Fähigkeiten und Interessen.",
    "Connect directly with teams interested in your work.":
      "Verbinde dich direkt mit interessierten Teams.",
    "Curated recruiter outreach, all in one calm inbox.":
      "Kuratierte Recruiter-Kontakte in einer ruhigen Inbox.",
    "Bring your job boards and coding profiles into one intelligent view.":
      "Vereine deine Jobbörsen und Coding-Profile in einer Ansicht.",
    "Keep your candidate identity polished, complete, and ready to share.":
      "Halte dein Profil gepflegt, vollständig und teilbar.",
    "One plan for the tools, intelligence, and access that accelerate your search.":
      "Ein Plan für alle Tools, Intelligenz und Zugriffe für deine Suche.",
    "A calm, Apple-style space for your experience settings.":
      "Ein ruhiger, Apple-inspirierter Bereich für deine Einstellungen.",
    // Greetings + dashboard
    "Good morning": "Guten Morgen",
    "Good afternoon": "Guten Tag",
    "Good evening": "Guten Abend",
    "Every focused step brings your next opportunity closer.":
      "Jeder fokussierte Schritt bringt dich deiner nächsten Chance näher.",
    "Language": "Sprache",
  },
  fr: {
    "Overview": "Aperçu",
    "Jobs Applied": "Candidatures",
    "Suggested Jobs": "Offres suggérées",
    "Mock Interviews": "Entretiens simulés",
    "Certifications": "Certifications",
    "Messages": "Messages",
    "Settings": "Paramètres",
    "Career overview": "Aperçu de carrière",
    "Jobs applied": "Candidatures envoyées",
    "Suggested for you": "Suggéré pour vous",
    "Mock interviews": "Entretiens simulés",
    "Recruiter messages": "Messages des recruteurs",
    "Connect apps": "Connecter des apps",
    "Profile center": "Centre de profil",
    "CareerHub PRO": "CareerHub PRO",
    "Your intelligent career workspace": "Votre espace de carrière intelligent",
    "Upgrade": "Améliorer",
    "Notifications": "Notifications",
    "3 new": "3 nouveaux",
    "plan": "plan",
    "APPLICATION PIPELINE": "PIPELINE DE CANDIDATURES",
    "AI MATCHING": "MATCHING IA",
    "PRACTICE STUDIO": "STUDIO D'ENTRAÎNEMENT",
    "LEARNING PATHS": "PARCOURS D'APPRENTISSAGE",
    "RECRUITER NETWORK": "RÉSEAU DE RECRUTEURS",
    "CONNECTED ECOSYSTEM": "ÉCOSYSTÈME CONNECTÉ",
    "PROFILE CENTER": "CENTRE DE PROFIL",
    "CAREERHUB PRO": "CAREERHUB PRO",
    "PREFERENCES": "PRÉFÉRENCES",
    "Every application, in sync.": "Chaque candidature, synchronisée.",
    "Roles worth your attention.": "Des rôles qui méritent votre attention.",
    "Interview with confidence.": "Passez l'entretien en confiance.",
    "Certifications that move careers.": "Des certifications qui font avancer les carrières.",
    "Conversations that matter.": "Des conversations qui comptent.",
    "Your career, connected.": "Votre carrière, connectée.",
    "Your professional story.": "Votre histoire professionnelle.",
    "Move faster. Stand out sooner.": "Avancez plus vite. Démarquez-vous plus tôt.",
    "Make CareerHub yours.": "Faites de CareerHub le vôtre.",
    "Search, filter, and follow every opportunity through your pipeline.":
      "Cherchez, filtrez et suivez chaque opportunité dans votre pipeline.",
    "Recommendations shaped by your skills, experience, and application history.":
      "Recommandations basées sur vos compétences, expériences et candidatures.",
    "Targeted mock sessions designed around your role.":
      "Sessions d'entraînement ciblées selon votre rôle.",
    "Choose a role, pick a time, and sharpen your story.":
      "Choisissez un rôle, une heure et affinez votre récit.",
    "Personalized learning matched to your next role.":
      "Apprentissage personnalisé pour votre prochain rôle.",
    "Personalized to your skills and growing interests.":
      "Personnalisé selon vos compétences et intérêts.",
    "Connect directly with teams interested in your work.":
      "Connectez-vous directement aux équipes intéressées.",
    "Curated recruiter outreach, all in one calm inbox.":
      "Prise de contact organisée dans une boîte de réception sereine.",
    "Bring your job boards and coding profiles into one intelligent view.":
      "Réunissez vos plateformes d'emploi et profils dans une vue unique.",
    "Keep your candidate identity polished, complete, and ready to share.":
      "Gardez votre profil soigné, complet et prêt à partager.",
    "One plan for the tools, intelligence, and access that accelerate your search.":
      "Un seul plan pour tous les outils qui accélèrent votre recherche.",
    "A calm, Apple-style space for your experience settings.":
      "Un espace calme, façon Apple, pour vos préférences.",
    "Good morning": "Bonjour",
    "Good afternoon": "Bon après-midi",
    "Good evening": "Bonsoir",
    "Every focused step brings your next opportunity closer.":
      "Chaque pas concentré rapproche votre prochaine opportunité.",
    "Language": "Langue",
  },
  it: {
    "Overview": "Panoramica",
    "Jobs Applied": "Candidature",
    "Suggested Jobs": "Lavori suggeriti",
    "Mock Interviews": "Colloqui di prova",
    "Certifications": "Certificazioni",
    "Messages": "Messaggi",
    "Settings": "Impostazioni",
    "Career overview": "Panoramica della carriera",
    "Jobs applied": "Candidature inviate",
    "Suggested for you": "Suggeriti per te",
    "Mock interviews": "Colloqui di prova",
    "Recruiter messages": "Messaggi dei recruiter",
    "Connect apps": "Collega app",
    "Profile center": "Centro profilo",
    "CareerHub PRO": "CareerHub PRO",
    "Your intelligent career workspace": "Il tuo spazio di carriera intelligente",
    "Upgrade": "Aggiorna",
    "Notifications": "Notifiche",
    "3 new": "3 nuovi",
    "plan": "piano",
    "APPLICATION PIPELINE": "PIPELINE CANDIDATURE",
    "AI MATCHING": "MATCHING IA",
    "PRACTICE STUDIO": "STUDIO DI PRATICA",
    "LEARNING PATHS": "PERCORSI DI APPRENDIMENTO",
    "RECRUITER NETWORK": "RETE DI RECRUITER",
    "CONNECTED ECOSYSTEM": "ECOSISTEMA CONNESSO",
    "PROFILE CENTER": "CENTRO PROFILO",
    "CAREERHUB PRO": "CAREERHUB PRO",
    "PREFERENCES": "PREFERENZE",
    "Every application, in sync.": "Ogni candidatura, sincronizzata.",
    "Roles worth your attention.": "Ruoli che meritano la tua attenzione.",
    "Interview with confidence.": "Affronta il colloquio con sicurezza.",
    "Certifications that move careers.": "Certificazioni che fanno crescere le carriere.",
    "Conversations that matter.": "Conversazioni che contano.",
    "Your career, connected.": "La tua carriera, connessa.",
    "Your professional story.": "La tua storia professionale.",
    "Move faster. Stand out sooner.": "Più veloce. Distinguiti prima.",
    "Make CareerHub yours.": "Rendi CareerHub tuo.",
    "Search, filter, and follow every opportunity through your pipeline.":
      "Cerca, filtra e segui ogni opportunità nella tua pipeline.",
    "Recommendations shaped by your skills, experience, and application history.":
      "Consigli basati su competenze, esperienza e candidature.",
    "Targeted mock sessions designed around your role.":
      "Sessioni mirate pensate per il tuo ruolo.",
    "Choose a role, pick a time, and sharpen your story.":
      "Scegli un ruolo, un orario e perfeziona la tua storia.",
    "Personalized learning matched to your next role.":
      "Apprendimento personalizzato per il tuo prossimo ruolo.",
    "Personalized to your skills and growing interests.":
      "Personalizzato sui tuoi interessi e competenze.",
    "Connect directly with teams interested in your work.":
      "Connettiti direttamente con i team interessati.",
    "Curated recruiter outreach, all in one calm inbox.":
      "Contatti dei recruiter curati in un'unica casella tranquilla.",
    "Bring your job boards and coding profiles into one intelligent view.":
      "Unisci bacheche di lavoro e profili in un'unica vista.",
    "Keep your candidate identity polished, complete, and ready to share.":
      "Mantieni il tuo profilo curato, completo e pronto da condividere.",
    "One plan for the tools, intelligence, and access that accelerate your search.":
      "Un solo piano per tutti gli strumenti che accelerano la tua ricerca.",
    "A calm, Apple-style space for your experience settings.":
      "Uno spazio sereno, in stile Apple, per le tue preferenze.",
    "Good morning": "Buongiorno",
    "Good afternoon": "Buon pomeriggio",
    "Good evening": "Buonasera",
    "Every focused step brings your next opportunity closer.":
      "Ogni passo concentrato avvicina la tua prossima opportunità.",
    "Language": "Lingua",
  },
  es: {
    "Overview": "Resumen",
    "Jobs Applied": "Solicitudes",
    "Suggested Jobs": "Empleos sugeridos",
    "Mock Interviews": "Entrevistas de práctica",
    "Certifications": "Certificaciones",
    "Messages": "Mensajes",
    "Settings": "Ajustes",
    "Career overview": "Resumen de carrera",
    "Jobs applied": "Empleos solicitados",
    "Suggested for you": "Sugerido para ti",
    "Mock interviews": "Entrevistas de práctica",
    "Recruiter messages": "Mensajes de reclutadores",
    "Connect apps": "Conectar apps",
    "Profile center": "Centro de perfil",
    "CareerHub PRO": "CareerHub PRO",
    "Your intelligent career workspace": "Tu espacio inteligente de carrera",
    "Upgrade": "Mejorar",
    "Notifications": "Notificaciones",
    "3 new": "3 nuevos",
    "plan": "plan",
    "APPLICATION PIPELINE": "FLUJO DE SOLICITUDES",
    "AI MATCHING": "EMPAREJAMIENTO IA",
    "PRACTICE STUDIO": "ESTUDIO DE PRÁCTICA",
    "LEARNING PATHS": "RUTAS DE APRENDIZAJE",
    "RECRUITER NETWORK": "RED DE RECLUTADORES",
    "CONNECTED ECOSYSTEM": "ECOSISTEMA CONECTADO",
    "PROFILE CENTER": "CENTRO DE PERFIL",
    "CAREERHUB PRO": "CAREERHUB PRO",
    "PREFERENCES": "PREFERENCIAS",
    "Every application, in sync.": "Cada solicitud, sincronizada.",
    "Roles worth your attention.": "Roles que merecen tu atención.",
    "Interview with confidence.": "Entrevista con confianza.",
    "Certifications that move careers.": "Certificaciones que impulsan carreras.",
    "Conversations that matter.": "Conversaciones que importan.",
    "Your career, connected.": "Tu carrera, conectada.",
    "Your professional story.": "Tu historia profesional.",
    "Move faster. Stand out sooner.": "Avanza más rápido. Destaca antes.",
    "Make CareerHub yours.": "Haz tuyo CareerHub.",
    "Search, filter, and follow every opportunity through your pipeline.":
      "Busca, filtra y sigue cada oportunidad en tu flujo.",
    "Recommendations shaped by your skills, experience, and application history.":
      "Recomendaciones basadas en tus habilidades, experiencia y solicitudes.",
    "Targeted mock sessions designed around your role.":
      "Sesiones específicas diseñadas para tu rol.",
    "Choose a role, pick a time, and sharpen your story.":
      "Elige un rol, una hora y afina tu historia.",
    "Personalized learning matched to your next role.":
      "Aprendizaje personalizado para tu próximo rol.",
    "Personalized to your skills and growing interests.":
      "Personalizado a tus habilidades e intereses.",
    "Connect directly with teams interested in your work.":
      "Conecta directamente con equipos interesados.",
    "Curated recruiter outreach, all in one calm inbox.":
      "Contacto de reclutadores curado en una bandeja tranquila.",
    "Bring your job boards and coding profiles into one intelligent view.":
      "Unifica tus portales de empleo y perfiles en una sola vista.",
    "Keep your candidate identity polished, complete, and ready to share.":
      "Mantén tu perfil pulido, completo y listo para compartir.",
    "One plan for the tools, intelligence, and access that accelerate your search.":
      "Un plan para todas las herramientas que aceleran tu búsqueda.",
    "A calm, Apple-style space for your experience settings.":
      "Un espacio sereno, estilo Apple, para tus ajustes.",
    "Good morning": "Buenos días",
    "Good afternoon": "Buenas tardes",
    "Good evening": "Buenas noches",
    "Every focused step brings your next opportunity closer.":
      "Cada paso enfocado acerca tu próxima oportunidad.",
    "Language": "Idioma",
  },
  zh: {
    "Overview": "总览",
    "Jobs Applied": "已申请职位",
    "Suggested Jobs": "推荐职位",
    "Mock Interviews": "模拟面试",
    "Certifications": "认证",
    "Messages": "消息",
    "Settings": "设置",
    "Career overview": "职业总览",
    "Jobs applied": "已申请的职位",
    "Suggested for you": "为你推荐",
    "Mock interviews": "模拟面试",
    "Recruiter messages": "招聘者消息",
    "Connect apps": "连接应用",
    "Profile center": "个人中心",
    "CareerHub PRO": "CareerHub PRO",
    "Your intelligent career workspace": "你的智能职业工作空间",
    "Upgrade": "升级",
    "Notifications": "通知",
    "3 new": "3 条新",
    "plan": "套餐",
    "APPLICATION PIPELINE": "申请流程",
    "AI MATCHING": "AI 匹配",
    "PRACTICE STUDIO": "练习工作室",
    "LEARNING PATHS": "学习路径",
    "RECRUITER NETWORK": "招聘者网络",
    "CONNECTED ECOSYSTEM": "互联生态",
    "PROFILE CENTER": "个人中心",
    "CAREERHUB PRO": "CAREERHUB PRO",
    "PREFERENCES": "偏好设置",
    "Every application, in sync.": "每份申请，实时同步。",
    "Roles worth your attention.": "值得关注的职位。",
    "Interview with confidence.": "自信面对每场面试。",
    "Certifications that move careers.": "推动职业发展的认证。",
    "Conversations that matter.": "重要的对话。",
    "Your career, connected.": "你的职业，紧密相连。",
    "Your professional story.": "你的职业故事。",
    "Move faster. Stand out sooner.": "更快前进，更早脱颖而出。",
    "Make CareerHub yours.": "让 CareerHub 成为你的。",
    "Search, filter, and follow every opportunity through your pipeline.":
      "搜索、筛选并跟进流程中的每一个机会。",
    "Recommendations shaped by your skills, experience, and application history.":
      "根据你的技能、经验和申请历史定制的推荐。",
    "Targeted mock sessions designed around your role.": "围绕你的职位设计的针对性模拟。",
    "Choose a role, pick a time, and sharpen your story.": "选择职位、时间，打磨你的故事。",
    "Personalized learning matched to your next role.": "为你的下一份工作量身定制的学习。",
    "Personalized to your skills and growing interests.": "根据你的技能和兴趣个性化定制。",
    "Connect directly with teams interested in your work.": "直接联系对你感兴趣的团队。",
    "Curated recruiter outreach, all in one calm inbox.": "精选的招聘者联系，集中于一个安静收件箱。",
    "Bring your job boards and coding profiles into one intelligent view.":
      "将招聘网站和编码档案整合到一个智能视图中。",
    "Keep your candidate identity polished, complete, and ready to share.":
      "保持你的候选人形象精致、完整、随时可分享。",
    "One plan for the tools, intelligence, and access that accelerate your search.":
      "一个套餐，涵盖加速求职的全部工具与权限。",
    "A calm, Apple-style space for your experience settings.": "安静的 Apple 风格设置空间。",
    "Good morning": "早上好",
    "Good afternoon": "下午好",
    "Good evening": "晚上好",
    "Every focused step brings your next opportunity closer.": "每一个专注的步伐都让下一个机会更近。",
    "Language": "语言",
  },
  ja: {
    "Overview": "概要",
    "Jobs Applied": "応募済み",
    "Suggested Jobs": "おすすめの求人",
    "Mock Interviews": "模擬面接",
    "Certifications": "認定",
    "Messages": "メッセージ",
    "Settings": "設定",
    "Career overview": "キャリア概要",
    "Jobs applied": "応募した求人",
    "Suggested for you": "あなたへのおすすめ",
    "Mock interviews": "模擬面接",
    "Recruiter messages": "リクルーターからのメッセージ",
    "Connect apps": "アプリを連携",
    "Profile center": "プロフィールセンター",
    "CareerHub PRO": "CareerHub PRO",
    "Your intelligent career workspace": "あなたのインテリジェントなキャリアワークスペース",
    "Upgrade": "アップグレード",
    "Notifications": "通知",
    "3 new": "新着 3 件",
    "plan": "プラン",
    "APPLICATION PIPELINE": "応募パイプライン",
    "AI MATCHING": "AI マッチング",
    "PRACTICE STUDIO": "練習スタジオ",
    "LEARNING PATHS": "学習パス",
    "RECRUITER NETWORK": "リクルーターネットワーク",
    "CONNECTED ECOSYSTEM": "コネクテッドエコシステム",
    "PROFILE CENTER": "プロフィールセンター",
    "CAREERHUB PRO": "CAREERHUB PRO",
    "PREFERENCES": "環境設定",
    "Every application, in sync.": "すべての応募を同期。",
    "Roles worth your attention.": "注目すべきロール。",
    "Interview with confidence.": "自信を持って面接へ。",
    "Certifications that move careers.": "キャリアを動かす認定資格。",
    "Conversations that matter.": "意味のある会話を。",
    "Your career, connected.": "あなたのキャリアをつなぐ。",
    "Your professional story.": "あなたのプロフェッショナルストーリー。",
    "Move faster. Stand out sooner.": "より速く、より早く際立つ。",
    "Make CareerHub yours.": "CareerHub をあなた仕様に。",
    "Search, filter, and follow every opportunity through your pipeline.":
      "パイプライン内のすべての機会を検索・絞り込み・追跡。",
    "Recommendations shaped by your skills, experience, and application history.":
      "スキル・経験・応募履歴に基づく推薦。",
    "Targeted mock sessions designed around your role.":
      "あなたのロールに合わせた集中模擬セッション。",
    "Choose a role, pick a time, and sharpen your story.":
      "ロールと時間を選び、ストーリーを磨こう。",
    "Personalized learning matched to your next role.":
      "次のロールに合わせたパーソナライズ学習。",
    "Personalized to your skills and growing interests.":
      "あなたのスキルと興味に合わせて。",
    "Connect directly with teams interested in your work.":
      "興味を持ったチームと直接つながる。",
    "Curated recruiter outreach, all in one calm inbox.":
      "厳選されたリクルーター連絡を一つの静かな受信箱に。",
    "Bring your job boards and coding profiles into one intelligent view.":
      "求人サイトとコーディングプロフィールを一つのビューに。",
    "Keep your candidate identity polished, complete, and ready to share.":
      "プロフィールを洗練・完全・共有可能に。",
    "One plan for the tools, intelligence, and access that accelerate your search.":
      "求職を加速するすべてを一つのプランで。",
    "A calm, Apple-style space for your experience settings.":
      "Apple 風の落ち着いた設定スペース。",
    "Good morning": "おはようございます",
    "Good afternoon": "こんにちは",
    "Good evening": "こんばんは",
    "Every focused step brings your next opportunity closer.":
      "集中した一歩一歩が次の機会を引き寄せる。",
    "Language": "言語",
  },
};

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (key: string) => string };
const LangContext = createContext<Ctx | null>(null);

const STORAGE_KEY = "careerhub_lang";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Lang | null;
    if (saved && (saved === "en" || saved in dictionaries)) setLangState(saved);
  }, []);

  const value = useMemo<Ctx>(() => {
    const dict = lang === "en" ? null : dictionaries[lang];
    return {
      lang,
      setLang: (l) => {
        setLangState(l);
        try {
          localStorage.setItem(STORAGE_KEY, l);
        } catch {}
        if (typeof document !== "undefined") document.documentElement.lang = l;
      },
      t: (key) => (dict && dict[key]) || key,
    };
  }, [lang]);

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useT() {
  const ctx = useContext(LangContext);
  if (!ctx) return { lang: "en" as Lang, setLang: () => {}, t: (k: string) => k };
  return ctx;
}