

const cartId = document.getElementById('cartContainer').className

const butDeleteAllProd = document.getElementById("deleteAllProdFromCart");

const butDeleteCart = document.getElementById("deleteCart");

// CALCULO TOTAL PRECIO

const productCont = document.getElementsByClassName("productContainer")


let totalArray = []

for (let i = 0; i < productCont.length; i++) {
  const prodId = productCont[i].id
  const prodQuant = productCont[i].children[5].title
  const prodPrice = productCont[i].children[6].title
  const prodCalculate = prodQuant*prodPrice
  document.getElementsByName(prodId)[0].innerText = `Total: $${prodCalculate}`
  totalArray.push(prodCalculate)
}


let totalSum = totalArray.reduce((accumulator, currentValue) => accumulator + currentValue, 0);


document.getElementById("totalCart").innerText = `Total del carrito: $${totalSum}`


// BOTÓN PARA ELIMINAR CARRITO

butDeleteCart.addEventListener("click", () => {

  fetch(`/carts/${cartId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));


})

// BOTÓN PARA AGREGAR CANTIDAD DESDE EL PRODUCTO


$(document).ready(function() {
  $('.productContainer').on('submit', 'form', function(event) {
      event.preventDefault();
      console.log(event.target.children)
      const quantityData = {
        prodId: event.target.children[0].name,
        quantity: event.target.children[0].value,
      }
      
      if (!quantityData.quantity) {
        return alert('Debe definir una cantidad para agregar')
      }

        console.log(quantityData)
      

      fetch(`/carts/${cartId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(quantityData),
      })
      .then(response => response.json())
      .then(data => {
        const message = data.message
        console.log(message)
        alert(message);
        location.reload()

      })
      .catch(error => {
        console.error('Error making PUT request:', error);
      });
      

  });
});




// BOTÓN PARA ELIMINAR UN PRODUCTO DEL CARRITO

document.getElementById('cartContainer').addEventListener('click', (event) => {
  if (event.target.tagName === 'BUTTON'  && event.target.className === "deleteProdFromCart") {
    const prodId = event.target.name  
    
    
    fetch(`/carts/${cartId}/product/${prodId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error(error));
      
      location.reload()
   
  }
});






