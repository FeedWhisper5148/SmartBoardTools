document.addEventListener('DOMContentLoaded', async () => {
    try {
        const data = await window.electronAPI.fetchData()
        console.log('Fetched data:', data)
        const classSchedule = data.classSchedule
        const currentScheduleContent = document.getElementById('currentClassSchedule')
        let currentSchedule = ''; // 声明并初始化变量
        for (let dayIndex = 0; dayIndex < classSchedule.length; dayIndex++) {
            for (let courseIndex = 0; courseIndex < classSchedule[dayIndex].length; courseIndex++) {
                currentSchedule += classSchedule[dayIndex][courseIndex].course
            }
            currentSchedule += '<br><br>'
        }
        console.log(currentSchedule)
        currentScheduleContent.innerHTML = currentSchedule
        currentScheduleContent.setAttribute('class', 'content')
    } catch (error) {
        console.error('Failed to fetch data:', error)
    }
})