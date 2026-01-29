import { useState } from "react";
import { FileText, Download, FileSpreadsheet, Presentation, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Tool, categories } from "@/data/tools";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";

interface TechStackExportProps {
  tools: Tool[];
  level: string | null;
  selectedCategories: string[];
}

const TechStackExport = ({ tools, level, selectedCategories }: TechStackExportProps) => {
  const { language } = useLanguage();
  const [exporting, setExporting] = useState<string | null>(null);
  const [exported, setExported] = useState<string | null>(null);

  const getLevelLabel = (levelId: string | null) => {
    const labels: Record<string, { es: string; en: string }> = {
      beginner: { es: "Principiante", en: "Beginner" },
      junior: { es: "Junior", en: "Junior" },
      senior: { es: "Senior", en: "Senior" },
    };
    return levelId ? labels[levelId]?.[language] || levelId : "";
  };

  const getCategoryName = (categoryId: string) => {
    const cat = categories.find(c => c.id === categoryId);
    return cat ? cat.name[language] : categoryId;
  };

  const getPricingLabel = (pricing: string) => {
    const labels: Record<string, { es: string; en: string }> = {
      free: { es: "Gratuito", en: "Free" },
      freemium: { es: "Freemium", en: "Freemium" },
      paid: { es: "De pago", en: "Paid" },
    };
    return labels[pricing]?.[language] || pricing;
  };

  const getStrategyTip = (tool: Tool) => {
    const tips: Record<string, { es: string; en: string }> = {
      prospecting: {
        es: "Usar para encontrar y calificar nuevos prospectos",
        en: "Use to find and qualify new prospects"
      },
      automation: {
        es: "Automatizar tareas repetitivas para ahorrar tiempo",
        en: "Automate repetitive tasks to save time"
      },
      analytics: {
        es: "Medir y optimizar resultados de ventas",
        en: "Measure and optimize sales results"
      },
      content: {
        es: "Crear contenido que atraiga y convierta",
        en: "Create content that attracts and converts"
      }
    };
    const mainNeed = tool.needs[0];
    return tips[mainNeed]?.[language] || "";
  };

  const exportToPDF = async () => {
    setExporting("pdf");
    
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      let yPos = 20;
      
      // Header
      doc.setFontSize(20);
      doc.setTextColor(0, 136, 204);
      doc.text(language === "es" ? "Mi Stack Tecnológico de Ventas" : "My Sales Tech Stack", pageWidth / 2, yPos, { align: "center" });
      yPos += 15;
      
      // Subtitle with level
      if (level) {
        doc.setFontSize(12);
        doc.setTextColor(100, 100, 100);
        doc.text(`${language === "es" ? "Nivel" : "Level"}: ${getLevelLabel(level)}`, pageWidth / 2, yPos, { align: "center" });
        yPos += 10;
      }
      
      // Selected categories
      if (selectedCategories.length > 0) {
        doc.setFontSize(10);
        doc.setTextColor(120, 120, 120);
        const catNames = selectedCategories.map(getCategoryName).join(", ");
        doc.text(`${language === "es" ? "Categorías" : "Categories"}: ${catNames}`, pageWidth / 2, yPos, { align: "center" });
        yPos += 15;
      }
      
      doc.setDrawColor(200, 200, 200);
      doc.line(20, yPos, pageWidth - 20, yPos);
      yPos += 10;
      
      // Tools list
      tools.forEach((tool, index) => {
        if (yPos > 260) {
          doc.addPage();
          yPos = 20;
        }
        
        // Tool name
        doc.setFontSize(12);
        doc.setTextColor(30, 30, 30);
        doc.setFont("helvetica", "bold");
        doc.text(`${index + 1}. ${tool.name}`, 20, yPos);
        
        // Pricing badge
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.setFont("helvetica", "normal");
        doc.text(`[${getPricingLabel(tool.pricing)}]`, pageWidth - 25, yPos, { align: "right" });
        yPos += 6;
        
        // Description
        doc.setFontSize(10);
        doc.setTextColor(80, 80, 80);
        doc.setFont("helvetica", "normal");
        const description = tool.description[language];
        const splitDesc = doc.splitTextToSize(description, pageWidth - 50);
        doc.text(splitDesc, 25, yPos);
        yPos += splitDesc.length * 5 + 2;
        
        // Strategy tip
        const tip = getStrategyTip(tool);
        if (tip) {
          doc.setFontSize(9);
          doc.setTextColor(0, 136, 204);
          doc.text(`💡 ${tip}`, 25, yPos);
          yPos += 6;
        }
        
        // Link
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        doc.text(`🔗 ${tool.url}`, 25, yPos);
        yPos += 12;
      });
      
      // Footer
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(
        language === "es" 
          ? "Generado con Herramientas para Vendedores • De vendedor a vendedor" 
          : "Generated with Tools for Sellers • From salesperson to salesperson",
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: "center" }
      );
      
      doc.save(`tech-stack-${level || "all"}.pdf`);
      setExported("pdf");
      setTimeout(() => setExported(null), 2000);
    } finally {
      setExporting(null);
    }
  };

  const exportToExcel = async () => {
    setExporting("excel");
    
    try {
      const data = tools.map((tool, index) => ({
        "#": index + 1,
        [language === "es" ? "Herramienta" : "Tool"]: tool.name,
        [language === "es" ? "Descripción" : "Description"]: tool.description[language],
        [language === "es" ? "Categoría" : "Category"]: getCategoryName(tool.categoryId),
        [language === "es" ? "Precio" : "Pricing"]: getPricingLabel(tool.pricing),
        [language === "es" ? "Estrategia" : "Strategy"]: getStrategyTip(tool),
        "URL": tool.url,
      }));
      
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Tech Stack");
      
      // Set column widths
      ws["!cols"] = [
        { wch: 4 },
        { wch: 20 },
        { wch: 40 },
        { wch: 20 },
        { wch: 12 },
        { wch: 40 },
        { wch: 35 },
      ];
      
      XLSX.writeFile(wb, `tech-stack-${level || "all"}.xlsx`);
      setExported("excel");
      setTimeout(() => setExported(null), 2000);
    } finally {
      setExporting(null);
    }
  };

  if (tools.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 mt-3 pt-3 border-t border-border/50">
      <span className="text-xs text-muted-foreground mr-1">
        {language === "es" ? "Exportar stack:" : "Export stack:"}
      </span>
      
      <Button
        variant="outline"
        size="sm"
        onClick={exportToPDF}
        disabled={exporting !== null}
        className="h-7 text-xs gap-1.5"
      >
        {exporting === "pdf" ? (
          <Loader2 className="w-3 h-3 animate-spin" />
        ) : exported === "pdf" ? (
          <CheckCircle className="w-3 h-3 text-green-500" />
        ) : (
          <FileText className="w-3 h-3" />
        )}
        PDF
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={exportToExcel}
        disabled={exporting !== null}
        className="h-7 text-xs gap-1.5"
      >
        {exporting === "excel" ? (
          <Loader2 className="w-3 h-3 animate-spin" />
        ) : exported === "excel" ? (
          <CheckCircle className="w-3 h-3 text-green-500" />
        ) : (
          <FileSpreadsheet className="w-3 h-3" />
        )}
        Excel
      </Button>
    </div>
  );
};

export default TechStackExport;
