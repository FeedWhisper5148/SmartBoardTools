document.addEventListener('DOMContentLoaded', () => {
    const getCountDayInput = document.getElementById('countDownDayInput')
    const getCountDayButton = document.getElementById('countDownDayButton')
    const quitButton = document.getElementById('quit')
    const editButton = document.getElementById('editClassScheduleButton')
    const reg = /^\d{8}$/;

    getCountDayButton.addEventListener('click', () => {
        const date = getCountDayInput.value
        if (reg.test(date)) {
            electronAPI.updateCountDownDays(date)
            alert('设置成功，重新打开APP生效')
        } else {
            alert('请输入有效的日期')
        }
        // alert(date)
    })
    
    quitButton.addEventListener('click', () => {
        electronAPI.quitApp()
    })
    
    editButton.addEventListener('click', () => {
        electronAPI.showEditWindow()
    })
})
