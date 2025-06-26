const fs = require('fs');
const path = require('path');
const { PDFDocument } = require('pdf-lib');

async function splitBySize(inputPath, targetSizeMB, outputDir = null) {
  const targetSizeBytes = targetSizeMB * 1024 * 1024;
  const pdfBytes = fs.readFileSync(inputPath);
  const fullDoc = await PDFDocument.load(pdfBytes);
  const totalPages = fullDoc.getPageCount();

  const baseName = path.basename(inputPath, '.pdf');
  const outputPath = outputDir || path.dirname(inputPath);

  let chunkIndex = 1;
  let currentPdf = await PDFDocument.create();
  let currentSizeEstimate = 0;

  for (let i = 0; i < totalPages; i++) {
    // Simulate adding the page to estimate its size
    const tempPdf = await PDFDocument.create();
    const [tempPage] = await tempPdf.copyPages(fullDoc, [i]);
    tempPdf.addPage(tempPage);
    const tempBytes = await tempPdf.save();

    const [page] = await currentPdf.copyPages(fullDoc, [i]);
    currentPdf.addPage(page);
    currentSizeEstimate += tempBytes.length;

    if (currentSizeEstimate >= targetSizeBytes && currentPdf.getPageCount() > 0) {
      const outPath = path.join(outputPath, `${baseName}-part-${chunkIndex}.pdf`);
      const savedBytes = await currentPdf.save();
      fs.writeFileSync(outPath, savedBytes);
      console.log(`Saved ${outPath} (${(savedBytes.length / 1024 / 1024).toFixed(2)} MB)`);
      
      chunkIndex++;
      currentPdf = await PDFDocument.create();
      currentSizeEstimate = 0;
    }
  }

  // Save remaining pages
  if (currentPdf.getPageCount() > 0) {
    const outPath = path.join(outputPath, `${baseName}-part-${chunkIndex}.pdf`);
    const savedBytes = await currentPdf.save();
    fs.writeFileSync(outPath, savedBytes);
    console.log(`Saved ${outPath} (${(savedBytes.length / 1024 / 1024).toFixed(2)} MB)`);
  }
}

module.exports = { splitBySize };
