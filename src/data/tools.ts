export type Need = "prospecting" | "automation" | "analytics" | "content";
export type Level = "beginner" | "junior" | "senior";
export type Pricing = "free" | "paid" | "freemium";

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
  { id: "education", name: { es: "Educación y Cursos", en: "Education & Courses" }, icon: "GraduationCap", color: "from-blue-500 to-indigo-500" },
  { id: "productivity", name: { es: "Productividad", en: "Productivity" }, icon: "Zap", color: "from-yellow-500 to-orange-500" },
];

export const tools: Tool[] = [
  // Email Marketing
  { id: "zerobounce", name: "ZeroBounce", description: { es: "Verificación y validación de emails", en: "Email verification and validation" }, url: "https://www.zerobounce.net/members/signin", icon: "MailCheck", categoryId: "email-marketing", needs: ["prospecting", "automation"], levels: ["beginner", "junior", "senior"], pricing: "freemium" },
  { id: "litmus", name: "Litmus", description: { es: "Pruebas y análisis de email marketing", en: "Email marketing testing and analytics" }, url: "https://www.litmus.com/", icon: "Mail", categoryId: "email-marketing", needs: ["analytics", "automation"], levels: ["junior", "senior"], pricing: "paid" },
  { id: "mailjet", name: "Mailjet", description: { es: "Plataforma de envío de emails masivos", en: "Mass email sending platform" }, url: "https://www.mailjet.com/", icon: "Send", categoryId: "email-marketing", needs: ["automation", "prospecting"], levels: ["beginner", "junior"], pricing: "freemium" },
  { id: "mailmeteor", name: "Mailmeteor", description: { es: "Envío de correos masivos desde Gmail", en: "Mass email sending from Gmail" }, url: "https://mailmeteor.com/es/", icon: "Mail", categoryId: "email-marketing", needs: ["automation", "prospecting"], levels: ["beginner"], pricing: "freemium" },
  { id: "brevo", name: "Brevo", description: { es: "Suite completa de email marketing", en: "Complete email marketing suite" }, url: "https://www.brevo.com/es/", icon: "MailOpen", categoryId: "email-marketing", needs: ["automation", "analytics"], levels: ["junior", "senior"], pricing: "freemium" },

  // Email Tools
  { id: "mailgenius", name: "MailGenius", description: { es: "Análisis y mejora de entregabilidad", en: "Deliverability analysis and improvement" }, url: "https://www.mailgenius.com/", icon: "MailSearch", categoryId: "email-tools", needs: ["analytics"], levels: ["junior", "senior"], pricing: "freemium" },
  { id: "mailreach", name: "MailReach", description: { es: "Calentamiento de emails para mejor entrega", en: "Email warmup for better delivery" }, url: "https://www.mailreach.co/", icon: "Flame", categoryId: "email-tools", needs: ["automation"], levels: ["junior", "senior"], pricing: "paid" },
  { id: "folderly", name: "Folderly", description: { es: "Mejora la entregabilidad de emails", en: "Improve email deliverability" }, url: "https://folderly.com/", icon: "FolderCheck", categoryId: "email-tools", needs: ["analytics", "automation"], levels: ["senior"], pricing: "paid" },
  { id: "lemwarm", name: "Lemwarm", description: { es: "Calentamiento automático de emails", en: "Automatic email warmup" }, url: "https://www.lemwarm.com/", icon: "Thermometer", categoryId: "email-tools", needs: ["automation"], levels: ["junior", "senior"], pricing: "paid" },
  { id: "debounce", name: "DeBounce", description: { es: "Limpieza y verificación de listas", en: "List cleaning and verification" }, url: "https://es.debounce.com/", icon: "ListChecks", categoryId: "email-tools", needs: ["prospecting"], levels: ["beginner", "junior"], pricing: "freemium" },
  { id: "usebouncer", name: "Bouncer", description: { es: "Verificación de emails en tiempo real", en: "Real-time email verification" }, url: "https://app.usebouncer.com/", icon: "ShieldCheck", categoryId: "email-tools", needs: ["prospecting"], levels: ["beginner", "junior"], pricing: "freemium" },
  { id: "verifyemail", name: "Verify Email", description: { es: "Verificador de direcciones de email", en: "Email address verifier" }, url: "https://www.verifyemailaddress.org/", icon: "CheckCircle", categoryId: "email-tools", needs: ["prospecting"], levels: ["beginner"], pricing: "free" },
  { id: "mxtoolbox", name: "MXToolbox", description: { es: "Diagnóstico de problemas de email", en: "Email problem diagnostics" }, url: "https://mxtoolbox.com/", icon: "Wrench", categoryId: "email-tools", needs: ["analytics"], levels: ["senior"], pricing: "freemium" },
  { id: "emailpermutator", name: "Email Permutator", description: { es: "Genera variaciones de emails", en: "Generate email variations" }, url: "http://metricsparrow.com/toolkit/email-permutator/", icon: "Shuffle", categoryId: "email-tools", needs: ["prospecting"], levels: ["beginner", "junior"], pricing: "free" },

  // AI Writing
  { id: "paraphraser", name: "Paraphraser", description: { es: "Reescribe textos con IA", en: "Rewrite texts with AI" }, url: "https://www.paraphraser.io/", icon: "RefreshCw", categoryId: "ai-writing", needs: ["content"], levels: ["beginner", "junior"], pricing: "freemium" },
  { id: "copyai", name: "Copy.ai", description: { es: "Generador de contenido con IA", en: "AI content generator" }, url: "https://www.copy.ai/", icon: "FileText", categoryId: "ai-writing", needs: ["content", "automation"], levels: ["beginner", "junior", "senior"], pricing: "freemium" },
  { id: "smartwriter", name: "SmartWriter", description: { es: "Emails personalizados con IA", en: "AI personalized emails" }, url: "https://www.smartwriter.ai/", icon: "Lightbulb", categoryId: "ai-writing", needs: ["content", "prospecting"], levels: ["junior", "senior"], pricing: "paid" },
  { id: "parafrasear", name: "Parafrasear", description: { es: "Herramienta de parafraseo en español", en: "Spanish paraphrasing tool" }, url: "https://parafrasear.org/", icon: "Languages", categoryId: "ai-writing", needs: ["content"], levels: ["beginner"], pricing: "free" },
  { id: "hixai", name: "HIX.AI", description: { es: "Suite completa de escritura con IA", en: "Complete AI writing suite" }, url: "https://hix.ai/es", icon: "Bot", categoryId: "ai-writing", needs: ["content", "automation"], levels: ["junior", "senior"], pricing: "freemium" },
  { id: "simplified", name: "Simplified", description: { es: "Contenido y diseño con IA", en: "AI content and design" }, url: "https://app.simplified.com/", icon: "Wand2", categoryId: "ai-writing", needs: ["content"], levels: ["beginner", "junior"], pricing: "freemium" },
  { id: "hypotenuse", name: "Hypotenuse AI", description: { es: "Escritor fantasma con IA", en: "AI ghostwriter" }, url: "https://www.hypotenuse.ai/tools/ghostwriter", icon: "Ghost", categoryId: "ai-writing", needs: ["content"], levels: ["junior", "senior"], pricing: "paid" },
  { id: "aithor", name: "Aithor", description: { es: "Asistente de escritura académica", en: "Academic writing assistant" }, url: "https://aithor.com/es-es", icon: "GraduationCap", categoryId: "ai-writing", needs: ["content"], levels: ["beginner"], pricing: "freemium" },
  { id: "hemingway", name: "Hemingway", description: { es: "Editor para escritura clara", en: "Editor for clear writing" }, url: "https://hemingwayapp.com/", icon: "FileEdit", categoryId: "ai-writing", needs: ["content"], levels: ["beginner", "junior", "senior"], pricing: "freemium" },
  { id: "twaingpt", name: "TwainGPT", description: { es: "Mejora tu escritura con IA", en: "Improve your writing with AI" }, url: "https://www.twaingpt.com/", icon: "PenLine", categoryId: "ai-writing", needs: ["content"], levels: ["junior"], pricing: "free" },
  { id: "tldrthis", name: "TLDR This", description: { es: "Resúmenes automáticos de textos", en: "Automatic text summaries" }, url: "https://www.tldrthis.com/", icon: "FileDown", categoryId: "ai-writing", needs: ["content", "analytics"], levels: ["beginner", "junior"], pricing: "freemium" },
  { id: "articlespinner", name: "Article Spinner", description: { es: "Reescritura automática de artículos", en: "Automatic article rewriting" }, url: "https://free-article-spinner.com/", icon: "RotateCw", categoryId: "ai-writing", needs: ["content"], levels: ["beginner"], pricing: "free" },
  { id: "gptzero", name: "GPTZero", description: { es: "Detector de contenido de IA", en: "AI content detector" }, url: "https://gptzero.me/", icon: "ScanSearch", categoryId: "ai-writing", needs: ["analytics"], levels: ["junior", "senior"], pricing: "freemium" },
  { id: "speechnotes", name: "Speechnotes", description: { es: "Dictado por voz a texto", en: "Voice to text dictation" }, url: "https://speechnotes.co/", icon: "Mic", categoryId: "ai-writing", needs: ["content"], levels: ["beginner"], pricing: "free" },
  { id: "contadorpalabras", name: "Contador de Palabras", description: { es: "Cuenta palabras y caracteres", en: "Word and character counter" }, url: "https://www.contadordepalabras.com/", icon: "Hash", categoryId: "ai-writing", needs: ["content"], levels: ["beginner"], pricing: "free" },

  // SEO & Analytics
  { id: "ahrefs", name: "Ahrefs", description: { es: "Herramienta completa de SEO", en: "Complete SEO tool" }, url: "https://ahrefs.com/", icon: "Search", categoryId: "seo-analytics", needs: ["analytics"], levels: ["junior", "senior"], pricing: "paid" },
  { id: "semrush", name: "Semrush", description: { es: "Suite de marketing digital y SEO", en: "Digital marketing and SEO suite" }, url: "https://www.semrush.com/", icon: "TrendingUp", categoryId: "seo-analytics", needs: ["analytics", "content"], levels: ["junior", "senior"], pricing: "freemium" },
  { id: "sistrix", name: "Sistrix", description: { es: "Análisis de visibilidad SEO", en: "SEO visibility analysis" }, url: "https://www.sistrix.es/", icon: "Eye", categoryId: "seo-analytics", needs: ["analytics"], levels: ["senior"], pricing: "paid" },
  { id: "similarweb", name: "SimilarWeb", description: { es: "Análisis de tráfico web", en: "Web traffic analysis" }, url: "https://lp.similarweb.com/", icon: "Globe", categoryId: "seo-analytics", needs: ["analytics", "prospecting"], levels: ["junior", "senior"], pricing: "freemium" },
  { id: "builtwith", name: "BuiltWith", description: { es: "Detecta tecnologías de sitios web", en: "Detect website technologies" }, url: "https://builtwith.com/", icon: "Layers", categoryId: "seo-analytics", needs: ["analytics", "prospecting"], levels: ["junior", "senior"], pricing: "freemium" },
  { id: "wappalyzer", name: "Wappalyzer", description: { es: "Identifica tecnologías web", en: "Identify web technologies" }, url: "https://www.wappalyzer.com/", icon: "Code", categoryId: "seo-analytics", needs: ["analytics", "prospecting"], levels: ["beginner", "junior"], pricing: "freemium" },
  { id: "smallseotools", name: "Small SEO Tools", description: { es: "Colección de herramientas SEO gratuitas", en: "Collection of free SEO tools" }, url: "https://smallseotools.com/", icon: "Wrench", categoryId: "seo-analytics", needs: ["analytics", "content"], levels: ["beginner"], pricing: "free" },
  { id: "serptext", name: "SerpText", description: { es: "Análisis de SERPs y competencia", en: "SERP and competition analysis" }, url: "https://serptext.com/", icon: "FileSearch", categoryId: "seo-analytics", needs: ["analytics"], levels: ["junior", "senior"], pricing: "freemium" },

  // Social Media
  { id: "taplio", name: "Taplio", description: { es: "Crecimiento en LinkedIn con IA", en: "LinkedIn growth with AI" }, url: "https://taplio.com/", icon: "Linkedin", categoryId: "social-media", needs: ["content", "automation"], levels: ["junior", "senior"], pricing: "paid" },
  { id: "ritetag", name: "RiteTag", description: { es: "Sugerencias de hashtags en tiempo real", en: "Real-time hashtag suggestions" }, url: "https://ritetag.com/", icon: "Hash", categoryId: "social-media", needs: ["content"], levels: ["beginner", "junior"], pricing: "freemium" },
  { id: "allhashtag", name: "All Hashtag", description: { es: "Generador de hashtags", en: "Hashtag generator" }, url: "https://www.all-hashtag.com/", icon: "Hash", categoryId: "social-media", needs: ["content"], levels: ["beginner"], pricing: "free" },
  { id: "hashtagsforlikes", name: "Hashtags For Likes", description: { es: "Hashtags para aumentar engagement", en: "Hashtags to increase engagement" }, url: "https://www.hashtagsforlikes.co/", icon: "Heart", categoryId: "social-media", needs: ["content"], levels: ["beginner"], pricing: "freemium" },
  { id: "flick", name: "Flick", description: { es: "Gestión de hashtags y analytics", en: "Hashtag management and analytics" }, url: "https://www.flick.social/", icon: "BarChart", categoryId: "social-media", needs: ["analytics", "content"], levels: ["junior", "senior"], pricing: "paid" },
  { id: "meetalfred", name: "Meet Alfred", description: { es: "Automatización de LinkedIn", en: "LinkedIn automation" }, url: "https://meetalfred.com/", icon: "Bot", categoryId: "social-media", needs: ["automation", "prospecting"], levels: ["junior", "senior"], pricing: "paid" },

  // Sales & CRM
  { id: "close", name: "Close CRM", description: { es: "CRM para equipos de ventas", en: "CRM for sales teams" }, url: "https://www.close.com/", icon: "Handshake", categoryId: "sales-crm", needs: ["automation", "analytics"], levels: ["junior", "senior"], pricing: "paid" },
  { id: "nocrm", name: "noCRM", description: { es: "CRM simple para cerrar ventas", en: "Simple CRM to close sales" }, url: "https://www.nocrm.io/es", icon: "Target", categoryId: "sales-crm", needs: ["automation"], levels: ["beginner", "junior"], pricing: "freemium" },
  { id: "overloop", name: "Overloop", description: { es: "Automatización de ventas outbound", en: "Outbound sales automation" }, url: "https://overloop.com/", icon: "RefreshCcw", categoryId: "sales-crm", needs: ["automation", "prospecting"], levels: ["junior", "senior"], pricing: "paid" },
  { id: "outplay", name: "Outplay", description: { es: "Plataforma de engagement de ventas", en: "Sales engagement platform" }, url: "https://outplay.ai/", icon: "PlayCircle", categoryId: "sales-crm", needs: ["automation", "analytics"], levels: ["junior", "senior"], pricing: "paid" },
  { id: "outreach", name: "Outreach", description: { es: "Plataforma de ejecución de ventas", en: "Sales execution platform" }, url: "https://www.outreach.io/", icon: "Send", categoryId: "sales-crm", needs: ["automation"], levels: ["senior"], pricing: "paid" },
  { id: "gong", name: "Gong", description: { es: "Inteligencia de ingresos", en: "Revenue intelligence" }, url: "https://www.gong.io/", icon: "TrendingUp", categoryId: "sales-crm", needs: ["analytics"], levels: ["senior"], pricing: "paid" },
  { id: "reply", name: "Reply.io", description: { es: "Automatización de ventas con IA", en: "AI sales automation" }, url: "https://reply.io/", icon: "MessageSquare", categoryId: "sales-crm", needs: ["automation", "prospecting"], levels: ["junior", "senior"], pricing: "freemium" },
  { id: "crystalknows", name: "Crystal Knows", description: { es: "Análisis de personalidad para ventas", en: "Personality analysis for sales" }, url: "https://www.crystalknows.com/", icon: "Brain", categoryId: "sales-crm", needs: ["analytics", "prospecting"], levels: ["senior"], pricing: "freemium" },
  { id: "salesplaybookbuilder", name: "Sales Playbook Builder", description: { es: "Crea playbooks de ventas con IA", en: "Create sales playbooks with AI" }, url: "https://salesplaybookbuilder.ai/", icon: "BookOpen", categoryId: "sales-crm", needs: ["content", "automation"], levels: ["junior", "senior"], pricing: "freemium" },
  { id: "predictablerevenue", name: "Predictable Revenue", description: { es: "Resumen del libro de Aaron Ross", en: "Aaron Ross book summary" }, url: "https://devoradoresdelibros.com/predictable-revenue-aaron-ross/", icon: "Book", categoryId: "sales-crm", needs: ["content"], levels: ["beginner", "junior"], pricing: "free" },
  { id: "efficypredictable", name: "Efficy - Predictable Revenue", description: { es: "Guía de Predictable Revenue", en: "Predictable Revenue guide" }, url: "https://www.efficy.com/es/predictable-revenue/", icon: "FileText", categoryId: "sales-crm", needs: ["content"], levels: ["beginner", "junior"], pricing: "free" },
  { id: "emailsventas", name: "Emails para Ventas", description: { es: "Ejemplos de emails para ventas en frío", en: "Cold sales email examples" }, url: "https://branch.com.co/marketing-digital/10-ejemplos-de-emails-para-aumentar-ventas-con-clientes-en-frio/", icon: "Mail", categoryId: "sales-crm", needs: ["content", "prospecting"], levels: ["beginner"], pricing: "free" },

  // Lead Generation
  { id: "uplead", name: "UpLead", description: { es: "Base de datos de leads B2B", en: "B2B lead database" }, url: "https://www.uplead.com/", icon: "Users", categoryId: "lead-generation", needs: ["prospecting"], levels: ["junior", "senior"], pricing: "freemium" },
  { id: "easyleadz", name: "EasyLeadz", description: { es: "Encuentra emails de decisores", en: "Find decision makers' emails" }, url: "https://www.easyleadz.com/", icon: "UserSearch", categoryId: "lead-generation", needs: ["prospecting"], levels: ["beginner", "junior"], pricing: "freemium" },
  { id: "voilanorbert", name: "Voila Norbert", description: { es: "Búsqueda de emails corporativos", en: "Corporate email search" }, url: "https://www.voilanorbert.com/", icon: "Search", categoryId: "lead-generation", needs: ["prospecting"], levels: ["beginner", "junior"], pricing: "freemium" },
  { id: "clay", name: "Clay", description: { es: "Enriquecimiento de datos de leads", en: "Lead data enrichment" }, url: "https://www.clay.com/", icon: "Database", categoryId: "lead-generation", needs: ["prospecting", "automation"], levels: ["senior"], pricing: "paid" },
  { id: "predictleads", name: "PredictLeads", description: { es: "Datos predictivos de empresas", en: "Predictive company data" }, url: "https://predictleads.com/", icon: "LineChart", categoryId: "lead-generation", needs: ["prospecting", "analytics"], levels: ["senior"], pricing: "paid" },
  { id: "scrapio", name: "Scrap.io", description: { es: "Extracción de datos de Google Maps", en: "Google Maps data extraction" }, url: "https://scrap.io/", icon: "Map", categoryId: "lead-generation", needs: ["prospecting"], levels: ["junior", "senior"], pricing: "freemium" },
  { id: "lusha", name: "Lusha", description: { es: "Datos de contacto B2B", en: "B2B contact data" }, url: "https://www.lusha.com/", icon: "Phone", categoryId: "lead-generation", needs: ["prospecting"], levels: ["beginner", "junior", "senior"], pricing: "freemium" },
  { id: "seamless", name: "Seamless.AI", description: { es: "Motor de búsqueda de leads", en: "Lead search engine" }, url: "https://seamless.ai/", icon: "Search", categoryId: "lead-generation", needs: ["prospecting"], levels: ["junior", "senior"], pricing: "freemium" },
  { id: "apollo", name: "Apollo.io", description: { es: "Plataforma de inteligencia de ventas", en: "Sales intelligence platform" }, url: "https://www.apollo.io/es", icon: "Rocket", categoryId: "lead-generation", needs: ["prospecting", "automation"], levels: ["beginner", "junior", "senior"], pricing: "freemium" },
  { id: "salesintel", name: "SalesIntel", description: { es: "Datos de contacto verificados", en: "Verified contact data" }, url: "https://salesintel.io/", icon: "ShieldCheck", categoryId: "lead-generation", needs: ["prospecting"], levels: ["junior", "senior"], pricing: "paid" },
  { id: "zoominfo", name: "ZoomInfo", description: { es: "Base de datos empresarial", en: "Business database" }, url: "https://www.zoominfo.com/", icon: "Building2", categoryId: "lead-generation", needs: ["prospecting", "analytics"], levels: ["senior"], pricing: "paid" },
  { id: "hunter", name: "Hunter.io", description: { es: "Encuentra emails de cualquier empresa", en: "Find emails from any company" }, url: "https://hunter.io/", icon: "Target", categoryId: "lead-generation", needs: ["prospecting"], levels: ["beginner", "junior", "senior"], pricing: "freemium" },
  { id: "fullenrich", name: "FullEnrich", description: { es: "Enriquecimiento completo de datos", en: "Complete data enrichment" }, url: "https://fullenrich.com/", icon: "DatabaseBackup", categoryId: "lead-generation", needs: ["prospecting"], levels: ["junior", "senior"], pricing: "paid" },
  { id: "leadiq", name: "LeadIQ", description: { es: "Captura de datos de prospección", en: "Prospecting data capture" }, url: "https://leadiq.com/", icon: "UserPlus", categoryId: "lead-generation", needs: ["prospecting"], levels: ["junior", "senior"], pricing: "freemium" },
  { id: "crunchbase", name: "Crunchbase", description: { es: "Datos de empresas y startups", en: "Company and startup data" }, url: "https://www.crunchbase.com/", icon: "Building", categoryId: "lead-generation", needs: ["prospecting", "analytics"], levels: ["beginner", "junior", "senior"], pricing: "freemium" },
  { id: "rocketreach", name: "RocketReach", description: { es: "Encuentra emails y teléfonos", en: "Find emails and phones" }, url: "https://rocketreach.co/", icon: "Rocket", categoryId: "lead-generation", needs: ["prospecting"], levels: ["beginner", "junior"], pricing: "freemium" },
  { id: "brightdata", name: "Bright Data", description: { es: "Plataforma de datos web", en: "Web data platform" }, url: "https://brightdata.com/", icon: "Globe", categoryId: "lead-generation", needs: ["prospecting", "automation"], levels: ["senior"], pricing: "paid" },
  { id: "prospeo", name: "Prospeo", description: { es: "Encuentra y verifica emails", en: "Find and verify emails" }, url: "https://prospeo.io/", icon: "MailSearch", categoryId: "lead-generation", needs: ["prospecting"], levels: ["beginner", "junior"], pricing: "freemium" },
  { id: "findymail", name: "Findymail", description: { es: "Buscador de emails verificados", en: "Verified email finder" }, url: "https://www.findymail.com/", icon: "Search", categoryId: "lead-generation", needs: ["prospecting"], levels: ["junior", "senior"], pricing: "paid" },
  { id: "discoverorg", name: "DiscoverOrg", description: { es: "Inteligencia de mercado B2B", en: "B2B market intelligence" }, url: "https://discoverorg.com/", icon: "Compass", categoryId: "lead-generation", needs: ["prospecting", "analytics"], levels: ["senior"], pricing: "paid" },
  { id: "epieos", name: "Epieos", description: { es: "OSINT para búsqueda de emails", en: "OSINT for email search" }, url: "https://epieos.com/", icon: "Eye", categoryId: "lead-generation", needs: ["prospecting"], levels: ["junior", "senior"], pricing: "freemium" },
  { id: "lagrowthmachine", name: "La Growth Machine", description: { es: "Automatización multicanal de ventas", en: "Multichannel sales automation" }, url: "https://lagrowthmachine.com/es/", icon: "Cog", categoryId: "lead-generation", needs: ["automation", "prospecting"], levels: ["junior", "senior"], pricing: "paid" },

  // AI Tools
  { id: "perplexity", name: "Perplexity", description: { es: "Motor de búsqueda con IA", en: "AI search engine" }, url: "https://www.perplexity.ai/", icon: "Search", categoryId: "ai-tools", needs: ["analytics", "content"], levels: ["beginner", "junior", "senior"], pricing: "freemium" },
  { id: "deliveryman", name: "Deliveryman AI", description: { es: "Asistente de entregas con IA", en: "AI delivery assistant" }, url: "https://deliveryman.ai", icon: "Truck", categoryId: "ai-tools", needs: ["automation"], levels: ["junior", "senior"], pricing: "paid" },
  { id: "aicallcenter", name: "AI Call Center", description: { es: "Centro de llamadas con IA", en: "AI call center" }, url: "https://aicallcenter.co/", icon: "Headphones", categoryId: "ai-tools", needs: ["automation"], levels: ["senior"], pricing: "paid" },
  { id: "moonback", name: "Moonback", description: { es: "Automatización de feedback con IA", en: "AI feedback automation" }, url: "https://moonback.me/es", icon: "MessageCircle", categoryId: "ai-tools", needs: ["automation", "analytics"], levels: ["junior", "senior"], pricing: "freemium" },
  { id: "maestrolabs", name: "Maestro Labs", description: { es: "Herramientas de productividad con IA", en: "AI productivity tools" }, url: "https://www.maestrolabs.com/", icon: "Wand2", categoryId: "ai-tools", needs: ["automation"], levels: ["junior", "senior"], pricing: "paid" },
  { id: "wandai", name: "Wand.AI", description: { es: "Automatización empresarial con IA", en: "AI business automation" }, url: "https://wand.ai/", icon: "Sparkles", categoryId: "ai-tools", needs: ["automation"], levels: ["senior"], pricing: "paid" },
  { id: "smartlead", name: "SmartLead", description: { es: "Outreach con IA", en: "AI outreach" }, url: "https://www.smartlead.ai/", icon: "Zap", categoryId: "ai-tools", needs: ["automation", "prospecting"], levels: ["junior", "senior"], pricing: "paid" },
  { id: "mailmentor", name: "MailMentor", description: { es: "Mejora emails con IA", en: "Improve emails with AI" }, url: "https://www.mailmentor.io/", icon: "GraduationCap", categoryId: "ai-tools", needs: ["content"], levels: ["beginner", "junior"], pricing: "freemium" },
  { id: "popai", name: "PopAI", description: { es: "Asistente de IA todo en uno", en: "All-in-one AI assistant" }, url: "https://www.popai.pro/es/", icon: "Bot", categoryId: "ai-tools", needs: ["content", "automation"], levels: ["beginner", "junior", "senior"], pricing: "freemium" },
  { id: "genspark", name: "GenSpark", description: { es: "Motor de búsqueda con IA agéntica", en: "Agentic AI search engine" }, url: "https://www.genspark.ai/", icon: "Sparkle", categoryId: "ai-tools", needs: ["analytics"], levels: ["junior", "senior"], pricing: "freemium" },
  { id: "toolerbox", name: "Toolerbox", description: { es: "Directorio de herramientas de IA", en: "AI tools directory" }, url: "https://toolerbox.com/", icon: "Package", categoryId: "ai-tools", needs: ["analytics"], levels: ["beginner", "junior", "senior"], pricing: "free" },

  // Design & Media
  { id: "pfpmaker", name: "PFP Maker", description: { es: "Crea fotos de perfil profesionales", en: "Create professional profile pictures" }, url: "https://pfpmaker.com/", icon: "User", categoryId: "design-media", needs: ["content"], levels: ["beginner"], pricing: "free" },
  { id: "promeai", name: "PromeAI", description: { es: "Generación de imágenes con IA", en: "AI image generation" }, url: "https://www.promeai.pro/", icon: "Image", categoryId: "design-media", needs: ["content"], levels: ["beginner", "junior"], pricing: "freemium" },
  { id: "invideo", name: "InVideo", description: { es: "Creación de videos con IA", en: "AI video creation" }, url: "https://ai.invideo.io/signup", icon: "Video", categoryId: "design-media", needs: ["content"], levels: ["beginner", "junior", "senior"], pricing: "freemium" },
  { id: "blinkshot", name: "Blinkshot", description: { es: "Generación de imágenes en tiempo real", en: "Real-time image generation" }, url: "https://www.blinkshot.io/", icon: "Camera", categoryId: "design-media", needs: ["content"], levels: ["beginner", "junior"], pricing: "free" },
  { id: "freepik", name: "Freepik", description: { es: "Recursos gráficos y vectores", en: "Graphic resources and vectors" }, url: "https://www.freepik.com/", icon: "Palette", categoryId: "design-media", needs: ["content"], levels: ["beginner", "junior", "senior"], pricing: "freemium" },
  { id: "hippovideo", name: "Hippo Video", description: { es: "Plataforma de video para ventas", en: "Video platform for sales" }, url: "https://www.hippovideo.io/", icon: "Play", categoryId: "design-media", needs: ["content", "prospecting"], levels: ["junior", "senior"], pricing: "freemium" },
  { id: "decktopus", name: "Decktopus", description: { es: "Presentaciones con IA", en: "AI presentations" }, url: "https://www.decktopus.com/", icon: "Presentation", categoryId: "design-media", needs: ["content"], levels: ["beginner", "junior"], pricing: "freemium" },

  // Education
  { id: "alison", name: "Alison", description: { es: "Cursos gratuitos online", en: "Free online courses" }, url: "https://alison.com/es", icon: "BookOpen", categoryId: "education", needs: ["content"], levels: ["beginner"], pricing: "free" },
  { id: "edx", name: "edX", description: { es: "Cursos de universidades top", en: "Courses from top universities" }, url: "https://www.edx.org/", icon: "GraduationCap", categoryId: "education", needs: ["content"], levels: ["beginner", "junior", "senior"], pricing: "freemium" },
  { id: "aprendum", name: "Aprendum", description: { es: "Cursos online en español", en: "Online courses in Spanish" }, url: "https://www.aprendum.mx/", icon: "Book", categoryId: "education", needs: ["content"], levels: ["beginner"], pricing: "freemium" },
  { id: "cursoseducate", name: "Cursos Educate", description: { es: "Formación online gratuita", en: "Free online training" }, url: "https://cursoseducate.com/", icon: "School", categoryId: "education", needs: ["content"], levels: ["beginner"], pricing: "free" },
  { id: "videocursos", name: "Videocursos", description: { es: "Cursos en video", en: "Video courses" }, url: "https://videocursos.co/", icon: "PlayCircle", categoryId: "education", needs: ["content"], levels: ["beginner", "junior"], pricing: "freemium" },

  // Productivity
  { id: "venturekit", name: "VentureKit", description: { es: "Business plans con IA", en: "AI business plans" }, url: "https://www.venturekit.ai/", icon: "Briefcase", categoryId: "productivity", needs: ["content", "analytics"], levels: ["junior", "senior"], pricing: "paid" },
  { id: "mastitulares", name: "Más Titulares", description: { es: "Generador de titulares", en: "Headline generator" }, url: "https://mastitulares.conviertemas.com/", icon: "Type", categoryId: "productivity", needs: ["content"], levels: ["beginner", "junior"], pricing: "free" },
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
