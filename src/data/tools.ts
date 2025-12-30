export interface Tool {
  id: string;
  name: string;
  url: string;
  description: string;
  category: string;
  icon: string;
}

export const categories = [
  { id: "email-marketing", name: "Email Marketing", icon: "Mail", color: "from-blue-500 to-cyan-500" },
  { id: "ai-writing", name: "Escritura con IA", icon: "PenTool", color: "from-purple-500 to-pink-500" },
  { id: "seo-analytics", name: "SEO y Análisis", icon: "BarChart3", color: "from-emerald-500 to-teal-500" },
  { id: "productivity", name: "Productividad", icon: "Zap", color: "from-orange-500 to-amber-500" },
  { id: "content", name: "Contenido y Texto", icon: "FileText", color: "from-rose-500 to-red-500" },
  { id: "research", name: "Investigación", icon: "Search", color: "from-indigo-500 to-violet-500" },
  { id: "design", name: "Diseño e Imagen", icon: "Image", color: "from-pink-500 to-fuchsia-500" },
  { id: "leads", name: "Generación de Leads", icon: "Users", color: "from-sky-500 to-blue-500" },
];

export const tools: Tool[] = [
  // Email Marketing
  {
    id: "litmus",
    name: "Litmus",
    url: "https://www.litmus.com/",
    description: "Plataforma para probar y optimizar campañas de email en múltiples clientes de correo",
    category: "email-marketing",
    icon: "Mail",
  },
  {
    id: "debounce",
    name: "Debounce",
    url: "https://debounce.io/",
    description: "Verificación de emails para eliminar direcciones inválidas de tus listas",
    category: "email-marketing",
    icon: "CheckCircle",
  },
  {
    id: "folderly",
    name: "Folderly",
    url: "https://folderly.com/",
    description: "Mejora la entregabilidad de emails y evita que lleguen a spam",
    category: "email-marketing",
    icon: "Inbox",
  },
  {
    id: "usebouncer",
    name: "Bouncer",
    url: "https://app.usebouncer.com/",
    description: "Validación de emails en tiempo real para limpiar listas de contactos",
    category: "email-marketing",
    icon: "Shield",
  },
  {
    id: "verifyemail",
    name: "Verify Email Address",
    url: "https://www.verifyemailaddress.org/",
    description: "Herramienta gratuita para verificar si una dirección de email existe",
    category: "email-marketing",
    icon: "CheckSquare",
  },
  {
    id: "reply",
    name: "Reply.io",
    url: "https://reply.io/",
    description: "Automatización de outreach de ventas con secuencias de email personalizadas",
    category: "email-marketing",
    icon: "Send",
  },
  {
    id: "zerobounce",
    name: "ZeroBounce",
    url: "https://www.zerobounce.net/",
    description: "Validación de emails con detección de trampas de spam y emails temporales",
    category: "email-marketing",
    icon: "Target",
  },
  {
    id: "mailtester",
    name: "Mail Tester",
    url: "https://www.mail-tester.com/",
    description: "Analiza tu email para verificar la puntuación de spam antes de enviar",
    category: "email-marketing",
    icon: "TestTube",
  },
  {
    id: "mailmeteor",
    name: "Mailmeteor",
    url: "https://mailmeteor.com/",
    description: "Envío de emails masivos personalizados desde Gmail",
    category: "email-marketing",
    icon: "Rocket",
  },

  // AI Writing
  {
    id: "rytr",
    name: "Rytr",
    url: "https://rytr.me/",
    description: "Asistente de escritura con IA para crear contenido de alta calidad rápidamente",
    category: "ai-writing",
    icon: "Edit3",
  },
  {
    id: "hix",
    name: "HIX AI",
    url: "https://hix.ai/",
    description: "Suite completa de herramientas de escritura potenciadas por IA",
    category: "ai-writing",
    icon: "Sparkles",
  },
  {
    id: "simplified",
    name: "Simplified",
    url: "https://simplified.com/",
    description: "Plataforma todo-en-uno para crear contenido con IA, diseño y gestión de redes",
    category: "ai-writing",
    icon: "Wand2",
  },
  {
    id: "hypotenuse",
    name: "Hypotenuse AI",
    url: "https://www.hypotenuse.ai/",
    description: "Generación de contenido con IA especializada en e-commerce y marketing",
    category: "ai-writing",
    icon: "ShoppingBag",
  },
  {
    id: "aithor",
    name: "Aithor",
    url: "https://aithor.com/",
    description: "Escritor de ensayos con IA para contenido académico y profesional",
    category: "ai-writing",
    icon: "GraduationCap",
  },
  {
    id: "copyai",
    name: "Copy.ai",
    url: "https://www.copy.ai/",
    description: "Generador de copy de marketing con IA para anuncios, emails y redes sociales",
    category: "ai-writing",
    icon: "Copy",
  },

  // Content & Text
  {
    id: "paraphraser",
    name: "Paraphraser.io",
    url: "https://www.paraphraser.io/",
    description: "Reescribe textos manteniendo el significado original con diferentes tonos",
    category: "content",
    icon: "RefreshCw",
  },
  {
    id: "tldrthis",
    name: "TLDR This",
    url: "https://www.tldrthis.com/",
    description: "Resume artículos largos en puntos clave de manera automática",
    category: "content",
    icon: "FileSearch",
  },
  {
    id: "spintax",
    name: "Spintax Generator",
    url: "https://serptext.com/spintax/",
    description: "Crea variaciones de texto con formato spintax para contenido único",
    category: "content",
    icon: "Shuffle",
  },
  {
    id: "hemingway",
    name: "Hemingway App",
    url: "https://hemingwayapp.com/",
    description: "Editor que mejora la claridad y legibilidad de tu escritura",
    category: "content",
    icon: "Type",
  },
  {
    id: "wordcounter",
    name: "Word Counter",
    url: "https://wordcounter.net/",
    description: "Cuenta palabras, caracteres y analiza la densidad de keywords",
    category: "content",
    icon: "Hash",
  },
  {
    id: "speechnotes",
    name: "Speechnotes",
    url: "https://speechnotes.co/",
    description: "Convierte voz a texto en tiempo real con reconocimiento de voz",
    category: "content",
    icon: "Mic",
  },
  {
    id: "signnow",
    name: "SignNow",
    url: "https://www.signnow.com/",
    description: "Firma documentos electrónicamente de forma legal y segura",
    category: "content",
    icon: "PenLine",
  },
  {
    id: "viralpost",
    name: "Viral Post Generator",
    url: "https://viralpostgenerator.com/",
    description: "Genera posts virales para LinkedIn con IA",
    category: "content",
    icon: "TrendingUp",
  },

  // SEO & Analytics
  {
    id: "builtwith",
    name: "BuiltWith",
    url: "https://builtwith.com/",
    description: "Descubre qué tecnologías usan los sitios web de tu competencia",
    category: "seo-analytics",
    icon: "Layers",
  },
  {
    id: "mxtoolbox",
    name: "MXToolbox",
    url: "https://mxtoolbox.com/",
    description: "Herramientas de diagnóstico de DNS, email y blacklist",
    category: "seo-analytics",
    icon: "Server",
  },
  {
    id: "ahrefs-keywords",
    name: "Ahrefs Keyword Generator",
    url: "https://ahrefs.com/keyword-generator",
    description: "Genera ideas de keywords gratuitas para SEO y contenido",
    category: "seo-analytics",
    icon: "Key",
  },

  // Research
  {
    id: "perplexity",
    name: "Perplexity AI",
    url: "https://www.perplexity.ai/",
    description: "Motor de búsqueda con IA que proporciona respuestas directas con fuentes",
    category: "research",
    icon: "Brain",
  },
  {
    id: "wand",
    name: "Wand AI",
    url: "https://wand.ai/",
    description: "Asistente de investigación con IA para análisis de datos y reportes",
    category: "research",
    icon: "Wand",
  },

  // Design & Image
  {
    id: "pfpmaker",
    name: "PFP Maker",
    url: "https://pfpmaker.com/",
    description: "Crea fotos de perfil profesionales eliminando el fondo automáticamente",
    category: "design",
    icon: "User",
  },

  // Lead Generation
  {
    id: "prospectss",
    name: "Prospectss",
    url: "https://prospectss.com/",
    description: "Suite de herramientas de growth hacking para generar leads B2B",
    category: "leads",
    icon: "UserPlus",
  },
  {
    id: "predictleads",
    name: "PredictLeads",
    url: "https://predictleads.com/",
    description: "Inteligencia de ventas predictiva para identificar leads cualificados",
    category: "leads",
    icon: "LineChart",
  },
];
