const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

function formatDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'short',
    timeStyle: 'medium'
  }).format(date);
}

async function modifyMetadata(inputPath, outputPath, metadata) {
  const existingPdfBytes = fs.readFileSync(inputPath);
  const pdfDoc = await PDFDocument.load(existingPdfBytes);

  const { title, author, subject, keywords, created, modified } = metadata;
  pdfDoc.setTitle(title || '');
  pdfDoc.setAuthor(author || '');
  pdfDoc.setSubject(subject || '');
  pdfDoc.setKeywords(keywords ? keywords.split(',') : []);
  pdfDoc.setCreationDate(new Date(created) || '');
  pdfDoc.setModificationDate(new Date(modified) || '');
  
  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(outputPath, pdfBytes);
}

async function getMetadata(inputPath) {
  const pdfBytes = fs.readFileSync(inputPath);
  const pdfDoc = await PDFDocument.load(pdfBytes);

  return {
    title: pdfDoc.getTitle() || '',
    author: pdfDoc.getAuthor() || '',
    subject: pdfDoc.getSubject() || '',
    keywords: (pdfDoc.getKeywords() || []).join(', '),
    created: formatDate(pdfDoc.getCreationDate()) || '',
    modified: formatDate(pdfDoc.getModificationDate()) || '',
    pages: `${pdfDoc.getPageCount()} pages`,
    filesize: `${parseFloat(pdfBytes.length / 1024 / 1024).toFixed(2)} MB`,
    fileName: `${path.basename(inputPath)}`,
  };
}

module.exports = { modifyMetadata, getMetadata };
