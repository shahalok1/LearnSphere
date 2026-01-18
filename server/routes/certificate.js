const express = require("express");
const PDFDocument = require("pdfkit");
const router = express.Router();

router.get("/:userName/:courseTitle", (req, res) => {
  const { userName, courseTitle } = req.params;

  const doc = new PDFDocument({ size: "A4", margin: 50 });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=certificate-${courseTitle}.pdf`
  );

  doc.pipe(res);

  doc
    .fontSize(26)
    .text("Certificate of Completion", { align: "center" })
    .moveDown(2);

  doc
    .fontSize(16)
    .text("This is to certify that", { align: "center" })
    .moveDown(1);

  doc
    .fontSize(22)
    .text(userName, { align: "center", underline: true })
    .moveDown(1);

  doc
    .fontSize(16)
    .text("has successfully completed the course", { align: "center" })
    .moveDown(1);

  doc
    .fontSize(20)
    .text(courseTitle, { align: "center", italics: true })
    .moveDown(3);

  doc
    .fontSize(14)
    .text(`Date: ${new Date().toLocaleDateString()}`, { align: "center" })
    .moveDown(2);

  doc.text("LearnSphere", { align: "center" });

  doc.end();
});

module.exports = router;
