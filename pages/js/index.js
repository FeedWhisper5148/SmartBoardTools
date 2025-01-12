const countDownDayInput = document.getElementById('countDownDayInput')
const countDownDayButton = document.getElementById('countDownDayButton')
const quitButton = document.getElementById('quit')
const editButton = document.getElementById('editClassScheduleButton')
const editTimeTableButton = document.getElementById('editTimeTableButton')
const aiButton = document.getElementById('aiButton')
const classScheduleSwitch = document.getElementById('classScheduleSwitch')
const memoriseWordSwitch = document.getElementById('memoriseWordSwitch')
const reg = /^\d{8}$/


layui.use(function () {
    var form = layui.form;
    // checkbox 事件
    form.on('switch(classScheduleSwitch)', function (data) {
        let elem = data.elem
        let checked = elem.checked
        if (checked == true) {
            electronAPI.showWindow('ClassSchedule')
        } else {
            electronAPI.hideWindow('ClassSchedule')
        }
    }), 
    form.on('switch(memoriseSwitch)', (data) => {
        let elem = data.elem
        let checked = elem.checked
        if (checked == true) {
            electronAPI.showWindow('Memorise')
        } else {
            electronAPI.hideWindow('Memorise')
        }
    })
})

countDownDayButton.addEventListener('click', () => {
    const date = countDownDayInput.value
    if (reg.test(date)) {
        electronAPI.updateCountDownDays(date)
        layer.msg('修改成功')
    } else {
        layer.msg('请输入有效的日期')
    }
    // alert(date)
})

quitButton.addEventListener('click', () => {
    electronAPI.quitApp()
})

editButton.addEventListener('click', () => {
    electronAPI.showWindow('Edit')
})

editTimeTableButton.addEventListener('click', () => {
    electronAPI.showWindow('EditTimeTable')
})

aiButton.addEventListener('click', () => {
    electronAPI.showWindow('Ai')
})

// layui.form.on('click(classScheduleSwitch)', returnData)
// // setInterval(updateClassScheduleState, 1000)




