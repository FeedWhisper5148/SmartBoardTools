document.addEventListener('DOMContentLoaded', async () => {
    try {
        const data = await window.electronAPI.fetchData();
        console.log('Fetched data:', data);
        // 处理获取到的数据
        let classSchedule = data.classSchedule

        console.log(classSchedule)
        let targetDate = new Date(data.countDownDays)

        function getCountDays() {
            let currentDate = new Date()
            // console.log(targetDate)
            // console.log(currentDate)
            let dateDistance = targetDate - currentDate
            // console.log(dateDistance)
            let dateDistanceDays = Math.floor(dateDistance / (1000 * 60 * 60 * 24))
            document.getElementById('countDownTimer').innerHTML = String(dateDistanceDays)
        }

        function getScheduleForToday() {
            const now = new Date();
            const dayOfWeek = now.getDay(); // 0 是星期日，1 是星期一，...，6 是星期六
            return classSchedule[dayOfWeek]; // 根据星期几返回对应的课表
        }

        // 获取下一节课的信息
        function getNextClassInfo() {
            const schedule = getScheduleForToday(); // 获取今天的课表
            // console.log(schedule)
            const now = new Date();
            const currentHour = now.getHours();
            const currentMinute = now.getMinutes();
            const currentSecond = now.getSeconds();
            let currentTimeInSeconds = currentHour * 3600 + currentMinute * 60 + currentSecond;
            let nextClassIndex = -1;
            let nextClassTimeInSeconds = Infinity;
            for (let i = 0; i < schedule.length; i++) {
                // console.log(schedule[i])
                document.getElementById(`class${i}`).innerHTML = String(schedule[i].course);
            }

            for (let i = 0; i < schedule.length; i++) {
                // document.getElementById(`class${i}`).innerHTML = String(schedule[i].course);
                const classInfo = schedule[i];
                const [startHour, startMinute] = classInfo.start.split(':').map(Number);
                const [endHour, endMinute] = classInfo.end.split(':').map(Number);
                const startTimeInSeconds = startHour * 3600 + startMinute * 60;
                const endTimeInSeconds = endHour * 3600 + endMinute * 60;

                // 判断当前是否为上课时间，如果是，就隐藏窗口
                if (currentTimeInSeconds >= startTimeInSeconds && currentTimeInSeconds < endTimeInSeconds) {
                    document.getElementById('container').style.visibility = 'hidden'
                    return { isClassTime: true, courseIndex: i };
                    // 如果不是，就给下一节课添加动画
                } else if (currentTimeInSeconds < startTimeInSeconds && startTimeInSeconds < nextClassTimeInSeconds) {
                    nextClassIndex = i;
                    console.log(`class${i}`)
                    document.getElementById(`class${i}`).setAttribute('class', 'nextCourse')
                    document.getElementById('container').style.visibility = 'visible'
                    document.getElementById(`class${i - 1}`).removeAttribute('class', 'nextCourse')
                    nextClassTimeInSeconds = startTimeInSeconds;
                    
                    // 计算到下一节的时间
                    let countDownToNextCourse = startTimeInSeconds - currentTimeInSeconds
                    let countDownToNextCourseInMinutes = Math.floor(countDownToNextCourse / 60)
                    let countDownToNextCourseInSeconds = countDownToNextCourse % 60
                    // console.log(countDownToNextCourseInMinutes)
                    // console.log(countDownToNextCourseInSeconds)
                    // console.log(countDownToNextCourse)
                    if (countDownToNextCourseInSeconds < 10) {
                        document.getElementById('countDownToClass').innerHTML = String(countDownToNextCourseInMinutes) + ':0' + String(countDownToNextCourseInSeconds)
                    } else {
                        document.getElementById('countDownToClass').innerHTML = String(countDownToNextCourseInMinutes) + ':' + String(countDownToNextCourseInSeconds)
                    }
                }
            }

            // if (nextClassIndex === -1) {
            //     return { isClassTime: false, message: "今天没有更多的课程了" };
            // } else {
            //     const diffInSeconds = nextClassTimeInSeconds - currentTimeInSeconds;
            //     return {
            //         isClassTime: false,
            //         nextClassIndex: nextClassIndex
            //     };
            // }
        }

        let countDownTimer = setInterval(getCountDays, 1000);
        let updateClassSchedule = setInterval(getNextClassInfo, 1000);
    } catch (error) {
        console.error('Failed to fetch data:', error);
    }
});
