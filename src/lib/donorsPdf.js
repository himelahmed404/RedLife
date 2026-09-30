// Build and download a PDF of donor search results.
// jsPDF is imported on click, so it never weighs down the search page itself.
export async function downloadDonorsPdf(donors, filters) {
  const [{ jsPDF }, { default: autoTable }] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable"),
  ]);

  const doc = new jsPDF();
  const filterText = [
    `Blood group: ${filters.bloodGroup || "Any"}`,
    `District: ${filters.district || "Any"}`,
    `Upazila: ${filters.upazila || "Any"}`,
  ].join("   |   ");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(193, 18, 31);
  doc.text("RedLife", 14, 18);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(16, 20, 28);
  doc.text("Donor search results", 14, 26);

  doc.setFontSize(9);
  doc.setTextColor(92, 102, 117);
  doc.text(filterText, 14, 33);
  doc.text(`${donors.length} donors  |  Generated ${new Date().toLocaleString("en-GB")}`, 14, 38);

  autoTable(doc, {
    startY: 44,
    head: [["#", "Name", "Group", "District", "Upazila", "Email", "Phone"]],
    body: donors.map((d, i) => [
      i + 1,
      d.name || "",
      d.bloodGroup || "",
      d.district || "",
      d.upazila || "",
      d.email || "",
      d.number || "",
    ]),
    styles: { fontSize: 9, cellPadding: 2.5, textColor: [16, 20, 28] },
    headStyles: { fillColor: [193, 18, 31], textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [245, 247, 249] },
    columnStyles: { 0: { cellWidth: 8 }, 2: { cellWidth: 17 } },
  });

  const group = (filters.bloodGroup || "all").replace("+", "pos").replace("-", "neg");
  doc.save(`redlife-donors-${group}.pdf`);
}
