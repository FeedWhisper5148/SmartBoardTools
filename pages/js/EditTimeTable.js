document.addEventListener('DOMContentLoaded', async () => {
    const data = await window.electronAPI.fetchData()
    let timeTable = data.timeTable
    const indexInput = document.getElementById('index')
    const startInput = document.getElementById('start')
    const endInput = document.getElementById('end')
    const editButton = document.getElementById('btn')
    const index = [0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
    const indexRegx = /\b([1-9]|10|11)\b/
    const timeRegex = /^([01]?[0-9]|2[0-3]):([0-5]?[0-9])$/

    function showTimeTable() {
        for (let i = 0; i < timeTable.length; i++) {
            console.log(`time${i}`)
            document.getElementById(`time${i}`).innerHTML = timeTable[i].start + '～' + timeTable[i].end
        }
    }

    showTimeTable()

    electronAPI.receive('changedTimeTable', (data) => {
        timeTable = data
        showTimeTable()
    })

    editButton.addEventListener('click', () => {
        if (timeRegex.test(startInput.value) && timeRegex.test(endInput.value) && indexRegx.test(indexInput.value)) {
            let formatedIndex = index[Number(indexInput.value)]
            timeTable[formatedIndex].start = startInput.value
            timeTable[formatedIndex].end = endInput.value
            electronAPI.editTimeTable(timeTable)
            layer.msg('修改成功')
        } else {
            layer.msg('格式不正确')
        }
    })
})
