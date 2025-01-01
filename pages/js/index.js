const getCountDayInput = document.getElementById('countDownDayInput')
const getCountDayButton = document.getElementById('countDownDayButton')
getCountDayButton.addEventListener('click', () => {
    const date = getCountDayInput.value
    electronAPI.updateCountDownDays(date)
    // alert(date)
})