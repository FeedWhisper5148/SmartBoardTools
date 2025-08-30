document.addEventListener('DOMContentLoaded', async () => {
    const wordArea = document.getElementById('wordArea')
    const meaningArea = document.getElementById('meaningArea')
    const word = await window.electronAPI.getWord()
    const meaning = await window.electronAPI.getWordMeaning()
    const data = await window.electronAPI.fetchData()
    const classSchedule = data.classSchedule
    const timeTable = data.timeTable
    // console.log(data)

    wordArea.innerText = word
    meaningArea.innerText = meaning

    function hideInClass() {
        const date = new Date().getDay()
        const now = new Date()
        const todaySchedule = classSchedule[date]
        // console.log(date)
        const currentHour = now.getHours()
        const currentMinute = now.getMinutes()
        const currentSecond = now.getSeconds()
        let nextClassTimeInSeconds = Infinity
        const currentTimeInSeconds = currentHour * 3600 + currentMinute * 60 + currentSecond
        for (i = 0; i < todaySchedule.length; i++) {
            let classInfo = todaySchedule[i]
            const [startHour, startMinute] = timeTable[i].start.split(':').map(Number)
            const [endHour, endMinute] = timeTable[i].end.split(':').map(Number)
            const startTimeInSeconds = startHour * 3600 + startMinute * 60
            const endTimeInSeconds = endHour * 3600 + endMinute * 60
            // 判断当前是否为上课时间，如果是，就隐藏窗口
            if (currentTimeInSeconds >= startTimeInSeconds && currentTimeInSeconds < endTimeInSeconds) {
                document.getElementById('container').style.visibility = 'hidden'
                return { isClassTime: true, courseIndex: i }
            } else if (currentTimeInSeconds < startTimeInSeconds && startTimeInSeconds < nextClassTimeInSeconds) {
                nextClassIndex = i
                document.getElementById('container').style.visibility = 'visible'
            }
        }
    }
    setInterval(hideInClass, 1000)
})
