document.addEventListener('DOMContentLoaded', () => {
    const countDownDayInput = document.getElementById('countDownDayInput')
    const countDownDayButton = document.getElementById('countDownDayButton')
    const quitButton = document.getElementById('quit')
    const editButton = document.getElementById('editClassScheduleButton')
    const classScheduleSwitch = document.getElementById('classScheduleSwitch')
    const memoriseWordSwitch = document.getElementById('memoriseWordSwitch')
    const reg = /^\d{8}$/

    function updateClassScheduleState() {
        if (classScheduleSwitch.checked) {
            electronAPI.showClassScheduleWindow()
            // console.log('show')
        } else {
            electronAPI.hideClassScheduleWindow()
            // console.log('hide')
        }
    }
    

    function updateMemoriseState() {
        if (memoriseWordSwitch.checked) {
            electronAPI.showMemoriseWindow()
            // console.log('show')
        } else {
            electronAPI.hideMemoriseWindow()
            // console.log('hide')
        }
        console.log(memoriseWordSwitch.value)
    }

    // setInterval(updateMemoriseState, 1000)


    countDownDayButton.addEventListener('click', () => {
        const date = countDownDayInput.value
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

    classScheduleSwitch.addEventListener('click', updateClassScheduleState)
    memoriseWordSwitch.addEventListener('click', updateMemoriseState)
    // setInterval(updateClassScheduleState, 1000)

})


