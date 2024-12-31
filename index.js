const {app, BrowserWindow, screen, ipcMain} = require('electron')
const path = require('path')
const fs = require('fs')
const { stringify } = require('querystring')
// const {Menu, Tray} = require('electron')

// const writeCountDownDays = fs.creat('./config.json')
function updateCountDownDays(event,data) {
    let year = data.substring(0, 4)
    let month = data.substring(4, 6)
    let day = data.substring(6, 8)
    formatData = year + '-' + month + '-' + day + 'T00:00:00'
    const filePath = path.resolve(__dirname, './config.json')
    const rawData = fs.readFileSync(filePath)
    const jsonData = JSON.parse(rawData)
    jsonData.countDownDays = formatData
    const modifiedData = JSON.stringify(jsonData)
    fs.writeFileSync(filePath, modifiedData)
    // let config = {countDownDay: formatData}
    // fs.appendFileSync('/config.json', JSON.stringify(config))
    console.log(formatData)
}

app.on('ready', () => {
    //当app准备好后，执行createWindow创建窗口
    const win = new BrowserWindow({
        width: 1239,//窗口宽度
        height: 100,//窗口高度
        autoHideMenuBar: false,//自动隐藏菜单档
        alwaysOnTop: true,//置顶
        x: 100,//窗口位置x坐标
        y: 0,//窗口位置y坐标
        frame: false,//无边框窗口
        transparent: false,//透明
        skipTaskbar: false,//不显示在任务栏
        webPreferences: {
            nodeIntegration:true,
            preload: path.resolve(__dirname, './preload.js')
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
