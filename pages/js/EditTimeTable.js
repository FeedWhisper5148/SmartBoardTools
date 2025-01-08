document.addEventListener('DOMContentLoaded', async () => {
    const data = await window.electronAPI.fetchData();
    let timeTable = data.timeTable
    const indexInput = document.getElementById('index')
    const startInput = document.getElementById('start')
    const endInput = document.getElementById('end')
    const editButton = document.getElementById('btn')
    const index = [0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]

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
        let formatedIndex = index[Number(indexInput.value)]
        // console.log(formatedIndex)
        // console.log(startInput.value)
        timeTable[formatedIndex].start = startInput.value
        timeTable[formatedIndex].end = endInput.value
        electronAPI.editTimeTable(timeTable)
        // location.reload()

    })
})