const classSchedule = [
    [
        [{ start: "8:00", end: "8:40", course: "生" }],
        [{ start: "8:50", end: "9:30", course: "地" }],
        [{ start: "10:00", end: "10:40", course: "语" }],
        [{ start: "10:50", end: "11:30", course: "体" }],
        [{ start: "14:00", end: "14:40", course: "物" }],
        [{ start: "14:50", end: "15:30", course: "数" }],
        [{ start: "15:40", end: "16:20", course: "英" }],
        [{ start: "16:30", end: "17:10", course: "化" }],
        [{ start: "18:40", end: "19:50", course: "英" }],
        [{ start: "20:00", end: "21:10", course: "语" }],
        [{ start: "21:20", end: "10:30", course: "自" }]
    ],
    [
        [{ start: "8:00", end: "8:40", course: "物" }],
        [{ start: "8:50", end: "9:30", course: "英" }],
        [{ start: "10:00", end: "10:40", course: "数" }],
        [{ start: "10:50", end: "11:30", course: "数" }],
        [{ start: "14:00", end: "14:40", course: "/" }],
        [{ start: "14:50", end: "15:30", course: "/" }],
        [{ start: "15:40", end: "16:20", course: "/" }],
        [{ start: "16:30", end: "17:10", course: "/" }],
        [{ start: "18:40", end: "19:50", course: "物" }],
        [{ start: "20:00", end: "21:10", course: "物" }],
        [{ start: "21:20", end: "10:30", course: "物" }]
    ],
    [
        [{ start: "8:00", end: "8:40", course: "语" }],
        [{ start: "8:50", end: "9:30", course: "化" }],
        [{ start: "10:00", end: "10:40", course: "数" }],
        [{ start: "10:50", end: "11:30", course: "信" }],
        [{ start: "14:00", end: "14:40", course: "英" }],
        [{ start: "14:50", end: "15:30", course: "英" }],
        [{ start: "15:40", end: "16:20", course: "生" }],
        [{ start: "16:30", end: "17:10", course: "物" }],
        [{ start: "18:40", end: "19:50", course: "自" }],
        [{ start: "20:00", end: "21:10", course: "自" }],
        [{ start: "21:20", end: "10:30", course: "自" }]
    ],
    [
        [{ start: "8:00", end: "8:40", course: "数" }],
        [{ start: "8:50", end: "9:30", course: "化" }],
        [{ start: "10:00", end: "10:40", course: "物" }],
        [{ start: "10:50", end: "11:30", course: "英" }],
        [{ start: "14:00", end: "14:40", course: "英" }],
        [{ start: "14:50", end: "15:30", course: "英" }],
        [{ start: "15:40", end: "16:20", course: "英" }],
        [{ start: "16:30", end: "17:10", course: "物" }],
        [{ start: "18:40", end: "19:50", course: "物" }],
        [{ start: "20:00", end: "21:10", course: "物" }],
        [{ start: "21:20", end: "10:30", course: "物" }]
    ],
    [
        { start: "8:00", end: "8:40", course: "英" },
        { start: "8:50", end: "9:30", course: "英" },
        { start: "10:00", end: "10:40", course: "英" },
        { start: "10:50", end: "11:30", course: "英" },
        { start: "14:00", end: "14:40", course: "英" },
        { start: "14:50", end: "15:30", course: "英" },
        { start: "15:40", end: "16:20", course: "英" },
        { start: "16:30", end: "17:10", course: "英" },
        { start: "18:40", end: "19:50", course: "生" },
        { start: "20:00", end: "21:10", course: "物" },
        { start: "21:20", end: "10:30", course: "物" }
    ],
    [
        { start: "8:00", end: "8:40", course: "英" },
        { start: "8:50", end: "9:30", course: "化" },
        { start: "10:00", end: "10:40", course: "英" },
        { start: "10:50", end: "11:30", course: "数" },
        { start: "14:00", end: "14:40", course: "物" },
        { start: "14:50", end: "15:30", course: "语" },
        { start: "15:40", end: "16:20", course: "物" },
        { start: "16:30", end: "17:10", course: "物" },
        { start: "18:40", end: "19:50", course: "语" },
        { start: "20:00", end: "21:10", course: "物" },
        { start: "21:20", end: "10:30", course: "数" }
    ]
]

const targetDate = new Date('2026-06-07T00:00:00')

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


function getNextClassInfo() {
    const schedule = getScheduleForToday(); // 获取今天的课表
    // console.log(schedule)
    // const now = new Date();
    // const currentHour = now.getHours();
    // const currentMinute = now.getMinutes();
    // let currentTimeInSeconds = currentHour * 3600 + currentMinute * 60;
    // let nextClassIndex = -1;
    // let nextClassTimeInSeconds = Infinity;
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

        if (currentTimeInSeconds >= startTimeInSeconds && currentTimeInSeconds < endTimeInSeconds) {
            return { isClassTime: true, courseIndex: i };
        } else if (currentTimeInSeconds < startTimeInSeconds && startTimeInSeconds < nextClassTimeInSeconds) {
            nextClassIndex = i;
            nextClassTimeInSeconds = startTimeInSeconds;
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