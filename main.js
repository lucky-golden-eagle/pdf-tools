const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const { modifyMetadata, getMetadata } = require('./pdf-utils/metadata');
const { splitBySize } = require('./pdf-utils/splitter');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 1000,
    autoHideMenuBar: true,
    icon: path.join(__dirname, 'assets', 'icon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });
  win.loadFile('renderer/index.html');
  win.webContents.openDevTools();
}

app.whenReady().then(createWindow);

ipcMain.handle('select-pdf', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({ filters: [{ name: 'PDFs', extensions: ['pdf'] }] });
  return canceled ? null : filePaths[0];
});

ipcMain.handle('get-metadata', async (_, inputPath) => {
  return await getMetadata(inputPath);
});

ipcMain.handle('modify-metadata', async (_, inputPath, outputPath, metadata) => {
  await modifyMetadata(inputPath, outputPath, metadata);
  return true;
});

ipcMain.handle('split-pdf', async (_, inputPath, sizeMB) => {
  await splitBySize(inputPath, sizeMB);
  return true;
});