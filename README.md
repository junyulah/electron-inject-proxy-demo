# electron-inject-proxy-start

- inject code before loading  page

- proxy all http requests

- custom scheme

## To Use

`npm install && npm start`

## show code

- inject code before loading page

preload 1.js

```js
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
```

- proxy all http requests 

```js
const protocol = electron.protocol;

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
   doIntercept();
});
```

- custom scheme

```js
protocol.registerStandardSchemes(['foxreport']);
app.on('ready', () => {
    // communication for collection test message
    protocol.registerBufferProtocol('foxreport', (request) => {
        log();
        log('******message collection done!******');
        log(request);
    });
});
```

```html
<a href='foxreport://ok!'>send fox report message</a>
```
