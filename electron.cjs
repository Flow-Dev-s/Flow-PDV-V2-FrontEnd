const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    minWidth: 1024,
    minHeight: 768,
    title: "FLOW-PDV",
    autoHideMenuBar: true, 
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  if (app.isPackaged) {
    mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));
  } else {
    const startUrl = process.env.ELECTRON_START_URL || 'http://localhost:5173';
    mainWindow.loadURL(startUrl);
  }

  

}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});