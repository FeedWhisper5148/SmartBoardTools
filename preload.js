const { contextBridge, ipcRenderer } = require('electron')
const fs = require('fs')
const { console } = require('inspector')
// let receivedData
// const jsonData = fs.readFileSync('./config.json')
// objData = JSON.parse(jsonData)
// console.log(objData.countDownDays)
// ipcRenderer.on('data', getData)

// function getData (event, data) {
//     console.log(data)
//     receivedData = data
// }
// console.log(receivedData)

contextBridge.exposeInMainWorld('electronAPI', {
    async fetchData() {
        try {
            const data = await ipcRenderer.invoke('fetchDataRequest');
            return data; // 将数据返回给调用者
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error; // 将错误抛出给调用者
        }
    },
    updateCountDownDays: (date) => {
        ipcRenderer.send('countDownDayInput', date)
    },
    getChangedCountDownDays(callback) {
        ipcRenderer.on('changedCountDownDays', (event, data) => {
            callback(data)
            // console.log(data)
        })
    },
    getChangedClassSchedule(callback) {
        ipcRenderer.on('changedClassSchedule', (event, data) => {
            callback(data)
            // console.log(data)
        })
    },
    async getCountDays() {
        try {
            const data = await ipcRenderer.invoke('getData');
            return data; // 将数据返回给调用者
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error; // 将错误抛出给调用者
        }
    },
    quitApp: () => {
        ipcRenderer.send('quitApp')
    },
    showEditWindow: () => {
        ipcRenderer.send('showEditWindow')
    },
    editClassSchedule: (data) => {
        ipcRenderer.send('editClassSchedule', data)
    },
    // alert(date)
    async getWord() {
        try {
            const data = await ipcRenderer.invoke('word');
            return data; // 将数据返回给调用者
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error; // 将错误抛出给调用者
        }
    },
    async getWordMeaning() {
        try {
            const data = await ipcRenderer.invoke('meaning');
            return data; // 将数据返回给调用者
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error; // 将错误抛出给调用者
        }
    },
    showClassScheduleWindow: () => {
        ipcRenderer.send('showClassScheduleWindow')
    },
    hideClassScheduleWindow: () => {
        ipcRenderer.send('hideClassScheduleWindow')
    },
    showMemoriseWindow: () => {
        ipcRenderer.send('showMemoriseWindow')
    },
    hideMemoriseWindow: () => {
        ipcRenderer.send('hideMemoriseWindow')
    },
    creatAiWindow: () => {
        ipcRenderer.send('creatAiWindow')
    },
    getUserSend: (data) => {
        ipcRenderer.send('userSend', data)
    },
    getAiResult: () => {
        ipcRenderer.on('aiResult', (event, data) => {
            return data
        })
    },
    receive: (channel, func) => {
        // 监听来自主进程的回复
        ipcRenderer.on(channel, (event, args) => func(args));
    },
    onDataChunk: (callback) => ipcRenderer.on('data-chunk', callback)
})