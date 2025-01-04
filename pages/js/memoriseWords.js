document.addEventListener('DOMContentLoaded', async () => {
    const word = await window.electronAPI.getWord()
    console.log(word)
    const wordArea = document.getElementById('wordArea')
    wordArea.innerText = word
})