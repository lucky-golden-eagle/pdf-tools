let selectedPDF = '';

async function selectPDF() {
  const file = await window.api.selectPDF();
  if (file) {
    selectedPDF = file;
    const metadata = await window.api.getMetadata(file);
    document.getElementById('title').value = metadata.title;
    document.getElementById('author').value = metadata.author;
    document.getElementById('subject').value = metadata.subject;
    document.getElementById('keywords').value = metadata.keywords;
    document.getElementById('created').value = metadata.created;
    document.getElementById('modified').value = metadata.modified;

    document.getElementById('pdf-title').value = metadata.fileName;
    document.getElementById('pdf-pages').value = metadata.pages;
    document.getElementById('pdf-filesize').value = metadata.filesize;

    document.getElementById('tool-tabs').classList.remove('hidden');
    document.getElementById('pdf-info').classList.remove('hidden');
    showTab('metadata');
  }
}

function showTab(tab) {
  document.getElementById('metadata-tab').classList.add('hidden');
  document.getElementById('split-tab').classList.add('hidden');
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('font-semibold', 'border-b-2', 'text-blue-600', 'border-blue-600'));

  document.getElementById(`${tab}-tab`).classList.remove('hidden');
  const tabIndex = tab === 'metadata' ? 0 : 1;
  document.querySelectorAll('.tab-btn')[tabIndex].classList.remove('text-gray-600');
  document.querySelectorAll('.tab-btn')[tabIndex].classList.add('font-semibold', 'border-b-2', 'text-blue-600', 'border-blue-600');
}

async function updateMetadata() {
  if (!selectedPDF) return showAlert('Select a PDF first');
  const metadata = {
    title: document.getElementById('title').value,
    author: document.getElementById('author').value,
    subject: document.getElementById('subject').value,
    keywords: document.getElementById('keywords').value,
    created: document.getElementById('created').value,
    modified: document.getElementById('modified').value,
  };
  const outputPath = selectedPDF.replace(/\.pdf$/, '-modified.pdf');
  await window.api.modifyMetadata(selectedPDF, outputPath, metadata);
  showAlert('Metadata updated and saved to ' + outputPath);
}

async function splitPDF() {
  if (!selectedPDF) return showAlert('Select a PDF first');
  const size = parseFloat(document.getElementById('split-size').value);
  if (!size) return showAlert('Enter a valid file size');

  await window.api.splitPDF(selectedPDF, size);
  showAlert('PDF split and saved in ' + outputDir);
}

function showAlert(message, type = 'error') {
  const alertBox = document.getElementById('alert-box');
  const typeClasses = {
    success: 'bg-green-100 border-green-400 text-green-700',
    error: 'bg-red-100 border-red-400 text-red-700',
    warning: 'bg-yellow-100 border-yellow-400 text-yellow-700',
  };

  alertBox.className = `fixed top-5 right-5 px-4 py-3 rounded shadow-lg z-50 ${typeClasses[type]}`;
  alertBox.innerHTML = `
    <strong class="font-bold">${type.charAt(0).toUpperCase() + type.slice(1)}!</strong>
    <span class="block sm:inline">${message}</span>
  `;
  alertBox.classList.remove('hidden');

  setTimeout(() => {
    alertBox.classList.add('hidden');
  }, 3000); // auto-hide after 3s
}
