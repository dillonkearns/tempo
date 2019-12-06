import {exec} from 'child_process';
import {app, globalShortcut, dialog, BrowserWindow, ipcMain, Tray}  from 'electron';
import * as path from 'path';
import * as moment from 'moment';

const assetsDirectory = path.join(__dirname, 'assets');
const rainMp3 = '/Users/dillonkearns/src/github.com/dillonkearns/tempo/assets/rain.mp3'

let tray: Tray;
let endTime: moment.Moment | undefined;
let wasRunningLastTick = false;

let audioPlayer = exec('ls');
function startTimer() {
  endTime = moment().add(25, 'minute') 
  // endTime = moment().add(9, 'second') 

  exec(`osascript -e 'tell application "Spotify" to play'`);
  startAudio();
  
  // tray.on('right-click', toggleWindow)
  tray.on('double-click', app.quit)
}


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
  tray = new Tray(path.join(assetsDirectory, 'tray-icon-small.png'))
  globalShortcut.register('CommandOrControl+Shift+;', startTimer);


  app.on('will-quit', function () {
    if (audioPlayer) {
      audioPlayer.kill();
    }
    globalShortcut.unregisterAll();
  });

  setInterval(function () { 
    if (endTime) {
      let remainingSeconds = endTime.diff(moment(), 'seconds');
      if (remainingSeconds > 0) {
        tray.setTitle(secondsToTime(remainingSeconds));
        wasRunningLastTick = true;
      } else {
        tray.setTitle('');
        if (wasRunningLastTick) {
          onTimerStop();
        }
        wasRunningLastTick = false;
      }
  } else {
      tray.setTitle('');
      wasRunningLastTick = false;
  }
  }, 100);
});

function startAudio() {
  if (audioPlayer) {
    audioPlayer.kill();
  }
  audioPlayer = exec(`afplay ${rainMp3}`, function () { });
}

function onTimerStop() {
    audioPlayer.kill();
    exec(`osascript -e 'tell application "Spotify" to pause'`);
}

function secondsToTime(seconds: number): string {
  let minutesLeft = Math.floor(seconds / 60);
  let secondsLeft = seconds % 60;

  // return `${minutesLeft}:${secondsLeft}`
  return str_pad_left(minutesLeft,'0',2)+':'+str_pad_left(secondsLeft,'0',2);
}

function str_pad_left(string: number,pad: string,length: number) {
  return (new Array(length+1).join(pad)+string).slice(-length);
}
