const {contextBridge, ipcRenderer} = require('electron')
contextBridge.exposeInMainWorld('api', {
    updateCountDownDays: (date) => {
        ipcRenderer.send('countDownDayInput', date)
    }
})