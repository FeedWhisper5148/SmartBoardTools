const classSchedulePinSwitch = document.getElementById('classSchedulePinSwitch')
const memorisePinSwitch = document.getElementById('memorisePinSwitch')

layui.use(function () {
    var form = layui.form
    form.on('switch(classSchedulePinSwitch)', function (data) {
        let elem = data.elem
        let checked = elem.checked
        if (checked == true) {
            electronAPI.pinWindow('ClassSchedule')
        } else {
            electronAPI.cancelPinWindow('ClassSchedule')
        }
    }), 
    form.on('switch(memorisePinSwitch)', function (data) {
        let elem = data.elem
        let checked = elem.checked
        if (checked == true) {
            electronAPI.pinWindow('Memorise')
        } else {
            electronAPI.cancelPinWindow('Memorise')
        }
    })
})