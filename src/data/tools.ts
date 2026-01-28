export type Need = "prospecting" | "automation" | "analytics" | "content";
export type Level = "beginner" | "junior" | "senior";
export type Pricing = "free" | "paid" | "freemium";
export type FunnelStage = "tofu" | "mofu" | "bofu" | "allinone";

export interface Tool {
  id: string;
  name: string;
  description: {
    es: string;
    en: string;
  };
  url: string;
  icon: string;
  categoryId: string;
  needs: Need[];
  levels: Level[];
  pricing: Pricing;
  funnelStage: FunnelStage;
}

export interface Category {
  id: string;
  name: {
    es: string;
    en: string;
  };
  icon: string;
  color: string;
}

export const categories: Category[] = [
  { id: "email-marketing", name: { es: "Email Marketing", en: "Email Marketing" }, icon: "Mail", color: "from-blue-500 to-cyan-500" },
  { id: "email-tools", name: { es: "Herramientas de Email", en: "Email Tools" }, icon: "MailCheck", color: "from-indigo-500 to-purple-500" },
  { id: "ai-writing", name: { es: "Escritura con IA", en: "AI Writing" }, icon: "PenTool", color: "from-violet-500 to-pink-500" },
  { id: "seo-analytics", name: { es: "SEO y Analytics", en: "SEO & Analytics" }, icon: "BarChart3", color: "from-green-500 to-emerald-500" },
  { id: "social-media", name: { es: "Redes Sociales", en: "Social Media" }, icon: "Share2", color: "from-pink-500 to-rose-500" },
  { id: "sales-crm", name: { es: "Ventas y CRM", en: "Sales & CRM" }, icon: "Target", color: "from-orange-500 to-amber-500" },
  { id: "lead-generation", name: { es: "Generación de Leads", en: "Lead Generation" }, icon: "Users", color: "from-teal-500 to-cyan-500" },
  { id: "ai-tools", name: { es: "Herramientas de IA", en: "AI Tools" }, icon: "Sparkles", color: "from-purple-500 to-indigo-500" },
  { id: "design-media", name: { es: "Diseño y Multimedia", en: "Design & Media" }, icon: "Image", color: "from-rose-500 to-orange-500" },
  { id: "webinars-video", name: { es: "Webinars y Video", en: "Webinars & Video" }, icon: "Video", color: "from-red-500 to-pink-500" },
  { id: "integrations", name: { es: "Integraciones", en: "Integrations" }, icon: "Zap", color: "from-amber-500 to-yellow-500" },
  { id: "education", name: { es: "Educación y Cursos", en: "Education & Courses" }, icon: "GraduationCap", color: "from-blue-500 to-indigo-500" },
  { id: "productivity", name: { es: "Productividad", en: "Productivity" }, icon: "Zap", color: "from-yellow-500 to-orange-500" },
];

export const tools: Tool[] = [
  // Email Marketing - TOFU (outreach) & MOFU (nurturing)
  { id: "zerobounce", name: "ZeroBounce", description: { es: "Verificación y validación de emails", en: "Email verification and validation" }, url: "https://www.zerobounce.net/members/signin", icon: "MailCheck", categoryId: "email-marketing", needs: ["prospecting", "automation"], levels: ["beginner", "junior", "senior"], pricing: "freemium", funnelStage: "tofu" },
  { id: "litmus", name: "Litmus", description: { es: "Pruebas y análisis de email marketing", en: "Email marketing testing and analytics" }, url: "https://www.litmus.com/", icon: "Mail", categoryId: "email-marketing", needs: ["analytics", "automation"], levels: ["junior", "senior"], pricing: "paid", funnelStage: "mofu" },
  { id: "mailjet", name: "Mailjet", description: { es: "Plataforma de envío de emails masivos", en: "Mass email sending platform" }, url: "https://www.mailjet.com/", icon: "Send", categoryId: "email-marketing", needs: ["automation", "prospecting"], levels: ["beginner", "junior"], pricing: "freemium", funnelStage: "tofu" },
  { id: "mailmeteor", name: "Mailmeteor", description: { es: "Envío de correos masivos desde Gmail", en: "Mass email sending from Gmail" }, url: "https://mailmeteor.com/es/", icon: "Mail", categoryId: "email-marketing", needs: ["automation", "prospecting"], levels: ["beginner"], pricing: "freemium", funnelStage: "tofu" },
  { id: "brevo", name: "Brevo", description: { es: "Suite completa de email marketing", en: "Complete email marketing suite" }, url: "https://www.brevo.com/es/", icon: "MailOpen", categoryId: "email-marketing", needs: ["automation", "analytics"], levels: ["junior", "senior"], pricing: "freemium", funnelStage: "allinone" },

  // Email Tools - TOFU (verification) & MOFU (deliverability)
  { id: "mailgenius", name: "MailGenius", description: { es: "Análisis y mejora de entregabilidad", en: "Deliverability analysis and improvement" }, url: "https://www.mailgenius.com/", icon: "MailSearch", categoryId: "email-tools", needs: ["analytics"], levels: ["junior", "senior"], pricing: "freemium", funnelStage: "mofu" },
  { id: "mailreach", name: "MailReach", description: { es: "Calentamiento de emails para mejor entrega", en: "Email warmup for better delivery" }, url: "https://www.mailreach.co/", icon: "Flame", categoryId: "email-tools", needs: ["automation"], levels: ["junior", "senior"], pricing: "paid", funnelStage: "mofu" },
  { id: "folderly", name: "Folderly", description: { es: "Mejora la entregabilidad de emails", en: "Improve email deliverability" }, url: "https://folderly.com/", icon: "FolderCheck", categoryId: "email-tools", needs: ["analytics", "automation"], levels: ["senior"], pricing: "paid", funnelStage: "mofu" },
  { id: "lemwarm", name: "Lemwarm", description: { es: "Calentamiento automático de emails", en: "Automatic email warmup" }, url: "https://www.lemwarm.com/", icon: "Thermometer", categoryId: "email-tools", needs: ["automation"], levels: ["junior", "senior"], pricing: "paid", funnelStage: "mofu" },
  { id: "debounce", name: "DeBounce", description: { es: "Limpieza y verificación de listas", en: "List cleaning and verification" }, url: "https://es.debounce.com/", icon: "ListChecks", categoryId: "email-tools", needs: ["prospecting"], levels: ["beginner", "junior"], pricing: "freemium", funnelStage: "tofu" },
  { id: "usebouncer", name: "Bouncer", description: { es: "Verificación de emails en tiempo real", en: "Real-time email verification" }, url: "https://app.usebouncer.com/", icon: "ShieldCheck", categoryId: "email-tools", needs: ["prospecting"], levels: ["beginner", "junior"], pricing: "freemium", funnelStage: "tofu" },
  { id: "verifyemail", name: "Verify Email", description: { es: "Verificador de direcciones de email", en: "Email address verifier" }, url: "https://www.verifyemailaddress.org/", icon: "CheckCircle", categoryId: "email-tools", needs: ["prospecting"], levels: ["beginner"], pricing: "free", funnelStage: "tofu" },
  { id: "mxtoolbox", name: "MXToolbox", description: { es: "Diagnóstico de problemas de email", en: "Email problem diagnostics" }, url: "https://mxtoolbox.com/", icon: "Wrench", categoryId: "email-tools", needs: ["analytics"], levels: ["senior"], pricing: "freemium", funnelStage: "mofu" },
  { id: "emailpermutator", name: "Email Permutator", description: { es: "Genera variaciones de emails", en: "Generate email variations" }, url: "http://metricsparrow.com/toolkit/email-permutator/", icon: "Shuffle", categoryId: "email-tools", needs: ["prospecting"], levels: ["beginner", "junior"], pricing: "free", funnelStage: "tofu" },

  // AI Writing - MOFU (content nurturing)
  { id: "paraphraser", name: "Paraphraser", description: { es: "Reescribe textos con IA", en: "Rewrite texts with AI" }, url: "https://www.paraphraser.io/", icon: "RefreshCw", categoryId: "ai-writing", needs: ["content"], levels: ["beginner", "junior"], pricing: "freemium", funnelStage: "mofu" },
  { id: "copyai", name: "Copy.ai", description: { es: "Generador de contenido con IA", en: "AI content generator" }, url: "https://www.copy.ai/", icon: "FileText", categoryId: "ai-writing", needs: ["content", "automation"], levels: ["beginner", "junior", "senior"], pricing: "freemium", funnelStage: "allinone" },
  { id: "smartwriter", name: "SmartWriter", description: { es: "Emails personalizados con IA", en: "AI personalized emails" }, url: "https://www.smartwriter.ai/", icon: "Lightbulb", categoryId: "ai-writing", needs: ["content", "prospecting"], levels: ["junior", "senior"], pricing: "paid", funnelStage: "tofu" },
  { id: "parafrasear", name: "Parafrasear", description: { es: "Herramienta de parafraseo en español", en: "Spanish paraphrasing tool" }, url: "https://parafrasear.org/", icon: "Languages", categoryId: "ai-writing", needs: ["content"], levels: ["beginner"], pricing: "free", funnelStage: "mofu" },
  { id: "hixai", name: "HIX.AI", description: { es: "Suite completa de escritura con IA", en: "Complete AI writing suite" }, url: "https://hix.ai/es", icon: "Bot", categoryId: "ai-writing", needs: ["content", "automation"], levels: ["junior", "senior"], pricing: "freemium", funnelStage: "allinone" },
  { id: "simplified", name: "Simplified", description: { es: "Contenido y diseño con IA", en: "AI content and design" }, url: "https://app.simplified.com/", icon: "Wand2", categoryId: "ai-writing", needs: ["content"], levels: ["beginner", "junior"], pricing: "freemium", funnelStage: "mofu" },
  { id: "hypotenuse", name: "Hypotenuse AI", description: { es: "Escritor fantasma con IA", en: "AI ghostwriter" }, url: "https://www.hypotenuse.ai/tools/ghostwriter", icon: "Ghost", categoryId: "ai-writing", needs: ["content"], levels: ["junior", "senior"], pricing: "paid", funnelStage: "mofu" },
  { id: "aithor", name: "Aithor", description: { es: "Asistente de escritura académica", en: "Academic writing assistant" }, url: "https://aithor.com/es-es", icon: "GraduationCap", categoryId: "ai-writing", needs: ["content"], levels: ["beginner"], pricing: "freemium", funnelStage: "mofu" },
  { id: "hemingway", name: "Hemingway", description: { es: "Editor para escritura clara", en: "Editor for clear writing" }, url: "https://hemingwayapp.com/", icon: "FileEdit", categoryId: "ai-writing", needs: ["content"], levels: ["beginner", "junior", "senior"], pricing: "freemium", funnelStage: "mofu" },
  { id: "twaingpt", name: "TwainGPT", description: { es: "Mejora tu escritura con IA", en: "Improve your writing with AI" }, url: "https://www.twaingpt.com/", icon: "PenLine", categoryId: "ai-writing", needs: ["content"], levels: ["junior"], pricing: "free", funnelStage: "mofu" },
  { id: "tldrthis", name: "TLDR This", description: { es: "Resúmenes automáticos de textos", en: "Automatic text summaries" }, url: "https://www.tldrthis.com/", icon: "FileDown", categoryId: "ai-writing", needs: ["content", "analytics"], levels: ["beginner", "junior"], pricing: "freemium", funnelStage: "mofu" },
  { id: "articlespinner", name: "Article Spinner", description: { es: "Reescritura automática de artículos", en: "Automatic article rewriting" }, url: "https://free-article-spinner.com/", icon: "RotateCw", categoryId: "ai-writing", needs: ["content"], levels: ["beginner"], pricing: "free", funnelStage: "mofu" },
  { id: "gptzero", name: "GPTZero", description: { es: "Detector de contenido de IA", en: "AI content detector" }, url: "https://gptzero.me/", icon: "ScanSearch", categoryId: "ai-writing", needs: ["analytics"], levels: ["junior", "senior"], pricing: "freemium", funnelStage: "mofu" },
  { id: "speechnotes", name: "Speechnotes", description: { es: "Dictado por voz a texto", en: "Voice to text dictation" }, url: "https://speechnotes.co/", icon: "Mic", categoryId: "ai-writing", needs: ["content"], levels: ["beginner"], pricing: "free", funnelStage: "mofu" },
  { id: "contadorpalabras", name: "Contador de Palabras", description: { es: "Cuenta palabras y caracteres", en: "Word and character counter" }, url: "https://www.contadordepalabras.com/", icon: "Hash", categoryId: "ai-writing", needs: ["content"], levels: ["beginner"], pricing: "free", funnelStage: "mofu" },

  // SEO & Analytics - TOFU (discovery) & MOFU (analysis)
  { id: "ahrefs", name: "Ahrefs", description: { es: "Herramienta completa de SEO", en: "Complete SEO tool" }, url: "https://ahrefs.com/", icon: "Search", categoryId: "seo-analytics", needs: ["analytics"], levels: ["junior", "senior"], pricing: "paid", funnelStage: "allinone" },
  { id: "semrush", name: "Semrush", description: { es: "Suite de marketing digital y SEO", en: "Digital marketing and SEO suite" }, url: "https://www.semrush.com/", icon: "TrendingUp", categoryId: "seo-analytics", needs: ["analytics", "content"], levels: ["junior", "senior"], pricing: "freemium", funnelStage: "allinone" },
  { id: "sistrix", name: "Sistrix", description: { es: "Análisis de visibilidad SEO", en: "SEO visibility analysis" }, url: "https://www.sistrix.es/", icon: "Eye", categoryId: "seo-analytics", needs: ["analytics"], levels: ["senior"], pricing: "paid", funnelStage: "tofu" },
  { id: "similarweb", name: "SimilarWeb", description: { es: "Análisis de tráfico web", en: "Web traffic analysis" }, url: "https://lp.similarweb.com/", icon: "Globe", categoryId: "seo-analytics", needs: ["analytics", "prospecting"], levels: ["junior", "senior"], pricing: "freemium", funnelStage: "tofu" },
  { id: "builtwith", name: "BuiltWith", description: { es: "Detecta tecnologías de sitios web", en: "Detect website technologies" }, url: "https://builtwith.com/", icon: "Layers", categoryId: "seo-analytics", needs: ["analytics", "prospecting"], levels: ["junior", "senior"], pricing: "freemium", funnelStage: "tofu" },
  { id: "wappalyzer", name: "Wappalyzer", description: { es: "Identifica tecnologías web", en: "Identify web technologies" }, url: "https://www.wappalyzer.com/", icon: "Code", categoryId: "seo-analytics", needs: ["analytics", "prospecting"], levels: ["beginner", "junior"], pricing: "freemium", funnelStage: "tofu" },
  { id: "smallseotools", name: "Small SEO Tools", description: { es: "Colección de herramientas SEO gratuitas", en: "Collection of free SEO tools" }, url: "https://smallseotools.com/", icon: "Wrench", categoryId: "seo-analytics", needs: ["analytics", "content"], levels: ["beginner"], pricing: "free", funnelStage: "tofu" },
  { id: "serptext", name: "SerpText", description: { es: "Análisis de SERPs y competencia", en: "SERP and competition analysis" }, url: "https://serptext.com/", icon: "FileSearch", categoryId: "seo-analytics", needs: ["analytics"], levels: ["junior", "senior"], pricing: "freemium", funnelStage: "tofu" },

  // Social Media - TOFU (awareness) & MOFU (engagement)
  { id: "taplio", name: "Taplio", description: { es: "Crecimiento en LinkedIn con IA", en: "LinkedIn growth with AI" }, url: "https://taplio.com/", icon: "Linkedin", categoryId: "social-media", needs: ["content", "automation"], levels: ["junior", "senior"], pricing: "paid", funnelStage: "tofu" },
  { id: "ritetag", name: "RiteTag", description: { es: "Sugerencias de hashtags en tiempo real", en: "Real-time hashtag suggestions" }, url: "https://ritetag.com/", icon: "Hash", categoryId: "social-media", needs: ["content"], levels: ["beginner", "junior"], pricing: "freemium", funnelStage: "tofu" },
  { id: "allhashtag", name: "All Hashtag", description: { es: "Generador de hashtags", en: "Hashtag generator" }, url: "https://www.all-hashtag.com/", icon: "Hash", categoryId: "social-media", needs: ["content"], levels: ["beginner"], pricing: "free", funnelStage: "tofu" },
  { id: "hashtagsforlikes", name: "Hashtags For Likes", description: { es: "Hashtags para aumentar engagement", en: "Hashtags to increase engagement" }, url: "https://www.hashtagsforlikes.co/", icon: "Heart", categoryId: "social-media", needs: ["content"], levels: ["beginner"], pricing: "freemium", funnelStage: "tofu" },
  { id: "flick", name: "Flick", description: { es: "Gestión de hashtags y analytics", en: "Hashtag management and analytics" }, url: "https://www.flick.social/", icon: "BarChart", categoryId: "social-media", needs: ["analytics", "content"], levels: ["junior", "senior"], pricing: "paid", funnelStage: "mofu" },
  { id: "meetalfred", name: "Meet Alfred", description: { es: "Automatización de LinkedIn", en: "LinkedIn automation" }, url: "https://meetalfred.com/", icon: "Bot", categoryId: "social-media", needs: ["automation", "prospecting"], levels: ["junior", "senior"], pricing: "paid", funnelStage: "tofu" },

  // Sales & CRM - MOFU & BOFU (closing)
  { id: "close", name: "Close CRM", description: { es: "CRM para equipos de ventas", en: "CRM for sales teams" }, url: "https://www.close.com/", icon: "Handshake", categoryId: "sales-crm", needs: ["automation", "analytics"], levels: ["junior", "senior"], pricing: "paid", funnelStage: "bofu" },
  { id: "nocrm", name: "noCRM", description: { es: "CRM simple para cerrar ventas", en: "Simple CRM to close sales" }, url: "https://www.nocrm.io/es", icon: "Target", categoryId: "sales-crm", needs: ["automation"], levels: ["beginner", "junior"], pricing: "freemium", funnelStage: "bofu" },
  { id: "overloop", name: "Overloop", description: { es: "Automatización de ventas outbound", en: "Outbound sales automation" }, url: "https://overloop.com/", icon: "RefreshCcw", categoryId: "sales-crm", needs: ["automation", "prospecting"], levels: ["junior", "senior"], pricing: "paid", funnelStage: "mofu" },
  { id: "outplay", name: "Outplay", description: { es: "Plataforma de engagement de ventas", en: "Sales engagement platform" }, url: "https://outplay.ai/", icon: "PlayCircle", categoryId: "sales-crm", needs: ["automation", "analytics"], levels: ["junior", "senior"], pricing: "paid", funnelStage: "mofu" },
  { id: "outreach", name: "Outreach", description: { es: "Plataforma de ejecución de ventas", en: "Sales execution platform" }, url: "https://www.outreach.io/", icon: "Send", categoryId: "sales-crm", needs: ["automation"], levels: ["senior"], pricing: "paid", funnelStage: "allinone" },
  { id: "gong", name: "Gong", description: { es: "Inteligencia de ingresos y análisis de conversaciones", en: "Revenue intelligence and conversation analytics" }, url: "https://www.gong.io/", icon: "TrendingUp", categoryId: "sales-crm", needs: ["analytics"], levels: ["senior"], pricing: "paid", funnelStage: "bofu" },
  { id: "reply", name: "Reply.io", description: { es: "Automatización de ventas con IA", en: "AI sales automation" }, url: "https://reply.io/", icon: "MessageSquare", categoryId: "sales-crm", needs: ["automation", "prospecting"], levels: ["junior", "senior"], pricing: "freemium", funnelStage: "mofu" },
  { id: "crystalknows", name: "Crystal Knows", description: { es: "Análisis de personalidad para ventas", en: "Personality analysis for sales" }, url: "https://www.crystalknows.com/", icon: "Brain", categoryId: "sales-crm", needs: ["analytics", "prospecting"], levels: ["senior"], pricing: "freemium", funnelStage: "bofu" },
  { id: "salesplaybookbuilder", name: "Sales Playbook Builder", description: { es: "Crea playbooks de ventas con IA", en: "Create sales playbooks with AI" }, url: "https://salesplaybookbuilder.ai/", icon: "BookOpen", categoryId: "sales-crm", needs: ["content", "automation"], levels: ["junior", "senior"], pricing: "freemium", funnelStage: "mofu" },
  { id: "predictablerevenue", name: "Predictable Revenue", description: { es: "Resumen del libro de Aaron Ross", en: "Aaron Ross book summary" }, url: "https://devoradoresdelibros.com/predictable-revenue-aaron-ross/", icon: "Book", categoryId: "sales-crm", needs: ["content"], levels: ["beginner", "junior"], pricing: "free", funnelStage: "mofu" },
  { id: "efficypredictable", name: "Efficy - Predictable Revenue", description: { es: "Guía de Predictable Revenue", en: "Predictable Revenue guide" }, url: "https://www.efficy.com/es/predictable-revenue/", icon: "FileText", categoryId: "sales-crm", needs: ["content"], levels: ["beginner", "junior"], pricing: "free", funnelStage: "mofu" },
  { id: "emailsventas", name: "Emails para Ventas", description: { es: "Ejemplos de emails para ventas en frío", en: "Cold sales email examples" }, url: "https://branch.com.co/marketing-digital/10-ejemplos-de-emails-para-aumentar-ventas-con-clientes-en-frio/", icon: "Mail", categoryId: "sales-crm", needs: ["content", "prospecting"], levels: ["beginner"], pricing: "free", funnelStage: "tofu" },
  { id: "hubspotcrm", name: "HubSpot CRM", description: { es: "CRM gratuito con seguimiento de prospectos", en: "Free CRM with prospect tracking" }, url: "https://www.hubspot.com/products/crm", icon: "Users", categoryId: "sales-crm", needs: ["automation", "analytics", "prospecting"], levels: ["beginner", "junior", "senior"], pricing: "freemium", funnelStage: "allinone" },
  { id: "pipedrive", name: "Pipedrive", description: { es: "CRM visual orientado a ventas", en: "Visual sales-oriented CRM" }, url: "https://www.pipedrive.com/", icon: "PieChart", categoryId: "sales-crm", needs: ["automation", "analytics"], levels: ["beginner", "junior", "senior"], pricing: "freemium", funnelStage: "allinone" },
  { id: "salesloft", name: "SalesLoft", description: { es: "Cadencias de ventas y engagement multicanal", en: "Sales cadences and multichannel engagement" }, url: "https://www.salesloft.com/", icon: "Zap", categoryId: "sales-crm", needs: ["automation", "prospecting"], levels: ["junior", "senior"], pricing: "paid", funnelStage: "mofu" },
  { id: "aircall", name: "Aircall", description: { es: "Sistema telefónico cloud con analytics de llamadas", en: "Cloud phone system with call analytics" }, url: "https://www.aircall.io/", icon: "Phone", categoryId: "sales-crm", needs: ["automation", "analytics"], levels: ["junior", "senior"], pricing: "paid", funnelStage: "bofu" },
  { id: "dialpad", name: "Dialpad", description: { es: "AI para coaching en tiempo real durante llamadas", en: "AI for real-time coaching during calls" }, url: "https://www.dialpad.com/", icon: "Headphones", categoryId: "sales-crm", needs: ["automation", "analytics"], levels: ["junior", "senior"], pricing: "paid", funnelStage: "bofu" },
  { id: "calendly", name: "Calendly", description: { es: "Agenda reuniones sin fricción", en: "Schedule meetings without friction" }, url: "https://calendly.com/", icon: "Calendar", categoryId: "sales-crm", needs: ["automation"], levels: ["beginner", "junior", "senior"], pricing: "freemium", funnelStage: "mofu" },
  { id: "chorus", name: "Chorus.ai", description: { es: "Inteligencia de conversaciones de ventas", en: "Sales conversation intelligence" }, url: "https://www.chorus.ai/", icon: "MessageCircle", categoryId: "sales-crm", needs: ["analytics"], levels: ["senior"], pricing: "paid", funnelStage: "bofu" },

  // Lead Generation - TOFU (lead acquisition)
  { id: "lemlist", name: "Lemlist", description: { es: "Cold email y personalización con IA", en: "Cold email and AI personalization" }, url: "https://lemlist.com/", icon: "Mail", categoryId: "lead-generation", needs: ["automation", "prospecting"], levels: ["junior", "senior"], pricing: "paid", funnelStage: "tofu" },
  { id: "linkedinsales", name: "LinkedIn Sales Navigator", description: { es: "Prospección avanzada en LinkedIn", en: "Advanced LinkedIn prospecting" }, url: "https://www.linkedin.com/sales/", icon: "Linkedin", categoryId: "lead-generation", needs: ["prospecting"], levels: ["junior", "senior"], pricing: "paid", funnelStage: "tofu" },
  { id: "uplead", name: "UpLead", description: { es: "Base de datos de leads B2B", en: "B2B lead database" }, url: "https://www.uplead.com/", icon: "Users", categoryId: "lead-generation", needs: ["prospecting"], levels: ["junior", "senior"], pricing: "freemium", funnelStage: "tofu" },
  { id: "easyleadz", name: "EasyLeadz", description: { es: "Encuentra emails de decisores", en: "Find decision makers' emails" }, url: "https://www.easyleadz.com/", icon: "UserSearch", categoryId: "lead-generation", needs: ["prospecting"], levels: ["beginner", "junior"], pricing: "freemium", funnelStage: "tofu" },
  { id: "voilanorbert", name: "Voila Norbert", description: { es: "Búsqueda de emails corporativos", en: "Corporate email search" }, url: "https://www.voilanorbert.com/", icon: "Search", categoryId: "lead-generation", needs: ["prospecting"], levels: ["beginner", "junior"], pricing: "freemium", funnelStage: "tofu" },
  { id: "clay", name: "Clay", description: { es: "Enriquecimiento de datos de leads", en: "Lead data enrichment" }, url: "https://www.clay.com/", icon: "Database", categoryId: "lead-generation", needs: ["prospecting", "automation"], levels: ["senior"], pricing: "paid", funnelStage: "tofu" },
  { id: "predictleads", name: "PredictLeads", description: { es: "Datos predictivos de empresas", en: "Predictive company data" }, url: "https://predictleads.com/", icon: "LineChart", categoryId: "lead-generation", needs: ["prospecting", "analytics"], levels: ["senior"], pricing: "paid", funnelStage: "tofu" },
  { id: "scrapio", name: "Scrap.io", description: { es: "Extracción de datos de Google Maps", en: "Google Maps data extraction" }, url: "https://scrap.io/", icon: "Map", categoryId: "lead-generation", needs: ["prospecting"], levels: ["junior", "senior"], pricing: "freemium", funnelStage: "tofu" },
  { id: "lusha", name: "Lusha", description: { es: "Datos de contacto B2B", en: "B2B contact data" }, url: "https://www.lusha.com/", icon: "Phone", categoryId: "lead-generation", needs: ["prospecting"], levels: ["beginner", "junior", "senior"], pricing: "freemium", funnelStage: "tofu" },
  { id: "seamless", name: "Seamless.AI", description: { es: "Motor de búsqueda de leads", en: "Lead search engine" }, url: "https://seamless.ai/", icon: "Search", categoryId: "lead-generation", needs: ["prospecting"], levels: ["junior", "senior"], pricing: "freemium", funnelStage: "tofu" },
  { id: "apollo", name: "Apollo.io", description: { es: "Plataforma de inteligencia de ventas", en: "Sales intelligence platform" }, url: "https://www.apollo.io/es", icon: "Rocket", categoryId: "lead-generation", needs: ["prospecting", "automation"], levels: ["beginner", "junior", "senior"], pricing: "freemium", funnelStage: "allinone" },
  { id: "salesintel", name: "SalesIntel", description: { es: "Datos de contacto verificados", en: "Verified contact data" }, url: "https://salesintel.io/", icon: "ShieldCheck", categoryId: "lead-generation", needs: ["prospecting"], levels: ["junior", "senior"], pricing: "paid", funnelStage: "tofu" },
  { id: "zoominfo", name: "ZoomInfo", description: { es: "Base de datos empresarial", en: "Business database" }, url: "https://www.zoominfo.com/", icon: "Building2", categoryId: "lead-generation", needs: ["prospecting", "analytics"], levels: ["senior"], pricing: "paid", funnelStage: "allinone" },
  { id: "hunter", name: "Hunter.io", description: { es: "Encuentra emails de cualquier empresa", en: "Find emails from any company" }, url: "https://hunter.io/", icon: "Target", categoryId: "lead-generation", needs: ["prospecting"], levels: ["beginner", "junior", "senior"], pricing: "freemium", funnelStage: "tofu" },
  { id: "fullenrich", name: "FullEnrich", description: { es: "Enriquecimiento completo de datos", en: "Complete data enrichment" }, url: "https://fullenrich.com/", icon: "DatabaseBackup", categoryId: "lead-generation", needs: ["prospecting"], levels: ["junior", "senior"], pricing: "paid", funnelStage: "tofu" },
  { id: "leadiq", name: "LeadIQ", description: { es: "Captura de datos de prospección", en: "Prospecting data capture" }, url: "https://leadiq.com/", icon: "UserPlus", categoryId: "lead-generation", needs: ["prospecting"], levels: ["junior", "senior"], pricing: "freemium", funnelStage: "tofu" },
  { id: "crunchbase", name: "Crunchbase", description: { es: "Datos de empresas y startups", en: "Company and startup data" }, url: "https://www.crunchbase.com/", icon: "Building", categoryId: "lead-generation", needs: ["prospecting", "analytics"], levels: ["beginner", "junior", "senior"], pricing: "freemium", funnelStage: "tofu" },
  { id: "rocketreach", name: "RocketReach", description: { es: "Encuentra emails y teléfonos", en: "Find emails and phones" }, url: "https://rocketreach.co/", icon: "Rocket", categoryId: "lead-generation", needs: ["prospecting"], levels: ["beginner", "junior"], pricing: "freemium", funnelStage: "tofu" },
  { id: "brightdata", name: "Bright Data", description: { es: "Plataforma de datos web", en: "Web data platform" }, url: "https://brightdata.com/", icon: "Globe", categoryId: "lead-generation", needs: ["prospecting", "automation"], levels: ["senior"], pricing: "paid", funnelStage: "tofu" },
  { id: "prospeo", name: "Prospeo", description: { es: "Encuentra y verifica emails", en: "Find and verify emails" }, url: "https://prospeo.io/", icon: "MailSearch", categoryId: "lead-generation", needs: ["prospecting"], levels: ["beginner", "junior"], pricing: "freemium", funnelStage: "tofu" },
  { id: "findymail", name: "Findymail", description: { es: "Buscador de emails verificados", en: "Verified email finder" }, url: "https://www.findymail.com/", icon: "Search", categoryId: "lead-generation", needs: ["prospecting"], levels: ["junior", "senior"], pricing: "paid", funnelStage: "tofu" },
  { id: "discoverorg", name: "DiscoverOrg", description: { es: "Inteligencia de mercado B2B", en: "B2B market intelligence" }, url: "https://discoverorg.com/", icon: "Compass", categoryId: "lead-generation", needs: ["prospecting", "analytics"], levels: ["senior"], pricing: "paid", funnelStage: "tofu" },
  { id: "epieos", name: "Epieos", description: { es: "OSINT para búsqueda de emails", en: "OSINT for email search" }, url: "https://epieos.com/", icon: "Eye", categoryId: "lead-generation", needs: ["prospecting"], levels: ["junior", "senior"], pricing: "freemium", funnelStage: "tofu" },
  { id: "lagrowthmachine", name: "La Growth Machine", description: { es: "Automatización multicanal de ventas", en: "Multichannel sales automation" }, url: "https://lagrowthmachine.com/es/", icon: "Cog", categoryId: "lead-generation", needs: ["automation", "prospecting"], levels: ["junior", "senior"], pricing: "paid", funnelStage: "mofu" },

  // AI Tools - Various stages
  { id: "perplexity", name: "Perplexity", description: { es: "Motor de búsqueda con IA", en: "AI search engine" }, url: "https://www.perplexity.ai/", icon: "Search", categoryId: "ai-tools", needs: ["analytics", "content"], levels: ["beginner", "junior", "senior"], pricing: "freemium", funnelStage: "tofu" },
  { id: "deliveryman", name: "Deliveryman AI", description: { es: "Asistente de entregas con IA", en: "AI delivery assistant" }, url: "https://deliveryman.ai", icon: "Truck", categoryId: "ai-tools", needs: ["automation"], levels: ["junior", "senior"], pricing: "paid", funnelStage: "bofu" },
  { id: "aicallcenter", name: "AI Call Center", description: { es: "Centro de llamadas con IA", en: "AI call center" }, url: "https://aicallcenter.co/", icon: "Headphones", categoryId: "ai-tools", needs: ["automation"], levels: ["senior"], pricing: "paid", funnelStage: "bofu" },
  { id: "moonback", name: "Moonback", description: { es: "Automatización de feedback con IA", en: "AI feedback automation" }, url: "https://moonback.me/es", icon: "MessageCircle", categoryId: "ai-tools", needs: ["automation", "analytics"], levels: ["junior", "senior"], pricing: "freemium", funnelStage: "mofu" },
  { id: "maestrolabs", name: "Maestro Labs", description: { es: "Herramientas de productividad con IA", en: "AI productivity tools" }, url: "https://www.maestrolabs.com/", icon: "Wand2", categoryId: "ai-tools", needs: ["automation"], levels: ["junior", "senior"], pricing: "paid", funnelStage: "mofu" },
  { id: "wandai", name: "Wand.AI", description: { es: "Automatización empresarial con IA", en: "AI business automation" }, url: "https://wand.ai/", icon: "Sparkles", categoryId: "ai-tools", needs: ["automation"], levels: ["senior"], pricing: "paid", funnelStage: "allinone" },
  { id: "smartlead", name: "SmartLead", description: { es: "Outreach con IA", en: "AI outreach" }, url: "https://www.smartlead.ai/", icon: "Zap", categoryId: "ai-tools", needs: ["automation", "prospecting"], levels: ["junior", "senior"], pricing: "paid", funnelStage: "tofu" },
  { id: "mailmentor", name: "MailMentor", description: { es: "Mejora emails con IA", en: "Improve emails with AI" }, url: "https://www.mailmentor.io/", icon: "GraduationCap", categoryId: "ai-tools", needs: ["content"], levels: ["beginner", "junior"], pricing: "freemium", funnelStage: "mofu" },
  { id: "popai", name: "PopAI", description: { es: "Asistente de IA todo en uno", en: "All-in-one AI assistant" }, url: "https://www.popai.pro/es/", icon: "Bot", categoryId: "ai-tools", needs: ["content", "automation"], levels: ["beginner", "junior", "senior"], pricing: "freemium", funnelStage: "allinone" },
  { id: "genspark", name: "GenSpark", description: { es: "Motor de búsqueda con IA agéntica", en: "Agentic AI search engine" }, url: "https://www.genspark.ai/", icon: "Sparkle", categoryId: "ai-tools", needs: ["analytics"], levels: ["junior", "senior"], pricing: "freemium", funnelStage: "tofu" },
  { id: "toolerbox", name: "Toolerbox", description: { es: "Directorio de herramientas de IA", en: "AI tools directory" }, url: "https://toolerbox.com/", icon: "Package", categoryId: "ai-tools", needs: ["analytics"], levels: ["beginner", "junior", "senior"], pricing: "free", funnelStage: "tofu" },

  // Design & Media - MOFU (content creation)
  { id: "pfpmaker", name: "PFP Maker", description: { es: "Crea fotos de perfil profesionales", en: "Create professional profile pictures" }, url: "https://pfpmaker.com/", icon: "User", categoryId: "design-media", needs: ["content"], levels: ["beginner"], pricing: "free", funnelStage: "mofu" },
  { id: "promeai", name: "PromeAI", description: { es: "Generación de imágenes con IA", en: "AI image generation" }, url: "https://www.promeai.pro/", icon: "Image", categoryId: "design-media", needs: ["content"], levels: ["beginner", "junior"], pricing: "freemium", funnelStage: "mofu" },
  { id: "invideo", name: "InVideo", description: { es: "Creación de videos con IA", en: "AI video creation" }, url: "https://ai.invideo.io/signup", icon: "Video", categoryId: "design-media", needs: ["content"], levels: ["beginner", "junior", "senior"], pricing: "freemium", funnelStage: "mofu" },
  { id: "blinkshot", name: "Blinkshot", description: { es: "Generación de imágenes en tiempo real", en: "Real-time image generation" }, url: "https://www.blinkshot.io/", icon: "Camera", categoryId: "design-media", needs: ["content"], levels: ["beginner", "junior"], pricing: "free", funnelStage: "mofu" },
  { id: "freepik", name: "Freepik", description: { es: "Recursos gráficos y vectores", en: "Graphic resources and vectors" }, url: "https://www.freepik.com/", icon: "Palette", categoryId: "design-media", needs: ["content"], levels: ["beginner", "junior", "senior"], pricing: "freemium", funnelStage: "mofu" },
  { id: "hippovideo", name: "Hippo Video", description: { es: "Plataforma de video para ventas", en: "Video platform for sales" }, url: "https://www.hippovideo.io/", icon: "Play", categoryId: "design-media", needs: ["content", "prospecting"], levels: ["junior", "senior"], pricing: "freemium", funnelStage: "mofu" },
  { id: "decktopus", name: "Decktopus", description: { es: "Presentaciones con IA", en: "AI presentations" }, url: "https://www.decktopus.com/", icon: "Presentation", categoryId: "design-media", needs: ["content"], levels: ["beginner", "junior"], pricing: "freemium", funnelStage: "bofu" },

  // Education - All stages
  { id: "alison", name: "Alison", description: { es: "Cursos gratuitos online", en: "Free online courses" }, url: "https://alison.com/es", icon: "BookOpen", categoryId: "education", needs: ["content"], levels: ["beginner"], pricing: "free", funnelStage: "tofu" },
  { id: "edx", name: "edX", description: { es: "Cursos de universidades top", en: "Courses from top universities" }, url: "https://www.edx.org/", icon: "GraduationCap", categoryId: "education", needs: ["content"], levels: ["beginner", "junior", "senior"], pricing: "freemium", funnelStage: "mofu" },
  { id: "aprendum", name: "Aprendum", description: { es: "Cursos online en español", en: "Online courses in Spanish" }, url: "https://www.aprendum.mx/", icon: "Book", categoryId: "education", needs: ["content"], levels: ["beginner"], pricing: "freemium", funnelStage: "tofu" },
  { id: "cursoseducate", name: "Cursos Educate", description: { es: "Formación online gratuita", en: "Free online training" }, url: "https://cursoseducate.com/", icon: "School", categoryId: "education", needs: ["content"], levels: ["beginner"], pricing: "free", funnelStage: "tofu" },
  { id: "videocursos", name: "Videocursos", description: { es: "Cursos en video", en: "Video courses" }, url: "https://videocursos.co/", icon: "PlayCircle", categoryId: "education", needs: ["content"], levels: ["beginner", "junior"], pricing: "freemium", funnelStage: "mofu" },

  // Productivity - Various stages
  { id: "venturekit", name: "VentureKit", description: { es: "Business plans con IA", en: "AI business plans" }, url: "https://www.venturekit.ai/", icon: "Briefcase", categoryId: "productivity", needs: ["content", "analytics"], levels: ["junior", "senior"], pricing: "paid", funnelStage: "bofu" },
  { id: "mastitulares", name: "Más Titulares", description: { es: "Generador de titulares", en: "Headline generator" }, url: "https://mastitulares.conviertemas.com/", icon: "Type", categoryId: "productivity", needs: ["content"], levels: ["beginner", "junior"], pricing: "free", funnelStage: "tofu" },

  // NEW - From Salesflare article: Lead Data Finders
  { id: "adaptio", name: "Adapt.io", description: { es: "Buscador de datos B2B por sector y empresa", en: "B2B data finder by industry and company" }, url: "https://www.adapt.io/", icon: "Database", categoryId: "lead-generation", needs: ["prospecting"], levels: ["junior", "senior"], pricing: "paid", funnelStage: "tofu" },
  { id: "salesflare", name: "Salesflare", description: { es: "CRM inteligente con buscador de emails integrado", en: "Smart CRM with built-in email finder" }, url: "https://salesflare.com/es", icon: "Sparkles", categoryId: "sales-crm", needs: ["automation", "prospecting", "analytics"], levels: ["beginner", "junior", "senior"], pricing: "freemium", funnelStage: "allinone" },
  { id: "findthatlead", name: "FindThatLead", description: { es: "Encuentra emails con barra lateral de LinkedIn", en: "Find emails with LinkedIn sidebar" }, url: "https://findthatlead.com/", icon: "Search", categoryId: "lead-generation", needs: ["prospecting"], levels: ["beginner", "junior"], pricing: "freemium", funnelStage: "tofu" },
  { id: "myemailverifier", name: "MyEmailVerifier", description: { es: "Verificador de listas de emails asequible", en: "Affordable email list verifier" }, url: "https://myemailverifier.com/", icon: "CheckCircle", categoryId: "email-tools", needs: ["prospecting"], levels: ["beginner", "junior"], pricing: "freemium", funnelStage: "tofu" },
  { id: "snovio", name: "Snov.io", description: { es: "Buscador de emails con extensión LinkedIn", en: "Email finder with LinkedIn extension" }, url: "https://snov.io/", icon: "Search", categoryId: "lead-generation", needs: ["prospecting", "automation"], levels: ["junior", "senior"], pricing: "freemium", funnelStage: "tofu" },

  // NEW - LinkedIn Automation
  { id: "duxsoup", name: "Dux-Soup", description: { es: "Automatización de LinkedIn: conexiones y mensajes", en: "LinkedIn automation: connections and messages" }, url: "https://www.dux-soup.com/", icon: "Bot", categoryId: "social-media", needs: ["automation", "prospecting"], levels: ["junior", "senior"], pricing: "paid", funnelStage: "tofu" },

  // NEW - Calling Software
  { id: "ringcentral", name: "RingCentral", description: { es: "Software VOIP para llamadas desde ordenador", en: "VOIP software for computer calls" }, url: "https://www.ringcentral.com/", icon: "Phone", categoryId: "sales-crm", needs: ["automation"], levels: ["junior", "senior"], pricing: "paid", funnelStage: "bofu" },

  // NEW - Video Sales Tools
  { id: "bonjoro", name: "Bonjoro", description: { es: "Videos personalizados para prospectos", en: "Personalized videos for prospects" }, url: "https://www.bonjoro.com/", icon: "Video", categoryId: "webinars-video", needs: ["content", "prospecting"], levels: ["beginner", "junior"], pricing: "freemium", funnelStage: "mofu" },
  { id: "zoom", name: "Zoom", description: { es: "Videollamadas y webinars", en: "Video calls and webinars" }, url: "https://zoom.us/", icon: "Video", categoryId: "webinars-video", needs: ["automation"], levels: ["beginner", "junior", "senior"], pricing: "freemium", funnelStage: "mofu" },

  // NEW - Nurturing Tools
  { id: "customerio", name: "Customer.io", description: { es: "Flujos de mensajería multicanal", en: "Multichannel messaging workflows" }, url: "https://customer.io/", icon: "MessageSquare", categoryId: "email-marketing", needs: ["automation"], levels: ["junior", "senior"], pricing: "paid", funnelStage: "mofu" },
  { id: "adroll", name: "AdRoll", description: { es: "Retargeting en múltiples plataformas", en: "Retargeting across multiple platforms" }, url: "https://www.adroll.com/", icon: "Target", categoryId: "social-media", needs: ["automation", "analytics"], levels: ["junior", "senior"], pricing: "paid", funnelStage: "mofu" },

  // NEW - Document & Proposal Tools
  { id: "docsend", name: "DocSend", description: { es: "Seguimiento de documentos compartidos", en: "Track shared documents" }, url: "https://www.docsend.com/", icon: "FileText", categoryId: "sales-crm", needs: ["analytics"], levels: ["junior", "senior"], pricing: "paid", funnelStage: "bofu" },
  { id: "betterproposals", name: "Better Proposals", description: { es: "Propuestas de venta modernas y trackeable", en: "Modern trackable sales proposals" }, url: "https://betterproposals.io/", icon: "FileText", categoryId: "sales-crm", needs: ["content"], levels: ["junior", "senior"], pricing: "paid", funnelStage: "bofu" },
  { id: "rightinbox", name: "Right Inbox", description: { es: "Tracking de emails en Gmail", en: "Email tracking in Gmail" }, url: "https://www.rightinbox.com/", icon: "MailCheck", categoryId: "email-tools", needs: ["analytics"], levels: ["beginner", "junior"], pricing: "freemium", funnelStage: "mofu" },

  // NEW - Integration Platforms
  { id: "zapier", name: "Zapier", description: { es: "Conecta apps y automatiza flujos de trabajo", en: "Connect apps and automate workflows" }, url: "https://zapier.com/", icon: "Zap", categoryId: "integrations", needs: ["automation"], levels: ["beginner", "junior", "senior"], pricing: "freemium", funnelStage: "allinone" },
  { id: "make", name: "Make (Integromat)", description: { es: "Automatización visual de procesos", en: "Visual process automation" }, url: "https://www.make.com/", icon: "Cog", categoryId: "integrations", needs: ["automation"], levels: ["junior", "senior"], pricing: "freemium", funnelStage: "allinone" },

  // NEW - From Cognism article: Premium B2B Data Platforms
  { id: "cognism", name: "Cognism", description: { es: "Datos B2B verificados con Diamond Data y señales de compra", en: "Verified B2B data with Diamond Data and buying signals" }, url: "https://www.cognism.com/", icon: "Database", categoryId: "lead-generation", needs: ["prospecting", "analytics"], levels: ["senior"], pricing: "paid", funnelStage: "tofu" },
  { id: "kaspr", name: "Kaspr", description: { es: "Extensión Chrome para datos de LinkedIn", en: "Chrome extension for LinkedIn data" }, url: "https://www.kaspr.io/", icon: "Linkedin", categoryId: "lead-generation", needs: ["prospecting"], levels: ["beginner", "junior"], pricing: "freemium", funnelStage: "tofu" },
  { id: "breezeintel", name: "Breeze Intelligence", description: { es: "Enriquecimiento de datos integrado con HubSpot", en: "Data enrichment integrated with HubSpot" }, url: "https://www.hubspot.com/products/artificial-intelligence", icon: "Sparkles", categoryId: "lead-generation", needs: ["prospecting", "automation"], levels: ["junior", "senior"], pricing: "paid", funnelStage: "tofu" },
  { id: "lead411", name: "Lead411", description: { es: "Prospección con secuencias y automatización email/SMS", en: "Prospecting with email/SMS sequences and automation" }, url: "https://www.lead411.com/", icon: "Mail", categoryId: "lead-generation", needs: ["prospecting", "automation"], levels: ["junior", "senior"], pricing: "paid", funnelStage: "tofu" },
  { id: "dnbhoovers", name: "D&B Hoovers", description: { es: "Base de datos corporativa con filtros avanzados", en: "Corporate database with advanced filters" }, url: "https://www.dnb.com/products/dnb-hoovers.html", icon: "Building2", categoryId: "lead-generation", needs: ["prospecting", "analytics"], levels: ["senior"], pricing: "paid", funnelStage: "tofu" },
  { id: "6sense", name: "6sense", description: { es: "Inteligencia de compra con IA y señales de intención", en: "AI buying intelligence with intent signals" }, url: "https://6sense.com/", icon: "Brain", categoryId: "lead-generation", needs: ["analytics", "prospecting"], levels: ["senior"], pricing: "paid", funnelStage: "tofu" },
  { id: "dealfront", name: "Dealfront", description: { es: "Tracking de visitantes web y datos B2B europeos", en: "Website visitor tracking and European B2B data" }, url: "https://www.dealfront.com/", icon: "Eye", categoryId: "lead-generation", needs: ["prospecting", "analytics"], levels: ["junior", "senior"], pricing: "paid", funnelStage: "tofu" },
];

export const getToolsByCategory = (categoryId: string): Tool[] => {
  return tools.filter(tool => tool.categoryId === categoryId);
};

export const getFilteredTools = (needs: Need[], level: Level | null): Tool[] => {
  if (needs.length === 0 && !level) return [];
  
  return tools.filter(tool => {
    const matchesNeeds = needs.length === 0 || needs.some(need => tool.needs.includes(need));
    const matchesLevel = !level || tool.levels.includes(level);
    return matchesNeeds && matchesLevel;
  });
};

export const getToolsByFunnelStage = (stage: FunnelStage): Tool[] => {
  return tools.filter(tool => tool.funnelStage === stage);
};
