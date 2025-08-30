const { app, BrowserWindow, screen, ipcMain, webContents } = require('electron')
const path = require('path')
const fs = require('fs')
const { Menu, Tray } = require('electron')
const https = require('https')
const axios = require('axios')
const querystring = require('querystring')
const crypto = require('crypto')

// 获取用户数据目录的路径
const userFile = app.getPath('userData')
const filePath = path.join(userFile, 'SmartBoardTools.json')
const wordListPath = path.join(userFile, 'wordList.json')

let loading
let classSchedule
let index
let memoriseWords
let editClassSchedule
let aiWindow
let editTimeTable

// 判断数据文件是否存在，若不存在则创建默认的数据文件
function writeDefalutData() {
    if (!fs.existsSync(filePath)) {
        const defalutData = fs.readFileSync(path.join(__dirname, './config.json'))
        fs.writeFileSync(filePath, defalutData)
        console.log(`File ${filePath} created.`)
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

let rawData = fs.readFileSync(filePath)
let jsonData = JSON.parse(rawData)

// 修改倒数日
function updateCountDownDays(event, data) {
    let year = data.substring(0, 4)
    let month = data.substring(4, 6)
    let day = data.substring(6, 8)
    formatData = year + '-' + month + '-' + day + 'T23:59:59'
    const rawData = fs.readFileSync(filePath)
    const jsonData = JSON.parse(rawData)
    jsonData.countDownDays = formatData
    const modifiedData = JSON.stringify(jsonData)
    fs.writeFileSync(filePath, modifiedData)
    return formatData
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

    const salt = Math.random().toString(36).substr(2, 16)

    // 获取当前UTC时间戳
    const curtime = Math.floor(Date.now() / 1000)

    // 构造签名前的字符串
    const signStr = `${appId}${textToTranslate}${salt}${curtime}${appSecret}`

    // 计算签名
    const sign = crypto.createHash('sha256').update(signStr).digest('hex')

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
    const queryString = querystring.stringify(params)

    // 有道翻译API的请求URL
    const apiUrl = `https://openapi.youdao.com/api?${queryString}`

    let rawData = fs.readFileSync(filePath).toString()
    let objData = JSON.parse(rawData)

    // 判断是否需要更新翻译
    if (new Date().toISOString().substring(0, 10) != objData.wordLastUpdate) {
        // 发送HTTPS GET请求
        https.get(apiUrl, (res) => {
            let data = ''

            res.on('data', (chunk) => {
                data += chunk;
            })

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
        })
    } else {
        console.log('no need to update')
    }
}


// 请求AI接口
function aiModel(message) {
    const url = 'https://spark-api-open.xf-yun.com/v1/chat/completions'
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
            return response.data; // 在 Promise 中返回数据
        })
        .catch(error => {
            console.error('Error:', error)
            throw error // 重新抛出错误以便调用者可以处理
        })
}

setInterval(getNewWord, 1000)
setInterval(translate, 50000)
translate()

ipcMain.handle('word', async (event) => {
    const data = getNewWord()
    return data // 将数据返回给渲染进程
})

function creatIndexWindow() {
    index = new BrowserWindow({
        width: 600,
        height: 450,
        autoHideMenuBar: true,
        icon: path.resolve(__dirname, './favicon.ico'),
        webPreferences: {
            webSecurity: false,
            sandbox: false,
            nodeIntegration: true,
            resizable: false,
            preload: path.resolve(__dirname, './preload.js')
        },
        show: false
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
        resizable: false,
        webPreferences: {
            nodeIntegration: true,
            sandbox: false,
            preload: path.resolve(__dirname, './preload.js')
        },
        show: false
    })

    // 获取屏幕的尺寸
    const screenSize = screen.getPrimaryDisplay().workAreaSize

    const winPos = {
        x: (screenSize.width - 1239) / 2,
        y: 0
    }

    // 设置窗口的位置
    classSchedule.setBounds(winPos)

    classSchedule.loadFile('./pages/ClassSchedule.html')

    classSchedule.setIgnoreMouseEvents(true, { forward: true })
}


function creatEditWindow() {
    editClassSchedule = new BrowserWindow({
        width: 580,
        height: 700,
        autoHideMenuBar: true,
        resizable: false,
        icon: path.resolve(__dirname, './favicon.ico'),
        webPreferences: {
            webSecurity: false,
            sandbox: false,
            nodeIntegration: true,
            preload: path.resolve(__dirname, './preload.js')
        },
        show: false
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
        resizable: false,
        webPreferences: {
            nodeIntegration: true,
            sandbox: false,
            preload: path.resolve(__dirname, './preload.js')
        },
        show: false
    })

    const screenSize = screen.getPrimaryDisplay().workAreaSize;

    memoriseWords.loadFile('./pages/MemoriseWords.html')
    const memorisePos = {
        x: screenSize.width - 300,
        y: (screenSize.height - 150) / 2
    };
    memoriseWords.setBounds(memorisePos)
    memoriseWords.setIgnoreMouseEvents(true, { forward: true })
}

function createAiWindow() {
    aiWindow = new BrowserWindow({
        width: 415,
        height: 570,
        autoHideMenuBar: true,
        alwaysOnTop: false,
        frame: true,
        transparent: false,
        skipTaskbar: false,
        resizable: false,
        icon: path.resolve(__dirname, './favicon.ico'),
        webPreferences: {
            nodeIntegration: true,
            sandbox: false,
            preload: path.resolve(__dirname, './preload.js')
        },
        show: false

    })

    aiWindow.loadFile('./pages/AI.html')
    aiWindow.center()
}

function creatEditTimeTableWindow() {
    editTimeTable = new BrowserWindow({
        width: 400,
        height: 750,
        autoHideMenuBar: true,
        alwaysOnTop: false,
        frame: true,
        transparent: false,
        skipTaskbar: false,
        resizable: false,
        icon: path.resolve(__dirname, './favicon.ico'),
        webPreferences: {
            nodeIntegration: true,
            sandbox: false,
            preload: path.resolve(__dirname, './preload.js')
        },
        show: false
    })

    editTimeTable.loadFile('./pages/EditTimeTable.html')
    editTimeTable.center()
}

function creatLoadingWindow() {
    loading = new BrowserWindow({
        width: 600,
        height: 450,
        autoHideMenuBar: true,
        alwaysOnTop: false,
        frame: true,
        transparent: false,
        resizable: false,
        skipTaskbar: false,
        icon: path.resolve(__dirname, './favicon.ico'),
        webPreferences: {
            nodeIntegration: true,
            sandbox: false,
            preload: path.resolve(__dirname, './preload.js')
        },
        // show: false,
    })
    loading.loadFile('./pages/loading.html')
}


app.on('ready', () => {
    
    // 创建加载窗口
    creatLoadingWindow()

    // 创建课程表窗口
    creatClassScheduleWindow()

    // 创建主窗口
    creatIndexWindow()

    // 创建每日一词窗口
    creatMemoriseWindow()

    // 创建修改课程表窗口
    creatEditWindow()

    // 创建修改时间表窗口
    creatEditTimeTableWindow()

    // 创建问AI窗口
    createAiWindow()

    index.on('close', (event) => {
        // 阻止窗口默认的关闭行为
        event.preventDefault();
        // 隐藏窗口而不是关闭它
        index.hide();
    })

    aiWindow.on('close', (event) => {
        event.preventDefault()
        aiWindow.hide()
    })

    classSchedule.on('close', (event) => {
        event.preventDefault()
        classSchedule.hide()
    })

    editClassSchedule.on('close', (event) => {
        event.preventDefault()
        editClassSchedule.hide()
    })


    classSchedule.on('ready-to-show', () => {
        loading.close()
        classSchedule.show()
        index.show()
        memoriseWords.show()
    })

    editTimeTable.on('close', (event) => {
        // 阻止窗口默认的关闭行为
        event.preventDefault()
        // 隐藏窗口而不是关闭它
        editTimeTable.hide()
    })

    ipcMain.on('showAiWindow', () => {
        aiWindow.show()
    })

    ipcMain.on('userSend', (event, data) => {
        aiModel(data).then(data => {
            console.log('Received data:', data)
            event.reply('aiResult', data)
        }).catch(error => {
            console.error('Failed to receive data:', error)
        });
    })

    ipcMain.on('countDownDayInput', (event, data) => {
        // 接收渲染进程发送的数据
        console.log('Data received in main process:', data)

        let formatData = updateCountDownDays(event, data)

        // 然后将更新后的数据发送回渲染进程
        classSchedule.webContents.send('changedCountDownDays', formatData)
    })

    ipcMain.handle('fetchDataRequest', async (event) => {
        const rawData = fs.readFileSync(filePath)
        const objData = JSON.parse(rawData)
        return objData
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
        index.show()
    })

    ipcMain.on('pinClassScheduleWindow', () => {
        classSchedule.setAlwaysOnTop(true)
    })

    ipcMain.on('cancelPinClassScheduleWindow', () => {
        classSchedule.setAlwaysOnTop(false)
    })

    ipcMain.on('pinMemoriseWindow', () => {
        memoriseWords.setAlwaysOnTop(true)
    })

    ipcMain.on('cancelPinMemoriseWindow', () => {       
        memoriseWords.setAlwaysOnTop(false)
    })
    
    // 退出按钮
    ipcMain.on('quitApp', () => {
        app.exit();
    });

    ipcMain.on('showEditWindow', () => {

        // 创建修改课程表窗口
        // creatEditWindow()
        editClassSchedule.show()

        // 编辑课程表
        ipcMain.on('editClassSchedule', (event, data) => {
            let jsonData = JSON.stringify(data)
            fs.writeFileSync(filePath, jsonData)
            classSchedule.webContents.send('changedClassSchedule', data)
            editClassSchedule.webContents.send('changedClassSchedule', data)
        })

    })

    ipcMain.handle('meaning', async (event) => {
        const rawData = fs.readFileSync(filePath)
        const meaning = JSON.parse(rawData).wordMeaning
        return meaning 
    })

    ipcMain.on('editTimeTable', (event, data) => {
        const objData = JSON.parse(rawData)
        console.log(data)
        objData.timeTable = data
        const jsonData = JSON.stringify(objData)
        fs.writeFileSync(filePath, jsonData)
        editTimeTable.webContents.send('changedTimeTable', data)
    })

    ipcMain.on('showEditTimeTableWindow', () => {
        editTimeTable.show()
    })


    // 报错处理
    process.on('uncaughtException', (error) => {
        console.error('Uncaught Exception:', error);
    });

    process.on('unhandledRejection', (reason, promise) => {
        console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    });

    // 监听渲染进程的崩溃事件
    index.webContents.on('crashed', (event, killed) => {
        console.error('Renderer process crashed', killed)
    })

    const trayIconPath = path.join(__dirname, 'favicon.ico')
    const tray = new Tray(trayIconPath);
    tray.setToolTip('智慧白板助手')
    const contextMenu = Menu.buildFromTemplate([
        { label: '显示主界面', click: () => { index.show() } },
        { label: '退出', click: () => { app.quit() } },
    ])
    tray.setContextMenu(contextMenu)
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});
