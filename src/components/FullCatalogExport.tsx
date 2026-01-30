import { useState } from "react";
import { FileText, FileSpreadsheet, Loader2, CheckCircle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { tools, categories, FunnelStage } from "@/data/tools";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";

const FullCatalogExport = () => {
  const { language } = useLanguage();
  const [exporting, setExporting] = useState<string | null>(null);
  const [exported, setExported] = useState<string | null>(null);

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

  const getLevelLabel = (levels: string[]) => {
    const labels: Record<string, { es: string; en: string }> = {
      beginner: { es: "Principiante", en: "Beginner" },
      junior: { es: "Junior", en: "Junior" },
      senior: { es: "Senior", en: "Senior" },
    };
    return levels.map(l => labels[l]?.[language] || l).join(", ");
  };

  const getFunnelLabel = (stage: FunnelStage) => {
    const labels: Record<FunnelStage, { es: string; en: string }> = {
      tofu: { es: "TOFU (Atracción)", en: "TOFU (Awareness)" },
      mofu: { es: "MOFU (Consideración)", en: "MOFU (Consideration)" },
      bofu: { es: "BOFU (Decisión)", en: "BOFU (Decision)" },
      allinone: { es: "Todo el embudo", en: "Full Funnel" },
    };
    return labels[stage]?.[language] || stage;
  };

  const exportToPDF = async () => {
    setExporting("pdf");
    
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      let yPos = 20;
      
      // Header
      doc.setFontSize(22);
      doc.setTextColor(0, 136, 204);
      doc.text(
        language === "es" ? "Catálogo Completo de Herramientas" : "Complete Tools Catalog", 
        pageWidth / 2, 
        yPos, 
        { align: "center" }
      );
      yPos += 10;
      
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text(
        language === "es" 
          ? `${tools.length} herramientas en ${categories.length} categorías` 
          : `${tools.length} tools in ${categories.length} categories`, 
        pageWidth / 2, 
        yPos, 
        { align: "center" }
      );
      yPos += 15;
      
      doc.setDrawColor(200, 200, 200);
      doc.line(20, yPos, pageWidth - 20, yPos);
      yPos += 10;

      // Group tools by category
      const toolsByCategory = categories.map(cat => ({
        category: cat,
        tools: tools.filter(t => t.categoryId === cat.id)
      })).filter(g => g.tools.length > 0);

      toolsByCategory.forEach((group) => {
        // Check if we need a new page
        if (yPos > pageHeight - 40) {
          doc.addPage();
          yPos = 20;
        }

        // Category header
        doc.setFontSize(14);
        doc.setTextColor(0, 100, 180);
        doc.setFont("helvetica", "bold");
        doc.text(`${group.category.name[language]} (${group.tools.length})`, 20, yPos);
        yPos += 8;

        group.tools.forEach((tool, index) => {
          if (yPos > pageHeight - 30) {
            doc.addPage();
            yPos = 20;
          }

          // Tool name with number
          doc.setFontSize(11);
          doc.setTextColor(30, 30, 30);
          doc.setFont("helvetica", "bold");
          doc.text(`${index + 1}. ${tool.name}`, 25, yPos);
          
          // Pricing badge
          doc.setFontSize(8);
          doc.setFont("helvetica", "normal");
          const pricingColors: Record<string, [number, number, number]> = {
            free: [34, 197, 94],
            freemium: [245, 158, 11],
            paid: [239, 68, 68]
          };
          const [r, g, b] = pricingColors[tool.pricing] || [100, 100, 100];
          doc.setTextColor(r, g, b);
          doc.text(`[${getPricingLabel(tool.pricing)}]`, pageWidth - 25, yPos, { align: "right" });
          yPos += 5;

          // Description
          doc.setFontSize(9);
          doc.setTextColor(80, 80, 80);
          doc.setFont("helvetica", "normal");
          const description = tool.description[language];
          const splitDesc = doc.splitTextToSize(description, pageWidth - 60);
          doc.text(splitDesc, 30, yPos);
          yPos += splitDesc.length * 4 + 1;

          // Metadata line
          doc.setFontSize(8);
          doc.setTextColor(100, 100, 100);
          const funnelLabel = language === "es" ? "Etapa:" : "Stage:";
          const levelLabel = language === "es" ? "Nivel:" : "Level:";
          doc.text(`${funnelLabel} ${getFunnelLabel(tool.funnelStage)} | ${levelLabel} ${getLevelLabel(tool.levels)}`, 30, yPos);
          yPos += 4;

          // URL
          doc.setTextColor(0, 100, 200);
          doc.text(tool.url, 30, yPos);
          yPos += 8;
        });

        yPos += 5;
      });

      // Footer on last page
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(
        language === "es" 
          ? "Generado con Herramientas para Vendedores • De vendedor a vendedor" 
          : "Generated with Tools for Sellers • From salesperson to salesperson",
        pageWidth / 2,
        pageHeight - 10,
        { align: "center" }
      );

      doc.save(`catalogo-herramientas-completo.pdf`);
      setExported("pdf");
      setTimeout(() => setExported(null), 3000);
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
        [language === "es" ? "Niveles" : "Levels"]: getLevelLabel(tool.levels),
        [language === "es" ? "Etapa del Embudo" : "Funnel Stage"]: getFunnelLabel(tool.funnelStage),
        "URL": tool.url,
      }));
      
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, language === "es" ? "Herramientas" : "Tools");
      
      // Set column widths
      ws["!cols"] = [
        { wch: 4 },   // #
        { wch: 22 },  // Tool
        { wch: 45 },  // Description
        { wch: 22 },  // Category
        { wch: 12 },  // Pricing
        { wch: 25 },  // Levels
        { wch: 22 },  // Funnel Stage
        { wch: 40 },  // URL
      ];

      // Add summary sheet
      const summaryData = categories.map(cat => {
        const catTools = tools.filter(t => t.categoryId === cat.id);
        return {
          [language === "es" ? "Categoría" : "Category"]: cat.name[language],
          [language === "es" ? "Total Herramientas" : "Total Tools"]: catTools.length,
          [language === "es" ? "Gratuitas" : "Free"]: catTools.filter(t => t.pricing === "free").length,
          "Freemium": catTools.filter(t => t.pricing === "freemium").length,
          [language === "es" ? "De Pago" : "Paid"]: catTools.filter(t => t.pricing === "paid").length,
        };
      });
      
      const summaryWs = XLSX.utils.json_to_sheet(summaryData);
      summaryWs["!cols"] = [
        { wch: 25 },
        { wch: 15 },
        { wch: 12 },
        { wch: 12 },
        { wch: 12 },
      ];
      XLSX.utils.book_append_sheet(wb, summaryWs, language === "es" ? "Resumen" : "Summary");
      
      XLSX.writeFile(wb, `catalogo-herramientas-completo.xlsx`);
      setExported("excel");
      setTimeout(() => setExported(null), 3000);
    } finally {
      setExporting(null);
    }
  };

  return (
    <section className="max-w-5xl mx-auto px-3 sm:px-4 py-6">
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Download className="w-5 h-5 text-primary" />
            {language === "es" ? "Descargar Catálogo Completo" : "Download Complete Catalog"}
          </CardTitle>
          <CardDescription>
            {language === "es" 
              ? `Exporta las ${tools.length} herramientas con todas sus características`
              : `Export all ${tools.length} tools with their complete features`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={exportToPDF}
              disabled={exporting !== null}
              className="gap-2"
              variant="default"
            >
              {exporting === "pdf" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : exported === "pdf" ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <FileText className="w-4 h-4" />
              )}
              {language === "es" ? "Descargar PDF" : "Download PDF"}
            </Button>
            
            <Button
              onClick={exportToExcel}
              disabled={exporting !== null}
              variant="outline"
              className="gap-2"
            >
              {exporting === "excel" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : exported === "excel" ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <FileSpreadsheet className="w-4 h-4" />
              )}
              {language === "es" ? "Descargar Excel" : "Download Excel"}
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground mt-3">
            {language === "es" 
              ? `📋 Incluye: nombre, descripción, categoría, precio, niveles, etapa del embudo y URL`
              : `📋 Includes: name, description, category, pricing, levels, funnel stage and URL`
            }
          </p>
        </CardContent>
      </Card>
    </section>
  );
};

export default FullCatalogExport;
