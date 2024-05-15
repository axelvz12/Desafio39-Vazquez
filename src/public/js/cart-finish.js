

const productCont = document.getElementsByClassName("productContainer")
const cartJSON = document.getElementById("cartJSON")
const cartId = document.getElementById("cartContainer").className


const products = JSON.parse(cartJSON.textContent)

cartJSON.style.display = 'none' 

const cartContainer = document.getElementById("cartContainer")

let totalArray = []

products.forEach(prod => {
  const div = document.createElement('div');

  div.textContent =   `Producto: ${prod.title} - Code: ${prod.code} - Cat: ${prod.category} - Precio/unidad: $${prod.price} - Cantidad: ${prod.quantity} - Total: $${prod.quantity*prod.price}.00`


  totalArray.push(prod.price*prod.quantity)

  cartContainer.appendChild(div);
});






let totalSum = totalArray.reduce((accumulator, currentValue) => accumulator + currentValue, 0);


document.getElementById("totalCart").innerText = `Total del carrito: $${totalSum}`


document.getElementById("purchase").addEventListener("click", ()=> {
    console.log("boton purchase")

    fetch(`/carts/purchase/${cartId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(response => response.json())
      .then(data => {
        const ticketId = data.ticketId
        console.log(data)
        window.location.href = `/ticket/${ticketId}`
      })

        
        
      .catch(error => console.error(error));
    
    
    
})


