document.addEventListener('DOMContentLoaded', async () => {
const userSend = document.getElementById('userSend')
const sendButton = document.getElementById('send')
const resultArea = document.getElementById('result')

sendButton.addEventListener('click', () => {
    const userSendContent = userSend.value
    electronAPI.getUserSend(userSendContent)
    console.log(electronAPI.getAiResult())
    window.electronAPI.receive('aiResult', (reply) => {
        console.log(reply)
        resultArea.innerHTML = reply.choices[0].message.content
      });
})
})