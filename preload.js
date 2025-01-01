const {contextBridge, ipcRenderer} = require('electron')
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
            const data = await ipcRenderer.invoke('fetch-data-request');
            return data; // 将数据返回给调用者
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error; // 将错误抛出给调用者
        }
    },
    updateCountDownDays: (date) => {
        ipcRenderer.send('countDownDayInput', date);
    },
    async getCountDays() {
        try {
            const data = await ipcRenderer.invoke('getData');
            return data; // 将数据返回给调用者
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error; // 将错误抛出给调用者
        }
    }
});