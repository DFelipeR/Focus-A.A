const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1300,
    height: 850,
    titleBarStyle: 'hiddenInset', // Borde moderno
    webPreferences: {
      nodeIntegration: true,
    },
  });

  // En desarrollo carga localhost, en producción el build HTML
  const startUrl = process.env.ELECTRON_START_URL || `file://${path.join(__dirname, '../dist/index.html')}`;
  win.loadURL(startUrl);
}

app.whenReady().then(createWindow);