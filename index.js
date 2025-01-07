const { app, BrowserWindow, screen, ipcMain, webContents } = require('electron')
const path = require('path')
const fs = require('fs')
const { Menu, Tray } = require('electron')
const https = require('https')
const axios = require('axios')
const querystring = require('querystring')
const crypto = require('crypto')
const { REPL_MODE_SLOPPY } = require('repl')

// 获取用户数据目录的路径
const userFile = app.getPath('userData')
const filePath = path.join(userFile, 'SmartBoardTools.json')
const wordListPath = path.join(userFile, 'wordList.json')

let classSchedule
let index
let memoriseWords
let editClassSchedule
let aiWindow

// 判断数据文件是否存在，若不存在则创建默认的数据文件
function writeDefalutData() {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, '{"wordListIndex":0,"wordMeaning":"","wordLastUpdate":"2024-01-01","countDownDays":"2025-03-24T00:00:00","classSchedule":[[{"start":"8:00","end":"8:40","course":"生"},{"start":"8:50","end":"9:30","course":"地"},{"start":"10:00","end":"10:40","course":"语"},{"start":"10:50","end":"11:30","course":"体"},{"start":"14:00","end":"14:40","course":"物"},{"start":"14:50","end":"15:30","course":"数"},{"start":"15:40","end":"16:20","course":"英"},{"start":"16:30","end":"17:10","course":"化"},{"start":"18:40","end":"19:50","course":"英"},{"start":"20:00","end":"21:10","course":"语"},{"start":"21:20","end":"10:30","course":"自"}],[{"start":"8:00","end":"8:40","course":"物"},{"start":"8:50","end":"9:30","course":"英"},{"start":"10:00","end":"10:40","course":"数"},{"start":"10:50","end":"11:30","course":"数"},{"start":"14:00","end":"14:40","course":"物"},{"start":"14:50","end":"15:30","course":"化"},{"start":"15:40","end":"16:20","course":"生"},{"start":"16:30","end":"17:10","course":"物"},{"start":"18:40","end":"19:50","course":"物"},{"start":"20:00","end":"21:10","course":"物"},{"start":"21:20","end":"10:30","course":"物"}],[{"start":"8:00","end":"8:40","course":"语"},{"start":"8:50","end":"9:30","course":"化"},{"start":"10:00","end":"10:40","course":"数"},{"start":"10:50","end":"11:30","course":"信"},{"start":"14:00","end":"14:40","course":"英"},{"start":"14:50","end":"15:30","course":"英"},{"start":"15:40","end":"16:20","course":"生"},{"start":"16:30","end":"17:10","course":"物"},{"start":"18:40","end":"19:50","course":"自"},{"start":"20:00","end":"21:10","course":"自"},{"start":"21:20","end":"10:30","course":"自"}],[{"start":"8:00","end":"8:40","course":"数"},{"start":"8:50","end":"9:30","course":"化"},{"start":"10:00","end":"10:40","course":"物"},{"start":"10:50","end":"11:30","course":"英"},{"start":"14:00","end":"14:40","course":"英"},{"start":"14:50","end":"15:30","course":"英"},{"start":"15:40","end":"16:20","course":"英"},{"start":"16:30","end":"17:10","course":"物"},{"start":"18:40","end":"19:50","course":"物"},{"start":"20:00","end":"21:10","course":"物"},{"start":"21:20","end":"10:30","course":"物"}],[{"start":"8:00","end":"8:40","course":"英"},{"start":"8:50","end":"9:30","course":"英"},{"start":"10:00","end":"10:40","course":"英"},{"start":"10:50","end":"11:30","course":"英"},{"start":"14:00","end":"14:40","course":"英"},{"start":"14:50","end":"15:30","course":"英"},{"start":"15:40","end":"16:20","course":"英"},{"start":"16:30","end":"17:10","course":"英"},{"start":"18:40","end":"19:50","course":"生"},{"start":"20:00","end":"21:10","course":"物"},{"start":"21:20","end":"10:30","course":"物"}],[{"start":"8:00","end":"8:40","course":"英"},{"start":"8:50","end":"9:30","course":"化"},{"start":"10:00","end":"10:40","course":"英"},{"start":"10:50","end":"11:30","course":"数"},{"start":"14:00","end":"14:40","course":"物"},{"start":"14:50","end":"15:30","course":"语"},{"start":"15:40","end":"16:20","course":"物"},{"start":"16:30","end":"17:10","course":"物"},{"start":"18:40","end":"19:50","course":"语"},{"start":"20:00","end":"20:25","course":"物"},{"start":"21:20","end":"10:30","course":"数"}],[{"start":"8:00","end":"8:40","course":"英"},{"start":"8:50","end":"9:30","course":"化"},{"start":"10:00","end":"10:40","course":"英"},{"start":"10:50","end":"11:30","course":"数"},{"start":"14:00","end":"14:40","course":"物"},{"start":"14:50","end":"15:30","course":"语"},{"start":"15:40","end":"16:20","course":"物"},{"start":"16:30","end":"17:10","course":"物"},{"start":"18:40","end":"19:50","course":"语"},{"start":"20:00","end":"20:25","course":"物"},{"start":"21:20","end":"10:30","course":"数"}]]}', 'utf8')
        console.log(`File ${filePath} created.`)
        // console.log(objData)
    } else {
        console.log(`File ${filePath} already exists.`);
    }
    if (!fs.existsSync(wordListPath)) {
        const wordList = fs.readFileSync(path.join(__dirname, './pages/resource/wordList.json'), 'utf8')
        fs.writeFileSync(wordListPath, wordList)
    }
}

writeDefalutData()
const wordList = fs.readFileSync(wordListPath)
const wordListObj = JSON.parse(wordList)

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
    return formatData
    // console.log(formatData)
    // ipcMain.handle('getCountDownDays', async (event) => {
    //     const data = formatData;
    //     return data; // 将数据返回给渲染进程
    // });
}

let currentWord = ''

// 判断是否需要更新单词
function getNewWord() {
    const rawData = fs.readFileSync(filePath).toString()
    // console.log(rawData)
    const objData = JSON.parse(rawData)
    if (new Date().toISOString().substring(0, 10) != objData.wordLastUpdate) {
        console.log(new Date().toISOString().substring(0, 10))
        console.log(objData.wordLastUpdate)
        // console.log(jsonData)
        objData.wordListIndex = parseInt(objData.wordListIndex) + 1
        jsonData = JSON.stringify(objData)
        fs.writeFileSync(filePath, jsonData)
        currentWord = wordListObj.list[objData.wordListIndex]
        console.log('new word: ' + currentWord)
        return currentWord
    } else {
        currentWord = wordListObj.list[objData.wordListIndex]
        // console.log(currentWord)
        return currentWord
    }
}


function translate() {
    // 有道翻译API的配置信息
    const appId = '6464afbe2b0c30a2'
    const appSecret = '0oXCQkHJwYrLXjSbp9lopvAiLxeSpvYc'

    // 要翻译的文本和语言信息
    const textToTranslate = getNewWord()
    const fromLang = 'auto'
    const toLang = 'zh-CN'

    const salt = Math.random().toString(36).substr(2, 16);

    // 获取当前UTC时间戳
    const curtime = Math.floor(Date.now() / 1000);

    // 构造签名前的字符串
    const signStr = `${appId}${textToTranslate}${salt}${curtime}${appSecret}`;

    // 计算签名
    const sign = crypto.createHash('sha256').update(signStr).digest('hex');

    // 构造请求参数
    const params = {
        q: textToTranslate,
        from: fromLang,
        to: toLang,
        appKey: appId,
        salt: salt,
        sign: sign,
        signType: 'v3',
        curtime: curtime,
    };

    // 将参数转换为查询字符串
    const queryString = querystring.stringify(params);

    // 有道翻译API的请求URL
    const apiUrl = `https://openapi.youdao.com/api?${queryString}`;

    const rawData = fs.readFileSync(filePath).toString()
    // console.log(rawData)
    const objData = JSON.parse(rawData)

    // 判断是否需要更新翻译
    if (new Date().toISOString().substring(0, 10) != objData.wordLastUpdate) {
        // 发送HTTPS GET请求
        https.get(apiUrl, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    const response = JSON.parse(data)
                    objData.wordMeaning = response.translation
                    objData.wordLastUpdate = new Date().toISOString().substring(0, 10)
                    jsonData = JSON.stringify(objData)
                    fs.writeFileSync(filePath, jsonData)
                    console.log('Response:', response.translation)
                    return response.translation
                } catch (error) {
                    console.error('Error parsing response:', error)
                }
            });
        }).on('error', (error) => {
            console.error('Error fetching translation:', error)
        });
    } else {
        // console.log('no need to update')
    }
}

function aiModel(message) {
    const url = 'https://spark-api-open.xf-yun.com/v1/chat/completions';
    const headers = {
        'Authorization': 'Bearer wDTvhPRoyfDDAuDegQtP:DuEJNTkoCMIrvwhJmojx',
        'Content-Type': 'application/json'
    };
    const data = {
        model: "4.0Ultra",
        messages: [
            {
                role: "user",
                content: message
            }
        ],
        stream: false,
        max_tokens: 5000
    };

    return axios.post(url, data, { headers }) // 返回 Promise
        .then(response => {
            // console.log(response.data);
            return response.data; // 在 Promise 中返回数据
        })
        .catch(error => {
            console.error('Error:', error);
            throw error; // 重新抛出错误以便调用者可以处理
        })
}

// aiModel()
// console.log(translate())
setInterval(getNewWord, 1000)
setInterval(translate, 5000)
translate()

ipcMain.handle('word', async (event) => {
    const data = getNewWord();
    return data; // 将数据返回给渲染进程
});

function creatIndexWindow() {
    index = new BrowserWindow({
        width: 600,
        height: 450,
        autoHideMenuBar: false,
        icon: path.resolve(__dirname, './favicon.ico'),
        webPreferences: {
            webSecurity: false,
            sandbox: false,
            nodeIntegration: true,
            preload: path.resolve(__dirname, './preload.js')
        },
        // show:false
    })

    index.loadFile('./pages/index.html')
    index.center()

}


function creatClassScheduleWindow() {
    classSchedule = new BrowserWindow({
        width: 1239,
        height: 100,
        autoHideMenuBar: true,
        alwaysOnTop: true,
        x: 100,
        y: 0,
        frame: false,
        transparent: true,
        skipTaskbar: true,
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
    }

    // 设置窗口的位置
    classSchedule.setBounds(winPos);

    classSchedule.loadFile('./pages/ClassSchedule.html')
}


function creatEditWindow() {
    editClassSchedule = new BrowserWindow({
        width: 580,
        height: 700,
        autoHideMenuBar: true,
        icon: path.resolve(__dirname, './favicon.ico'),
        webPreferences: {
            webSecurity: false,
            sandbox: false,
            nodeIntegration: true,
            preload: path.resolve(__dirname, './preload.js')
        },
        // show:false
    })
    editClassSchedule.loadFile('./pages/EditClassSchedule.html')
    editClassSchedule.center()
}

function creatMemoriseWindow() {
    memoriseWords = new BrowserWindow({
        width: 300,
        height: 150,
        autoHideMenuBar: true,
        alwaysOnTop: true,
        frame: false,
        transparent: true,
        skipTaskbar: true,
        webPreferences: {
            nodeIntegration: true,
            sandbox: false,
            preload: path.resolve(__dirname, './preload.js')
        }
    })

    const screenSize = screen.getPrimaryDisplay().workAreaSize;

    memoriseWords.loadFile('./pages/MemoriseWords.html')
    const memorisePos = {
        x: screenSize.width - 300,
        y: (screenSize.height - 150) / 2
    };
    memoriseWords.setBounds(memorisePos);
}

function createAiWindow() {
    aiWindow = new BrowserWindow({
        width: 415,
        height: 570,
        autoHideMenuBar: false,
        alwaysOnTop: false,
        frame: true,
        transparent: false,
        skipTaskbar: false,
        icon: path.resolve(__dirname, './favicon.ico'),
        webPreferences: {
            nodeIntegration: true,
            sandbox: false,
            preload: path.resolve(__dirname, './preload.js')
        }
    })

    aiWindow.loadFile('./pages/AI.html')
    aiWindow.center()
}


app.on('ready', () => {
    // 创建课程表窗口
    creatClassScheduleWindow()

    // 创建主窗口
    creatIndexWindow()

    // 创建每日一词窗口
    creatMemoriseWindow()

    ipcMain.on('creatAiWindow', () => {
        createAiWindow()
    })

    ipcMain.on('userSend', (event, data) => {
        aiModel(data).then(data => {
            console.log('Received data:', data)
            event.reply('aiResult', data)
        }).catch(error => {
            console.error('Failed to receive data:', error)
        });
    })

    // ipcMain.on('countDownDayInput', updateCountDownDays)

    ipcMain.on('countDownDayInput', (event, data) => {
        // 接收渲染进程发送的数据
        console.log('Data received in main process:', data)
     
        let formatData = updateCountDownDays(event, data)
     
        // 然后将更新后的数据发送回渲染进程
        classSchedule.webContents.send('changedCountDownDays', formatData);
      })

    // console.log(objData)
    ipcMain.handle('fetchDataRequest', async (event) => {
        const rawData = fs.readFileSync(filePath)
        const objData = JSON.parse(rawData)
        return objData; // 将数据返回给渲染进程
    })

    ipcMain.on('showClassScheduleWindow', () => {
        classSchedule.show()
    })

    ipcMain.on('hideClassScheduleWindow', () => {
        classSchedule.hide()
    })

    ipcMain.on('showMemoriseWindow', () => {
        memoriseWords.show()
    })

    ipcMain.on('hideMemoriseWindow', () => {
        memoriseWords.hide()
    })

    ipcMain.on('showIndexWindow', () => {
        creatIndexWindow()
    })

    ipcMain.on('showEditWindow', () => {
        // creatEditWindow()
    })

    // 读取配置文件
    // const filePath = path.join(__dirname, 'config.json')
    const rawData = fs.readFileSync(filePath)
    // console.log(objData)
    // 更新倒计时天数
    // function updateCountDownDays(event, date) {
    //     objData.countDownDays = date
    //     let jsonData = JSON.stringify(objData)
    //     fs.writeFileSync(filePath, jsonData)
    //     // console.log(jsonData)
    // }

    // 退出按钮
    ipcMain.on('quitApp', () => {
        app.quit();
    });

    ipcMain.on('showEditWindow', () => {

        // 创建编辑课程表窗口
        creatEditWindow()

        // 编辑课程表
        ipcMain.on('editClassSchedule', (event, data) => {
            let jsonData = JSON.stringify(data)
            fs.writeFileSync(filePath, jsonData)
            classSchedule.webContents.send('changedClassSchedule', data)
            // editClassSchedule.webContents.send('changedClassScheduleToEdi')
            // console.log(jsonData)
        })

    })

    ipcMain.handle('meaning', async (event) => {
        const rawData = fs.readFileSync(filePath)
        const meaning = JSON.parse(rawData).wordMeaning
        return meaning // 将数据返回给渲染进程
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

    const trayIconPath = path.join(__dirname, 'favicon.ico');
    const tray = new Tray(trayIconPath);
    tray.setToolTip('智慧白板助手')
    const contextMenu = Menu.buildFromTemplate([
        { label: '显示主界面', click: () => { creatIndexWindow() } },
        { label: '退出', click: () => { app.quit(); } },
    ])
    tray.setContextMenu(contextMenu)
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
