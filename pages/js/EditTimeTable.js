document.addEventListener('DOMContentLoaded', async () => {
    const data = await window.electronAPI.fetchData();
    const classSchedule = data.classSchedule
    for (let weekIndex = 0; weekIndex < classSchedule.length; weekIndex++) {

        
    }
})