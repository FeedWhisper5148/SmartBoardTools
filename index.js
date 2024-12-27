const {app, BrowserWindow} = require('electron')
// const path = require('path')
// const {Menu, Tray} = require('electron')

app.on('ready', () => {
    //当app准备好后，执行createWindow创建窗口
    const win = new BrowserWindow({
        width: 1280,//窗口宽度
        height: 100,//窗口高度
        autoHideMenuBar: true,//自动隐藏菜单档
        alwaysOnTop: true,//置顶
        x: 0,//窗口位置x坐标
        y: 0,//窗口位置y坐标
        frame: false,//无边框窗口
        transparent: true,//透明
        skipTaskbar: true,//不显示在任务栏
    })
    //加载一个页面
    win.loadFile('./pages/index.html')
})

// const trayIconPath = path.join(__dirname, 'icon.png');
// const tray = new Tray(trayIconPath);
// const contextMenu = Menu.buildFromTemplate([
//   { label: 'Item1', type: 'normal' },
//   { label: 'Item2', type: 'normal' }
// ]);
// tray.setToolTip('This is my application.');
// tray.setContextMenu(contextMenu);
