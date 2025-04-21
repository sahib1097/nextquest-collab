
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Roadmap, RoadmapItem, ProjectLinkOption } from '@/types/roadmap';

export const exportRoadmapToPDF = (roadmap: Roadmap) => {
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'pt',
    format: 'a4'
  });
  
  // Add title with startup style
  pdf.setFontSize(28);
  pdf.setTextColor(89, 65, 169); // Purple
  pdf.text(roadmap.name, 40, 60);
  
  // Add subtitle and date
  pdf.setFontSize(14);
  pdf.setTextColor(127, 140, 141);
  pdf.text(`Strategic Roadmap - Generated ${new Date().toLocaleDateString()}`, 40, 85);

  // Add horizontal line
  pdf.setDrawColor(230, 230, 230);
  pdf.setLineWidth(1);
  pdf.line(40, 95, pdf.internal.pageSize.width - 40, 95);
  
  // Helper to calculate progress
  const calculateProgress = (item: RoadmapItem) => {
    if (!item.linkedProjects?.length) return 0;
    
    // Handle different types of linkedProjects
    if (typeof item.linkedProjects[0] === 'object') {
      // It's a ProjectLinkOption[] type
      const linkedProjects = item.linkedProjects as unknown as ProjectLinkOption[];
      const completedProjects = linkedProjects.filter(p => p.status && p.status.toLowerCase() === 'completed').length;
      return Math.round((completedProjects / linkedProjects.length) * 100);
    } else {
      // It's a string[] type - we can't determine status from just IDs
      return 0;
    }
  };

  // Group items by quarter and year
  const groupedItems = roadmap.items.reduce((acc, item) => {
    const date = new Date(item.startDate);
    const key = `${date.getFullYear()} Q${Math.floor(date.getMonth() / 3) + 1}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {} as Record<string, RoadmapItem[]>);

  // Sort quarters
  const sortedQuarters = Object.keys(groupedItems).sort();

  let yOffset = 120;
  
  // Add summary section
  pdf.setFontSize(16);
  pdf.setTextColor(59, 59, 59);
  pdf.text("Roadmap Summary", 40, yOffset);
  yOffset += 25;
  
  // Calculate overall progress
  let totalItems = 0;
  let totalProgress = 0;
  
  roadmap.items.forEach(item => {
    const progress = item.progress || calculateProgress(item);
    if (progress > 0) {
      totalItems++;
      totalProgress += progress;
    }
  });
  
  const averageProgress = totalItems > 0 ? Math.round(totalProgress / totalItems) : 0;
  
  // Summary stats
  pdf.setFontSize(12);
  pdf.text(`Total Initiatives: ${roadmap.items.length}`, 60, yOffset);
  yOffset += 20;
  pdf.text(`Overall Progress: ${averageProgress}%`, 60, yOffset);
  yOffset += 20;
  pdf.text(`Active Time Periods: ${sortedQuarters.length}`, 60, yOffset);
  yOffset += 40;

  // Add quarters and items
  sortedQuarters.forEach((quarter) => {
    const items = groupedItems[quarter];
    
    // Add quarter header with modern styling
    pdf.setFillColor(249, 250, 251);
    pdf.rect(40, yOffset - 15, pdf.internal.pageSize.width - 80, 30, 'F');
    pdf.setFontSize(14);
    pdf.setTextColor(52, 73, 94);
    pdf.text(quarter, 50, yOffset);
    yOffset += 30;
    
    // Add items for this quarter with improved styling
    items.forEach(item => {
      const progress = item.progress || calculateProgress(item);
      
      // Progress bar background
      pdf.setFillColor(240, 240, 240);
      pdf.rect(60, yOffset - 8, 400, 10, 'F');
      
      // Progress bar fill
      if (progress > 0) {
        // Fix: Convert RGB array to individual parameters
        const progressColor = progress === 100 ? [39, 174, 96] : [243, 156, 18];
        pdf.setFillColor(progressColor[0], progressColor[1], progressColor[2]);
        pdf.rect(60, yOffset - 8, Math.min(progress * 4, 400), 10, 'F');
      }
      
      // Item color indicator
      const colorHex = item.color || '#9b87f5';
      // Parse hex color to RGB for jsPDF
      const r = parseInt(colorHex.substring(1, 3), 16);
      const g = parseInt(colorHex.substring(3, 5), 16);
      const b = parseInt(colorHex.substring(5, 7), 16);
      
      pdf.setFillColor(r, g, b);
      pdf.rect(40, yOffset - 12, 15, 18, 'F');
      
      // Item title and description
      pdf.setFontSize(12);
      pdf.setTextColor(44, 62, 80);
      pdf.text(item.title, 70, yOffset);
      
      // Progress text
      // Fix: Convert RGB array to individual parameters
      if (progress === 100) {
        pdf.setTextColor(39, 174, 96); // Green for completed
      } else {
        pdf.setTextColor(243, 156, 18); // Orange for in progress
      }
      pdf.text(`${progress}%`, 470, yOffset);
      
      // Description
      pdf.setFontSize(10);
      pdf.setTextColor(127, 140, 141);
      const description = pdf.splitTextToSize(item.description, 400);
      pdf.text(description, 70, yOffset + 15);
      
      // Calculate spacing based on description length
      const descriptionLines = description.length || 1;
      yOffset += 25 + (descriptionLines * 12);
      
      // Add info about linked projects if any
      if (item.linkedProjects?.length) {
        pdf.setFontSize(9);
        pdf.setTextColor(89, 65, 169);
        pdf.text(`Linked Projects: ${item.linkedProjects.length}`, 70, yOffset);
        yOffset += 15;
      } else {
        yOffset += 5;
      }
    });
    
    // Add spacing between quarters
    yOffset += 20;
    
    // Add page break if needed
    if (yOffset > pdf.internal.pageSize.height - 100 && sortedQuarters.indexOf(quarter) < sortedQuarters.length - 1) {
      pdf.addPage();
      yOffset = 60;
    }
  });
  
  // Add footer - Fix: Get the page count properly
  const pageCount = pdf.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.setTextColor(150, 150, 150);
    pdf.text(`${roadmap.name} - Page ${i} of ${pageCount}`, pdf.internal.pageSize.width / 2, pdf.internal.pageSize.height - 20, { align: 'center' });
  }
  
  pdf.save(`${roadmap.name.toLowerCase().replace(/\s+/g, '-')}-roadmap-${new Date().toISOString().split('T')[0]}.pdf`);
};
