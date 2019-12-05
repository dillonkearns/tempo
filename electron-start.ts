// const {app, globalShortcut, dialog, BrowserWindow, ipcMain, Tray} = require('electron')
import {exec} from 'child_process';
import {app, globalShortcut, dialog, BrowserWindow, ipcMain, Tray}  from 'electron';
import * as moment from 'moment';
const path = require('path')
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is GCed.

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform != 'darwin') {
    app.quit();
  }
});
let tray: Tray;
let timeLeft = 25 * 60;


function startTimer() {
  
  exec('afplay ./rain.mp3', function() {})
  timeLeft = 25 * 60;
  setInterval(() => {
    tray.setTitle(secondsToTime(timeLeft));
    timeLeft--;
  }, 1000);
  
  // tray.on('right-click', toggleWindow)
  // tray.on('double-click', toggleWindow)
  // tray.on('click', function (event) {
  //   toggleWindow()
  //
  //   // Show devtools when command clicked
  //   if (window.isVisible() && process.defaultApp && event.metaKey) {
  //     window.openDevTools({mode: 'detach'})
  //   }
  // })
}


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
  const assetsDirectory = path.join(__dirname, 'assets');
  tray = new Tray(path.join(assetsDirectory, 'tray-icon-small.png'))
  globalShortcut.register('CommandOrControl+Shift+;', startTimer);


  app.on('will-quit', function () {
    globalShortcut.unregisterAll();
  });
});

function secondsToTime(seconds: number): string {
  let minutesLeft = Math.floor(seconds / 60);
  let secondsLeft = seconds % 60;

  return `${minutesLeft}:${secondsLeft}`
}