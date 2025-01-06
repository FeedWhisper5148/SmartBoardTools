const countDownDayInput = document.getElementById('countDownDayInput')
const countDownDayButton = document.getElementById('countDownDayButton')
const quitButton = document.getElementById('quit')
const editButton = document.getElementById('editClassScheduleButton')
const classScheduleSwitch = document.getElementById('classScheduleSwitch')
const memoriseWordSwitch = document.getElementById('memoriseWordSwitch')
const reg = /^\d{8}$/


layui.use(function () {
    var form = layui.form;
    var layer = layui.layer;
    // checkbox 事件
    form.on('switch(classScheduleSwitch)', function (data) {
        let elem = data.elem
        let checked = elem.checked
        let value = elem.value
        let othis = data.othis
        if (checked == true) {
            electronAPI.showClassScheduleWindow()
        } else {
            electronAPI.hideClassScheduleWindow()
        }
    }), 
    form.on('switch(memoriseSwitch)', (data) => {
        let elem = data.elem
        let checked = elem.checked
        if (checked == true) {
            electronAPI.showMemoriseWindow()
        } else {
            electronAPI.hideMemoriseWindow()
        }
    })
})


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
        layer.msg('设置成功，重新打开APP后生效')
    } else {
        layer.msg('请输入有效的日期')
    }
    // alert(date)
})

quitButton.addEventListener('click', () => {
    electronAPI.quitApp()
})

editButton.addEventListener('click', () => {
    electronAPI.showEditWindow()
})

// layui.form.on('click(classScheduleSwitch)', returnData)
// // setInterval(updateClassScheduleState, 1000)




