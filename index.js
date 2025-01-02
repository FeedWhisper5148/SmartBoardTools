const { app, BrowserWindow, screen, ipcMain } = require('electron')
const path = require('path')
const fs = require('fs')
const { stringify } = require('querystring')
const { Menu, Tray } = require('electron')

// 获取用户数据目录的路径
const userFile = app.getPath('userData')
const filePath = path.join(userFile, 'SmartBoardTools.json')

// 判断数据文件是否存在，若不存在则创建默认的数据文件
function writeDefalutData() {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, '{"countDownDays":"2025-03-24T00:00:00","classSchedule":[[{"start":"8:00","end":"8:40","course":"生"},{"start":"8:50","end":"9:30","course":"地"},{"start":"10:00","end":"10:40","course":"语"},{"start":"10:50","end":"11:30","course":"体"},{"start":"14:00","end":"14:40","course":"物"},{"start":"14:50","end":"15:30","course":"数"},{"start":"15:40","end":"16:20","course":"英"},{"start":"16:30","end":"17:10","course":"化"},{"start":"18:40","end":"19:50","course":"英"},{"start":"20:00","end":"21:10","course":"语"},{"start":"21:20","end":"10:30","course":"自"}],[{"start":"8:00","end":"8:40","course":"物"},{"start":"8:50","end":"9:30","course":"英"},{"start":"10:00","end":"10:40","course":"数"},{"start":"10:50","end":"11:30","course":"数"},{"start":"14:00","end":"14:40","course":"物"},{"start":"14:50","end":"15:30","course":"化"},{"start":"15:40","end":"16:20","course":"生"},{"start":"16:30","end":"17:10","course":"物"},{"start":"18:40","end":"19:50","course":"物"},{"start":"20:00","end":"21:10","course":"物"},{"start":"21:20","end":"10:30","course":"物"}],[{"start":"8:00","end":"8:40","course":"语"},{"start":"8:50","end":"9:30","course":"化"},{"start":"10:00","end":"10:40","course":"数"},{"start":"10:50","end":"11:30","course":"信"},{"start":"14:00","end":"14:40","course":"英"},{"start":"14:50","end":"15:30","course":"英"},{"start":"15:40","end":"16:20","course":"生"},{"start":"16:30","end":"17:10","course":"物"},{"start":"18:40","end":"19:50","course":"自"},{"start":"20:00","end":"21:10","course":"自"},{"start":"21:20","end":"10:30","course":"自"}],[{"start":"8:00","end":"8:40","course":"数"},{"start":"8:50","end":"9:30","course":"化"},{"start":"10:00","end":"10:40","course":"物"},{"start":"10:50","end":"11:30","course":"英"},{"start":"14:00","end":"14:40","course":"英"},{"start":"14:50","end":"15:30","course":"英"},{"start":"15:40","end":"16:20","course":"英"},{"start":"16:30","end":"17:10","course":"物"},{"start":"18:40","end":"19:50","course":"物"},{"start":"20:00","end":"21:10","course":"物"},{"start":"21:20","end":"10:30","course":"物"}],[{"start":"8:00","end":"8:40","course":"英"},{"start":"8:50","end":"9:30","course":"英"},{"start":"10:00","end":"10:40","course":"英"},{"start":"10:50","end":"11:30","course":"英"},{"start":"14:00","end":"14:40","course":"英"},{"start":"14:50","end":"15:30","course":"英"},{"start":"15:40","end":"16:20","course":"英"},{"start":"16:30","end":"17:10","course":"英"},{"start":"18:40","end":"19:50","course":"生"},{"start":"20:00","end":"21:10","course":"物"},{"start":"21:20","end":"10:30","course":"物"}],[{"start":"8:00","end":"8:40","course":"英"},{"start":"8:50","end":"9:30","course":"化"},{"start":"10:00","end":"10:40","course":"英"},{"start":"10:50","end":"11:30","course":"数"},{"start":"14:00","end":"14:40","course":"物"},{"start":"14:50","end":"15:30","course":"语"},{"start":"15:40","end":"16:20","course":"物"},{"start":"16:30","end":"17:10","course":"物"},{"start":"18:40","end":"19:50","course":"语"},{"start":"20:00","end":"20:25","course":"物"},{"start":"21:20","end":"10:30","course":"数"}],[{"start":"8:00","end":"8:40","course":"英"},{"start":"8:50","end":"9:30","course":"化"},{"start":"10:00","end":"10:40","course":"英"},{"start":"10:50","end":"11:30","course":"数"},{"start":"14:00","end":"14:40","course":"物"},{"start":"14:50","end":"15:30","course":"语"},{"start":"15:40","end":"16:20","course":"物"},{"start":"16:30","end":"17:10","course":"物"},{"start":"18:40","end":"19:50","course":"语"},{"start":"20:00","end":"20:25","course":"物"},{"start":"21:20","end":"10:30","course":"数"}]]}', 'utf8'); // 创建空文件
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
fs.watchFile(filePath, { persistent: true, interval: 1000 }, (curr, prev) => {
    if (curr.mtimeMs !== prev.mtimeMs) { // 文件被修改
        let jsonData = fs.readFileSync(filePath)
        let objData = JSON.parse(jsonData)
    }
});


function showWindow() {
    const index = new BrowserWindow({
        width: 560,//窗口宽度
        height: 400,//窗口高度
        autoHideMenuBar: true,//自动隐藏菜单档
        webPreferences: {
            sandbox: false,
            nodeIntegration: true,
            preload: path.resolve(__dirname, './preload.js')
        },        // 可以选择在这里重新创建窗口，或者做其他处理
    })
    index.loadFile('./pages/index.html')
    index.center()
}


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
    const classSchedule = new BrowserWindow({
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

    const winPos = {
        x: (screenSize.width - 1239) / 2,
        y: 0
    };

    // 设置窗口的位置
    classSchedule.setBounds(winPos);

    classSchedule.loadFile('./pages/ClassSchedule.html')

    // 创建主窗口
    const index = new BrowserWindow({
        width: 560,//窗口宽度
        height: 400,//窗口高度
        autoHideMenuBar: true,//自动隐藏菜单档
        webPreferences: {
            sandbox: false,
            nodeIntegration: true,
            preload: path.resolve(__dirname, './preload.js')
        },
        // show:false
    })

    index.on("closed", () => {
        // 在窗口对象被关闭时，取消订阅所有与该窗口相关的事件
        index.removeAllListeners();
        // index = null;
    });


    index.loadFile('./pages/index.html')
    index.center()

    const editClassSchedule = new BrowserWindow({
        width: 580,
        height: 700,
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: true,
            sandbox: false,
            preload: path.resolve(__dirname, './preload.js')
        },
        show: false
    })

    editClassSchedule.loadFile('./pages/editClassSchedule.html')
    editClassSchedule.center()

    ipcMain.handle('countDownDayInput', updateCountDownDays)

    let jsonData = fs.readFileSync(filePath)
    let strData = jsonData.toString()
    let objData = JSON.parse(strData)
    console.log(objData)
    ipcMain.handle('fetchDataRequest', async (event) => {
        const data = objData;
        return data; // 将数据返回给渲染进程
    });

    // 退出按钮
    ipcMain.on('quitApp', () => {
        app.quit();
    });

    ipcMain.on('showEditWindow', () => {
        const editClassSchedule = new BrowserWindow({
            width: 580,
            height: 700,
            autoHideMenuBar: true,
            webPreferences: {
                nodeIntegration: true,
                sandbox: false,
                preload: path.resolve(__dirname, './preload.js')
            },
            // show: false
        })
    
        editClassSchedule.loadFile('./pages/editClassSchedule.html')
        editClassSchedule.center()
    })

    // 报错处理
    process.on('uncaughtException', (error) => {
        console.error('Uncaught Exception:', error);
    });

    process.on('unhandledRejection', (reason, promise) => {
        // 处理未处理的Promise拒绝
        console.error('Unhandled Rejection at:', promise, 'reason:', reason);
        // 阻止默认的未处理拒绝弹窗（如果有的话）
    });

    // 监听渲染进程的崩溃事件
    index.webContents.on('crashed', (event, killed) => {
        console.error('Renderer process crashed', killed)
    })

    const trayIconPath = path.join(__dirname, 'icon.ico');
    const tray = new Tray(trayIconPath);
    tray.setToolTip('智慧白板助手')
    const contextMenu = Menu.buildFromTemplate([
        { label: '显示主界面', click: () => { showWindow() } },
        { label: '退出', click: () => { app.quit(); } },
    ])
    tray.setContextMenu(contextMenu);
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
