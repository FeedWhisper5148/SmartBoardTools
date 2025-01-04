document.addEventListener('DOMContentLoaded', async () => {
    const wordArea = document.getElementById('wordArea')
    const meaningArea = document.getElementById('meaningArea')
    const word = await window.electronAPI.getWord()
    const meaning = await window.electronAPI.getWordMeaning()
    wordArea.innerText = word
    meaningArea.innerText = meaning
})