const { app, nativeTheme, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const { spawn }= require('child_process');
const { fileIconToBuffer } = require('file-icon');

const WIDTH = 800;
const HBASE = 60;
let mainWindow;

nativeTheme.themeSource = 'light';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

// An app name can be used
fileIconToBuffer('Safari').then((buffer) => {
  fs.writeFile('safari-icon.png', buffer, ()=>{});
});

const listApps = () => {
  const dir = '/Applications';
  fs.readdir(dir, (err, files) => {
    if (err) {
      console.error(err);
      return;
    }

    for (const file of files) {
      const stats = fs.statSync(path.join(dir, file));
      if (file.endsWith('.app') && stats.isDirectory()) {
        console.log(file);
      }
    }
  })

  const cmd = spawn('open', ['-a', 'Sublime Text.app']);
  cmd.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });
  
  cmd.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });
  
  cmd.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });
};

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: WIDTH,
    height: HBASE,
    resizable: false,
    frame: false,
    transparent: true,
    titleBarStyle: 'customButtonsOnHover',
    trafficLightPosition: { x: -10, y: -10 },
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createWindow();
  listApps();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

ipcMain.handle('hello', (event, text) => {
  const randomInt = Math.floor(Math.random() * 6);
  const res = [];
  for (let i = 0; i < randomInt; i++) res.push({ key: i, value: `hello 0${i}` })
  return res;
});


ipcMain.handle('setRowsNum', (event, n) => {
  mainWindow?.setSize(WIDTH, HBASE * (n + 1), true);
});
