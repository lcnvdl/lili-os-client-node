const { app, BrowserWindow } = require('electron');
const path = require('path');
const FsDriver = require('./server/fs-driver');
const MainServer = require("./server/main-server");

if (require('electron-squirrel-startup')) {
  app.quit();
}

const server = new MainServer();
const driver = new FsDriver();

async function sendAsync(promise, res) {
  try {
    const result = await promise;
    res.json(result);
  }
  catch (err) {
    res.status(500).send(err + "");
  }
}

server.on("mount", ({ res }) => {
  console.log(res);
  res.json({ readOnly: false });
});

server.on("exists", ({ body, res }) => {
  const result = driver.exists(body.path);
  res.json(result);
});

server.on("list", ({ body, res }) => {
  const promise = driver.list(body.path);
  sendAsync(promise, res);
});

server.on("read", ({ body, res }) => {
  const result = driver.read(body.path);
  res.json(result);
});

server.on("write", ({ body, res }) => {
  const result = driver.write(body.path, body.content);
  res.json(result);
});

server.start().then(() => {

});

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
