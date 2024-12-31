const {contextBridge, ipcRenderer} = require('electron')
const fs = require('fs')
const jsonData = fs.readFileSync('./config.json')
objData = JSON.parse(jsonData)
console.log(objData.countDownDays)
contextBridge.exposeInMainWorld('api', {
    updateCountDownDays: (date) => {
        ipcRenderer.send('countDownDayInput', date);
    },
    countDownDays: objData.countDownDays,
    classSchedule: objData.classSchedule
})