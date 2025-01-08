document.addEventListener('DOMContentLoaded', async () => {
    try {
        const data = await window.electronAPI.fetchData()
        console.log('Fetched data:', data)
        let classSchedule = data.classSchedule

        // 课程表修改后热更新
        electronAPI.getChangedClassSchedule((data) => {
            classSchedule = data.classSchedule
            console.log(data)
            showClassSchedule()
        })

        const currentScheduleContent = document.getElementById('currentClassSchedule')
        const weekInpuut = document.getElementById('week')
        const indexInput = document.getElementById('index')
        const courseInput = document.getElementById('course')
        const submitButton = document.getElementById('confirm')
        const regexWeek = /[1-7]/;
        const regexIndex = /^(1[0-1]|[1-9])$/
        let currentSchedule = ''; // 声明并初始化变量


        function showClassSchedule() {
            currentSchedule = ''
            for (let dayIndex = 0; dayIndex < classSchedule.length; dayIndex++) {
                for (let courseIndex = 0; courseIndex < classSchedule[dayIndex].length; courseIndex++) {
                    currentSchedule += classSchedule[dayIndex][courseIndex].course
                }
                currentSchedule += '<br><br>'
            }

            // console.log(currentSchedule)
            console.log(classSchedule)
            currentScheduleContent.innerHTML = currentSchedule
            currentScheduleContent.setAttribute('class', 'content')
        }

        showClassSchedule()


        submitButton.addEventListener('click', () => {
            if (!isNaN(weekInpuut.value) && regexWeek.test(parseInt(weekInpuut.value))) {
                const week = [0, 1, 2, 3, 4, 5, 6, 0]
                formatedWeek = week[parseInt(weekInpuut.value)]
            } else {
                layui.layer.msg('星期应输入阿拉伯数字1～7')
                // alert('星期应输入阿拉伯数字1～7')
            }

            if (!isNaN(indexInput.value) && regexIndex.test(parseInt(indexInput.value))) {
                const index = [0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                formatedIndex = index[parseInt(indexInput.value)]
            } else {
                layui.layer.msg('节数应输入阿拉伯数字1～11')
                // alert('节数应输入阿拉伯数字1～11')
            }

            if (courseInput.value.length == 1) {
                data.classSchedule[formatedWeek][formatedIndex].course = courseInput.value
                console.log(data)
                electronAPI.editClassSchedule(data)
                layui.layer.msg('修改成功')
                // alert('修改成功，重启APP后生效')
            } else {
                alert('课程名称应输入一个汉字')
                layui.layer, msg('课程名称应输入一个汉字')
            }
        })

    } catch (error) {
        console.error('Failed to fetch data:', error)
    }
})