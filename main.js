const { app, BrowserWindow, ipcMain, dialog, Menu } = require('electron');
const fs = require('fs');

let mainWindow;

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

  mainWindow.on('closed', () => {
    mainWindow = null;
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

app.on('ready', () => {
  const window = createWindow();
  createMenu(window);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
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
