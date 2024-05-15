
const ticketData = document.getElementById("ticket")
const ticketRender = document.getElementById("ticketRender")

ticketData.style.display = 'none' 


const ticketDataText = ticketData.innerText

ticketRender.innerText = ticketDataText

console.log(ticketDataText)

