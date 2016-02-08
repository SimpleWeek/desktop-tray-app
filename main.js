/* eslint strict: 0 */
'use strict';

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;
const crashReporter = electron.crashReporter;
const ipc = electron.ipcMain;

const path = require('path');
const Tray = require('tray');
const AutoLaunch = require('auto-launch');
const GithubReleases = require('electron-gh-releases');
const Positioner = require('electron-positioner');
const dialog = require('dialog');
const iconIdle = path.join(__dirname, 'app/images', 'tray-idle.png');
const iconActive = path.join(__dirname, 'app/images', 'tray-active.png');

// Utilities
const isDarwin = (process.platform === 'darwin');
const isLinux = (process.platform === 'linux');
const isWindows = (process.platform === 'win32');

const autoStart = new AutoLaunch({
  name: 'SimpleWeek',
  path: process.execPath.match(/.*?\.app/)[0]
});

crashReporter.start();

if (process.env.NODE_ENV === 'development') {
  require('electron-debug')();
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});


app.on('ready', () => {
  let cachedBounds;
  const appIcon = new Tray(iconIdle);
  const windowPosition = (isWindows) ? 'trayBottomCenter' : 'trayCenter';

  initWindow();

  appIcon.on('click', function (e, bounds) {
    if (e.altKey || e.shiftKey || e.ctrlKey || e.metaKey) {
      return hideWindow();
    }

    if (appIcon.window && appIcon.window.isVisible()) {
      return hideWindow();
    }

    cachedBounds = bounds || cachedBounds;

    showWindow(cachedBounds);
  });

  function initWindow() {
    const defaults = {
      width: 400,
      height: 350,
      show: false,
      frame: false,
      resizable: false,
      webPreferences: {
        overlayScrollbars: true
      }
    };

    appIcon.window = new BrowserWindow(defaults);
    appIcon.positioner = new Positioner(appIcon.window);

    if (process.env.HOT) {
      appIcon.window.loadURL(`file://${__dirname}/app/hot-dev-app.html`);
    } else {
      appIcon.window.loadURL(`file://${__dirname}/app/app.html`);
    }

    appIcon.window.on('blur', hideWindow);
    appIcon.window.setVisibleOnAllWorkspaces(true);

    initMenu();
    checkAutoUpdate(false);
  }

  function showWindow(trayPos) {
    let noBoundsPosition;
    if (!isDarwin && trayPos !== undefined) {
      const displaySize = electron.screen.getPrimaryDisplay().workAreaSize;
      let trayPosX = trayPos.x;
      let trayPosY = trayPos.y;

      if (isLinux) {
        const cursorPointer = electron.screen.getCursorScreenPoint();
        trayPosX = cursorPointer.x;
        trayPosY = cursorPointer.y;
      }

      const x = (trayPosX < (displaySize.width / 2)) ? 'left' : 'right';
      const y = (trayPosY < (displaySize.height / 2)) ? 'top' : 'bottom';

      if (x === 'right' && y === 'bottom') {
        noBoundsPosition = (isWindows) ? 'trayBottomCenter' : 'bottomRight';
      } else if (x === 'left' && y === 'bottom') {
        noBoundsPosition = 'bottomLeft';
      } else if (y === 'top') {
        noBoundsPosition = (isWindows) ? 'trayCenter' : 'topRight';
      }
    } else if (trayPos === undefined) {
      noBoundsPosition = (isWindows) ? 'bottomRight' : 'topRight';
    }

    const position = appIcon.positioner.calculate(noBoundsPosition || windowPosition, trayPos);
    appIcon.window.setPosition(position.x, position.y);
    appIcon.window.show();
  }

  function initMenu() {
    const template = [{
      label: 'Edit',
      submenu: [
        {
          label: 'Copy',
          accelerator: 'Command+C',
          selector: 'copy:'
        },
        {
          label: 'Paste',
          accelerator: 'Command+V',
          selector: 'paste:'
        },
        {
          label: 'Select All',
          accelerator: 'Command+A',
          selector: 'selectAll:'
        }
      ]
    }];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  }

  function hideWindow() {
    if (!appIcon.window) return;
    appIcon.window.hide();
  }

  function checkAutoUpdate(showAlert) {
    const autoUpdateOptions = {
      repo: 'ekonstantinidis/gitify',
      currentVersion: app.getVersion()
    };

    const update = new GithubReleases(autoUpdateOptions, function (autoUpdater) {
      autoUpdater
        .on('error', function (/* event, message */) {
          // console.log('ERRORED.');
          // console.log('Event: ' + JSON.stringify(event) + '. MESSAGE: ' + message);
        })
        .on('update-downloaded', function (event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) {
          // console.log('Update downloaded');
          confirmAutoUpdate(quitAndUpdate);
        });
    });

    // Check for updates
    update.check(function (err, status) {
      if (err || !status) {
        if (showAlert) {
          dialog.showMessageBox({
            type: 'info',
            buttons: ['Close'],
            title: 'No update available',
            message: 'You are currently running the latest version of Gitify.'
          });
        }
        app.dock.hide();
      }

      if (!err && status) {
        update.download();
      }
    });
  }

  function confirmAutoUpdate(quitAndUpdate) {
    dialog.showMessageBox({
      type: 'question',
      buttons: ['Update & Restart', 'Cancel'],
      title: 'Update Available',
      cancelId: 99,
      message: 'There is an update available. Would you like to update Gitify now?'
    }, function (response) {
      // console.log('Exit: ' + response);
      app.dock.hide();
      if (response === 0) {
        quitAndUpdate();
      }
    });
  }

  ipc.on('reopen-window', function () {
    showWindow(cachedBounds);
  });

  ipc.on('update-icon', function (event, arg) {
    if (arg === 'TrayActive') {
      appIcon.setImage(iconActive);
    } else {
      appIcon.setImage(iconIdle);
    }
  });

  ipc.on('startup-enable', function () {
    autoStart.enable();
  });

  ipc.on('startup-disable', function () {
    autoStart.disable();
  });

  ipc.on('check-update', function () {
    checkAutoUpdate(true);
  });

  ipc.on('app-quit', function () {
    app.quit();
  });

  appIcon.setToolTip('GitHub Notifications on your menu bar.');

  if (process.env.NODE_ENV === 'development') {
    BrowserWindow.addDevToolsExtension('node_modules/remotedev-extension/dist');
    appIcon.window.openDevTools();
  }
});
