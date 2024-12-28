const getCountDayInput = document.getElementById('countDownDayInput')
const getCountDayButton = document.getElementById('countDownDayButton')
getCountDayButton.addEventListener('click', () => {
    const date = getCountDayInput.value
    api.updateCountDownDays(date)
    alert(date)
})