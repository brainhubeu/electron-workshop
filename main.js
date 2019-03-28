const { app, BrowserWindow, ipcMain, dialog, Menu, Tray } = require('electron');
const notify = require('electron-main-notification');
const fs = require('fs');
const getWeatherData = require('./weather');

let mainWindow;
let tray = null;

const showNotification = async () => {
  const weatherData = await getWeatherData();

  notify('Weather', {
    body: `
Temperature: ${weatherData.now.temperatureLow}, 
Wind direction: ${weatherData.now.windDirectionIcon},
Wind speed: ${weatherData.now.windLow} km/h`,
  });
};
const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 260,
    height: 407,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  mainWindow.loadFile('index.html');

  mainWindow.on('minimize', (event) => {
    event.preventDefault();
    mainWindow.hide();
  });

  mainWindow.on('close', event => {
    if (!app.isQuiting) {
      event.preventDefault();
      mainWindow.hide();
    }

    return false;
  });

  return mainWindow;
};

const createMenu = (window) => {
  const menuTemplate = [
    {
      label: app.getName(),
      submenu: [
        {
          label: 'Save to JSON',
          click: () => {
            window.webContents.send('save-to-json-shortcut');
          },
          accelerator: 'CmdOrCtrl+S',
        },
        {
          role: 'toggleDevTools',
        },
        {
          label: 'Quit',
          click: () => {
            app.exit();
          },
          accelerator: 'CmdOrCtrl+Q',
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
};

const createTray = (window) => {
  const trayMenuTemplate = [
    {
      label: 'Show application',
      click: () => {
        window.show();
      },
    },
    { label: 'Show weather', click: showNotification },
    { type: 'separator' },
    { label: 'Quit', click: () => app.exit(0) },
  ];

  tray = new Tray('icons/cloud.png');
  tray.on('click', showNotification);
  const contextMenu = Menu.buildFromTemplate(trayMenuTemplate);
  tray.setContextMenu(contextMenu);
};

app.on('ready', () => {
  const window = createWindow();
  createMenu(window);
  createTray(window);
});

app.on('window-all-closed', () => {
  // do nothing
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('save-to-json', (event, data) => {
  dialog.showSaveDialog(
    mainWindow,
    {
      title: 'Save to JSON',
      filters: [{
        extensions: ['json'],
        name: 'JavaScript Object Notation',
      }],
      message: 'Save weather data to JSON file',
      showsTagField: false,
    },
    filename => {
      if (filename) {
        const serializedData = JSON.stringify(data, null, 2);
        fs.writeFile(filename, serializedData, (error) => {
          if (error) {
            console.error(error);
          }
        });
      }
    }
  );
});
