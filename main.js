const electron = require('electron');

// Module to control application life.
const app = electron.app;

// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

const protocol = electron.protocol;

protocol.registerStandardSchemes(['foxreport']);

const log = console.log; // eslint-disable-line

let doIntercept = () => {
    protocol.interceptHttpProtocol('http', (request, callback) => {
        log('*********record request**********');
        log(request);

        callback(request);
        protocol.uninterceptProtocol('http', () => {
            doIntercept();
        });
    }, () => {});
};

app.on('ready', () => {
    // communication for collection test message
    protocol.registerBufferProtocol('foxreport', (request) => {
        log();
        log('******message collection done!******');
        log(request);
    });
    doIntercept();
});

function createWindow () {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: __dirname + '/1.js', // abs path
            plugins: true,
            webSecurity: false,
            allowDisplayingInsecureContent: true,
            allowRunningInsecureContent: true,
            experimentalFeatures: true,
            blinkFeatures: 'Touch'
        }
    });

    let webContents = mainWindow.webContents;

    // and load the index.html of the app.
    //  mainWindow.loadURL(`file://${__dirname}/index.html`)

    mainWindow.loadURL('http://m.baidu.com/');

    // must after loadURL
    webContents.enableDeviceEmulation({
        screenPosition: 'mobile',
        screenSize: {
            width: 480,
            height: 640
        },
        deviceScaleFactor: 0,
        viewPosition: {
            x: 0,
            y: 0
        },
        viewSize: {
            width: 480,
            height: 640
        },
        fitToView: false,
        offset: {
            x: 0,
            y: 0
        }
    });

    // Open the DevTools.

    // maybe: openDevTools confict with enableEnumlation api
    //mainWindow.webContents.openDevTools();

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow();
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
