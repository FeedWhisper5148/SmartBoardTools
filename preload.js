const { contextBridge, ipcRenderer } = require('electron')
const { console } = require('inspector')

contextBridge.exposeInMainWorld('electronAPI', {
    async fetchData() {
        try {
            const data = await ipcRenderer.invoke('fetchDataRequest')
            return data
        } catch (error) {
            console.error('Error fetching data:', error)
            throw error
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
            const data = await ipcRenderer.invoke('getData')
            return data
        } catch (error) {
            console.error('Error fetching data:', error)
            throw error
        }
    },
    quitApp: () => {
        ipcRenderer.send('quitApp')
    },
    editClassSchedule: (data) => {
        ipcRenderer.send('editClassSchedule', data)
    },
    async getWord() {
        try {
            const data = await ipcRenderer.invoke('word')
            return data
        } catch (error) {
            console.error('Error fetching data:', error)
            throw error
        }
    },
    async getWordMeaning() {
        try {
            const data = await ipcRenderer.invoke('meaning')
            return data
        } catch (error) {
            console.error('Error fetching data:', error)
            throw error
        }
    },
    creatAiWindow: () => {
        ipcRenderer.send('creatAiWindow')
    },
    getUserSend: (data) => {
        ipcRenderer.send('userSend', data)
    },
    receive: (channel, func) => {
        ipcRenderer.on(channel, (event, args) => func(args))
    },
    editTimeTable: (data) => {
        ipcRenderer.send('editTimeTable', data)
    },
    changeClassScheduleScale: (scale) => {
        ipcRenderer.send('changeClassScheduleScale', scale)
    },
    // 显示或隐藏窗口
    showWindow: (window) => {
        ipcRenderer.send(`show${window}Window`)
    },
    hideWindow: (window) => {
        ipcRenderer.send(`hide${window}Window`)
    },

    // 置顶或取消置顶窗口
    pinWindow: (window) => {
        ipcRenderer.send(`pin${window}Window`)
    },
    cancelPinWindow: (window) => {
        ipcRenderer.send(`cancelPin${window}Window`)
    },
})