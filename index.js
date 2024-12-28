const {app, BrowserWindow, screen, ipcMain} = require('electron')
const path = require('path')
// const {Menu, Tray} = require('electron')

function updateCountDownDays(event,data) {
    console.log(data)
}

app.on('ready', () => {
    //当app准备好后，执行createWindow创建窗口
    const win = new BrowserWindow({
        width: 1239,//窗口宽度
        height: 100,//窗口高度
        autoHideMenuBar: true,//自动隐藏菜单档
        alwaysOnTop: true,//置顶
        x: 100,//窗口位置x坐标
        y: 0,//窗口位置y坐标
        frame: false,//无边框窗口
        transparent: true,//透明
        skipTaskbar: true,//不显示在任务栏
        webPreferences: {
            nodeIntegration:true
        }
    })

      // 获取屏幕的尺寸
    const screenSize = screen.getPrimaryDisplay().workAreaSize;
    
    // 计算窗口居中的位置
    const winPos = {
        x: (screenSize.width - 1239) / 2,
        y: 0
    };
    
    // 设置窗口的位置
    win.setBounds(winPos);

    //加载一个页面
    win.loadFile('./pages/ClassSchedule.html')
    const index = new BrowserWindow({
        width: 560,//窗口宽度
        height: 400,//窗口高度
        autoHideMenuBar: false,//自动隐藏菜单档
        webPreferences: {
            nodeIntegration:true,
            preload: path.resolve(__dirname, './preload.js')
        }
    })

    ipcMain.on('countDownDayInput', updateCountDownDays)
    index.loadFile('./pages/index.html')
    index.center()
})

// const trayIconPath = path.join(__dirname, 'icon.png');
// const tray = new Tray(trayIconPath);
// const contextMenu = Menu.buildFromTemplate([
//   { label: 'Item1', type: 'normal' },
//   { label: 'Item2', type: 'normal' }
// ]);
// tray.setToolTip('This is my application.');
// tray.setContextMenu(contextMenu);
