document.addEventListener('DOMContentLoaded', async () => {
    try {
        const data = await window.electronAPI.fetchData()
        console.log('Fetched data:', data)
        const classSchedule = data.classSchedule
        const currentScheduleContent = document.getElementById('currentClassSchedule')
        const weekInpuut = document.getElementById('week')
        const indexInput = document.getElementById('index')
        const courseInput = document.getElementById('course')
        const submitButton = document.getElementById('confirm')
        const regexWeek = /[1-7]/;
        const regexIndex = /^(1[0-1]|[2-9])$/;

        let currentSchedule = ''; // 声明并初始化变量
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

        submitButton.addEventListener('click', () => {
            if (!isNaN(weekInpuut.value) && regexWeek.test(parseInt(weekInpuut.value))) {
                const week = [0, 1, 2, 3, 4, 5, 6, 0]
                formatedWeek = week[parseInt(weekInpuut.value)]
            } else {
                alert('星期应输入阿拉伯数字1～7')
            }

            if (!isNaN(indexInput.value) && regexIndex.test(parseInt(indexInput.value))) {
                const index = [0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                formatedIndex = index[parseInt(indexInput.value)]
            } else {
                alert('节数应输入阿拉伯数字1～11')
            }

            classSchedule[formatedWeek][formatedIndex].course = courseInput.value
            console.log(classSchedule)
        })

    } catch (error) {
        console.error('Failed to fetch data:', error)
    }
})