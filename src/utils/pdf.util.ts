import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

/**
 * Utility to generate a PDF from an array of objects and trigger download
 */
export const downloadPDF = (data: any[], filename: string, title: string, headers: string[]) => {
    if (!data || !data.length) return;

    const doc = new jsPDF();

    // Add Title
    doc.setFontSize(18);
    doc.text(title, 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);

    // Add Date of export
    doc.text(`Exported on: ${new Date().toLocaleString()}`, 14, 30);

    // Map data to table rows
    const tableRows = data.map(item => headers.map(header => item[header]));

    // Generate table
    autoTable(doc, {
        head: [headers],
        body: tableRows,
        startY: 40,
        theme: 'striped',
        headStyles: { fillColor: [74, 14, 100], textColor: [255, 255, 255] }, // Matches admin theme color #4A0E64
        alternateRowStyles: { fillColor: [245, 245, 245] },
        margin: { top: 40 },
        styles: { fontSize: 8, cellPadding: 2 },
    });

    // Save PDF
    doc.save(filename);
};
