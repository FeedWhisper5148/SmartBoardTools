let wordList = electronAPI.getWords()
let wordIndex = electronAPI.getWordIndex()

function getWords (wordIndex) {
    getDate = new Date().toDateString()
    currentWord = wordList[wordIndex]
}

function updateWord () {
    const currentDate = new Date().toDateString()
    if (currentDate !== getDate) {
        wordIndex += 1
        electronAPI.updateWordIndex(wordIndex)
        getWords(wordIndex)
    }
}

let autoUpdate = setInterval(updateWord, 1000)