// const {app, globalShortcut, dialog, BrowserWindow, ipcMain, Tray} = require('electron')
import {exec} from 'child_process';
import {app, globalShortcut, dialog, BrowserWindow, ipcMain, Tray}  from 'electron';
import * as path from 'path';


const assetsDirectory = path.join(__dirname, 'assets');

let tray: Tray;
let timeLeft = 25 * 60;

let audioPlayer = exec('ls');
function startTimer() {
  // const rainMp3 = path.join(assetsDirectory, 'rain.mp3')
  exec(`osascript -e 'tell application "Spotify" to play'`);
  const rainMp3 = '/Users/dillonkearns/src/github.com/dillonkearns/tempo/assets/rain.mp3'
  
  
  // exec(rainMp3, (err, stdout, stderr) => {
  //   if (err) {
  //     dialog.showMessageBox({
  //       type: 'info',
  //       message: 'Error!',
  //       detail: `${err}`,
  //       buttons: ['OK']
  //     });
  
  //     console.error(err);
  //     return;
  //   }
  //   console.log(stdout);
  // });
  audioPlayer = exec(`afplay ${rainMp3}`, function() {});
  app.on('will-quit', function () {
    audioPlayer.kill();
  });
  timeLeft = 25 * 60;
  // timeLeft = 10;
  tickTimer();
  // setInterval(() => {
  //   tray.setTitle(secondsToTime(timeLeft));
  //   timeLeft--;
  // }, 1000);
  
  // tray.on('right-click', toggleWindow)
  tray.on('double-click', app.quit)
  // tray.on('click', function (event) {
  //   toggleWindow()
  //
  //   // Show devtools when command clicked
  //   if (window.isVisible() && process.defaultApp && event.metaKey) {
  //     window.openDevTools({mode: 'detach'})
  //   }
  // })
}

function tickTimer() {
    timeLeft--;
    if (timeLeft > 0) {
      tray.setTitle(secondsToTime(timeLeft));
      setTimeout(tickTimer, 1000);
    } else {
      tray.setTitle('');
      audioPlayer.kill();
      exec(`osascript -e 'tell application "Spotify" to pause'`);
    }
}


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
  tray = new Tray(path.join(assetsDirectory, 'tray-icon-small.png'))
  globalShortcut.register('CommandOrControl+Shift+;', startTimer);


  app.on('will-quit', function () {
    globalShortcut.unregisterAll();
  });
});

function secondsToTime(seconds: number): string {
  let minutesLeft = Math.floor(seconds / 60);
  let secondsLeft = seconds % 60;

  // return `${minutesLeft}:${secondsLeft}`
  return str_pad_left(minutesLeft,'0',2)+':'+str_pad_left(secondsLeft,'0',2);
}

function str_pad_left(string: number,pad: string,length: number) {
  return (new Array(length+1).join(pad)+string).slice(-length);
}
