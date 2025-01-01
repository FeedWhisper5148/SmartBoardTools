const { app, BrowserWindow, screen, ipcMain } = require('electron')
const path = require('path')
const fs = require('fs')
const { stringify } = require('querystring')
// const {Menu, Tray} = require('electron')

// 获取用户数据目录的路径
const userFile = app.getPath('userData')
const filePath = path.join(userFile, 'SmartBoardTools.json')

// 判断数据文件是否存在，若不存在则创建默认的数据文件
function writeDefalutData() {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, '{"countDownDays":"2025-03-24T00:00:00","classSchedule":[[{"start":"8:00","end":"8:40","course":"生"},{"start":"8:50","end":"9:30","course":"地"},{"start":"10:00","end":"10:40","course":"语"},{"start":"10:50","end":"11:30","course":"体"},{"start":"14:00","end":"14:40","course":"物"},{"start":"14:50","end":"15:30","course":"数"},{"start":"15:40","end":"16:20","course":"英"},{"start":"16:30","end":"17:10","course":"化"},{"start":"18:40","end":"19:50","course":"英"},{"start":"20:00","end":"21:10","course":"语"},{"start":"21:20","end":"10:30","course":"自"}],[{"start":"8:00","end":"8:40","course":"物"},{"start":"8:50","end":"9:30","course":"英"},{"start":"10:00","end":"10:40","course":"数"},{"start":"10:50","end":"11:30","course":"数"},{"start":"14:00","end":"14:40","course":"/"},{"start":"14:50","end":"15:30","course":"/"},{"start":"15:40","end":"16:20","course":"/"},{"start":"16:30","end":"17:10","course":"/"},{"start":"18:40","end":"19:50","course":"物"},{"start":"20:00","end":"21:10","course":"物"},{"start":"21:20","end":"10:30","course":"物"}],[{"start":"8:00","end":"8:40","course":"语"},{"start":"8:50","end":"9:30","course":"化"},{"start":"10:00","end":"10:40","course":"数"},{"start":"10:50","end":"11:30","course":"信"},{"start":"14:00","end":"14:40","course":"英"},{"start":"14:50","end":"15:30","course":"英"},{"start":"15:40","end":"16:20","course":"生"},{"start":"16:30","end":"17:10","course":"物"},{"start":"18:40","end":"19:50","course":"自"},{"start":"20:00","end":"21:10","course":"自"},{"start":"21:20","end":"10:30","course":"自"}],[{"start":"8:00","end":"8:40","course":"数"},{"start":"8:50","end":"9:30","course":"化"},{"start":"10:00","end":"10:40","course":"物"},{"start":"10:50","end":"11:30","course":"英"},{"start":"14:00","end":"14:40","course":"英"},{"start":"14:50","end":"15:30","course":"英"},{"start":"15:40","end":"16:20","course":"英"},{"start":"16:30","end":"17:10","course":"物"},{"start":"18:40","end":"19:50","course":"物"},{"start":"20:00","end":"21:10","course":"物"},{"start":"21:20","end":"10:30","course":"物"}],[{"start":"8:00","end":"8:40","course":"英"},{"start":"8:50","end":"9:30","course":"英"},{"start":"10:00","end":"10:40","course":"英"},{"start":"10:50","end":"11:30","course":"英"},{"start":"14:00","end":"14:40","course":"英"},{"start":"14:50","end":"15:30","course":"英"},{"start":"15:40","end":"16:20","course":"英"},{"start":"16:30","end":"17:10","course":"英"},{"start":"18:40","end":"19:50","course":"生"},{"start":"20:00","end":"21:10","course":"物"},{"start":"21:20","end":"10:30","course":"物"}],[{"start":"8:00","end":"8:40","course":"英"},{"start":"8:50","end":"9:30","course":"化"},{"start":"10:00","end":"10:40","course":"英"},{"start":"10:50","end":"11:30","course":"数"},{"start":"14:00","end":"14:40","course":"物"},{"start":"14:50","end":"15:30","course":"语"},{"start":"15:40","end":"16:20","course":"物"},{"start":"16:30","end":"17:10","course":"物"},{"start":"18:40","end":"19:50","course":"语"},{"start":"20:00","end":"20:25","course":"物"},{"start":"21:20","end":"10:30","course":"数"}],[{"start":"8:00","end":"8:40","course":"英"},{"start":"8:50","end":"9:30","course":"化"},{"start":"10:00","end":"10:40","course":"英"},{"start":"10:50","end":"11:30","course":"数"},{"start":"14:00","end":"14:40","course":"物"},{"start":"14:50","end":"15:30","course":"语"},{"start":"15:40","end":"16:20","course":"物"},{"start":"16:30","end":"17:10","course":"物"},{"start":"18:40","end":"19:50","course":"语"},{"start":"20:00","end":"20:25","course":"物"},{"start":"21:20","end":"10:30","course":"数"}]]}', 'utf8'); // 创建空文件
        console.log(`File ${filePath} created.`);
    } else {
        console.log(`File ${filePath} already exists.`);
    }
}
writeDefalutData()

// 软件打开时读取文件
const rawData = fs.readFileSync(filePath)
const jsonData = JSON.parse(rawData)

// 重新读取文件
function readDataAgain() {
    const rawData = fs.readFileSync(filePath)
    const jsonData = JSON.parse(rawData)
}

// 文件内容发送改动时，重新读取
fs.watch(filePath, readDataAgain())

// 修改倒数日
function updateCountDownDays(event, data) {
    let year = data.substring(0, 4)
    let month = data.substring(4, 6)
    let day = data.substring(6, 8)
    formatData = year + '-' + month + '-' + day + 'T00:00:00'
    const rawData = fs.readFileSync(filePath)
    const jsonData = JSON.parse(rawData)
    jsonData.countDownDays = formatData
    const modifiedData = JSON.stringify(jsonData)
    fs.writeFileSync(filePath, modifiedData)
    console.log(formatData)
    ipcMain.handle('getCountDownDays', async (event) => {
        const data = formatData;
        return data; // 将数据返回给渲染进程
    });
}

app.on('ready', () => {
    // 创建课程表窗口
    const win = new BrowserWindow({
        width: 1239,
        height: 100,
        autoHideMenuBar: true,
        alwaysOnTop: true,//置顶
        x: 100,
        y: 0,
        frame: false,//无边框窗口
        transparent: true,//透明
        skipTaskbar: true,//不显示在任务栏
        webPreferences: {
            nodeIntegration: true,
            sandbox: false,
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
            sandbox: false,
            nodeIntegration: true,
            preload: path.resolve(__dirname, './preload.js')
        }
    })

    ipcMain.on('countDownDayInput', updateCountDownDays)
    index.loadFile('./pages/index.html')
    index.center()

    let jsonData = fs.readFileSync(filePath)
    let strData = jsonData.toString()
    let objData = JSON.parse(strData)
    console.log(objData)
    ipcMain.handle('fetch-data-request', async (event) => {
        const data = objData;
        return data; // 将数据返回给渲染进程
    });
})


// const trayIconPath = path.join(__dirname, 'icon.png');
// const tray = new Tray(trayIconPath);
// const contextMenu = Menu.buildFromTemplate([
//   { label: 'Item1', type: 'normal' },
//   { label: 'Item2', type: 'normal' }
// ]);
// tray.setToolTip('This is my application.');
// tray.setContextMenu(contextMenu);
