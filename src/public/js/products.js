
let userId

if (document.getElementById("userData")) {

  userId = document.getElementById("userData").title
  
} else {console.log('no hay datos')}

const butAddCart = document.getElementById("addToCart");
const butDeleteAllProd = document.getElementById("deleteAllProdFromCart");
const butDeleteCart = document.getElementById("deleteCart");



let cartId = document.getElementById('productsContainer').className



// GESTIÓN DE LOS QUERY PARAMS EN LA URL

const querys = document.location.search

const totalPages = Number(document.getElementById("totalPages").title)


const urlQuerys = {
  page: Number(document.getElementById('page').title),
  totalPages: totalPages,
  sort: false,
  cat: false,
  limit: false,
  query: false,
  stock: false,
}



function createUrl () {
  let url = `/products?page=${urlQuerys.page}`
  if (urlQuerys.sort) {url = url+`&sort=${urlQuerys.sort}`}
  if (urlQuerys.cat) {url = url+`&cat=${urlQuerys.cat}`}
  if (urlQuerys.limit) {url = url+`&limit=${urlQuerys.limit}`}
  if (urlQuerys.query) {url = url+`&query=${urlQuerys.query}`}
  
  return url
}

function findQuerys () {
  const querysSplit = querys.split('&') 
  querysSplit.shift()
  for (i of querysSplit) {
    const query = i.split('=')
    if (query[0] == 'sort') {urlQuerys.sort = query[1]}
    if (query[0] == 'limit') {urlQuerys.limit = query[1]}
    if (query[0] == 'cat') {urlQuerys.cat = query[1]} 
    if (query[0] == 'query') {urlQuerys.query = query[1]} 
  }
}


findQuerys()



// BOTÓN PARA LOGOUT

if (document.getElementById('logOutForm')) {
  const form = document.getElementById('logOutForm')
  
  form.addEventListener('submit', e=> {
      e.preventDefault()
  
      const fetchParams = {
          url: '/products/logout',
          headers: {
              'Content-type': 'application/json',
          },
          method: 'POST',
      }
      
      
      fetch(fetchParams.url, {
          headers: fetchParams.headers,
          method: fetchParams.method,
          redirect: 'follow'
      })
      .then(response => response.json())
      .then(data => {
          console.log(data);
          if (data.url) {
              window.location.href = data.url;
          }
      })
      .catch(error => console.log(error))
  })

}


// AGREGAR NUEVO PRODUCTO

const newProdAdd = document.getElementById("newProdAdd")

newProdAdd.addEventListener("click", (event) => {
  event.preventDefault()

  const newProdInfo = {
    title: document.getElementById("newProdTitle").value,
    description: document.getElementById("newProdDes").value,
    code: document.getElementById("newProdCode").value,
    price: document.getElementById("newProdPrice").value,
    stock: document.getElementById("newProdStock").value,
    category: document.getElementById("newProdCat").value,
    image: document.getElementById("newProdImage").value,

  }

  if (!newProdInfo.title || !newProdInfo.code || !newProdInfo.price || !newProdInfo.stock || !newProdInfo.category || !newProdInfo.description ) {
    return alert('Faltan datos del producto')
  } else {
    
    console.log(newProdInfo)
    
    fetch('/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newProdInfo),
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error));
  }


})


// BÚSQUEDA POR NOMBRE

const searchButton = document.getElementById("seachQuery")

searchButton.addEventListener("click", (event) => {
  event.preventDefault()
  const prodTitle = document.getElementById("prodTitle").value

  urlQuerys.query = prodTitle
  urlQuerys.page = 1
  const newURL = createUrl()
  window.location.href = newURL
})

// BOTÓN PARA ELIMINAR BÚSQUEDA

if (urlQuerys.query) {
  
  const divSearch = document.getElementById('searchContainer');
  const searchInfo = document.createElement('p');
  
  const buttonSearchCancel = document.createElement('button');
  searchInfo.textContent = `Se buscó: "${urlQuerys.query}"`
  
  buttonSearchCancel.setAttribute('id', 'buttonSearchCancel');
  buttonSearchCancel.textContent = 'Eliminar Búsqueda';
  
  divSearch.appendChild(searchInfo)
  divSearch.appendChild(buttonSearchCancel);

  buttonSearchCancel.addEventListener("click", () => {
    urlQuerys.query = false
    const newURL = createUrl()
    window.location.href = newURL
  })

}



// BOTONES DE CAMBIO DE PÁGINA

const butNextPage = document.getElementById("nextPageButton")

if (butNextPage) {
  butNextPage.addEventListener("click", () => {
    const nextPage = document.getElementById("nextPageButton").title

    urlQuerys.page = nextPage
    const newURL = createUrl()
    window.location.href = newURL

  })
}

const butPrevPage = document.getElementById("prevPageButton")


if (butPrevPage) {
  butPrevPage.addEventListener("click", () => {
    const prevPage = document.getElementById("prevPageButton").title

    urlQuerys.page = prevPage
    const newURL = createUrl()
    window.location.href = newURL
  }) 
}

// BOTÓN PARA LIMITAR RESULTADOS DE BÚSQUEDA

const limitInputButton = document.getElementById("limitInputButton")

limitInputButton.addEventListener("click", (e) => {
  e.preventDefault()
  const limitInput = document.getElementById("limitInput").value

  urlQuerys.limit = limitInput
  urlQuerys.page = 1
  const newURL = createUrl()
  window.location.href = newURL
})

// BOTÓN PARA ELIMINAR LÍMITE DE RESULTADOS

if (urlQuerys.limit) {
  
  const limitContainer = document.getElementById('limit-container');
  
  const buttonLimitCancel = document.createElement('button');
  
  buttonLimitCancel.setAttribute('id', 'buttonLimitCancel');
  buttonLimitCancel.textContent = 'Eliminar límite';
  
  limitContainer.appendChild(buttonLimitCancel);

  buttonLimitCancel.addEventListener("click", () => {
    urlQuerys.limit = false
    const newURL = createUrl()
    window.location.href = newURL
  })

}


// BOTONES PARA ORDENAR

const sortAscButton = document.getElementById('sortAscButton')

if (urlQuerys.sort != 'asc' || urlQuerys.sort == false) {
  sortAscButton.addEventListener("click", () => {

        urlQuerys.sort = 'asc'
        console.log(urlQuerys)

        const newURL = createUrl()
        console.log(newURL)
        window.location.href = newURL

  })
}


const sortDescButton = document.getElementById('sortDescButton')

if (urlQuerys.sort != 'desc' || urlQuerys.sort == false) {
  sortDescButton.addEventListener("click", () => {

        urlQuerys.sort = 'desc'
        console.log(urlQuerys)

        const newURL = createUrl()
        console.log(newURL)
        window.location.href = newURL

  })
}

// BOTÓN PARA ELIMINAR ORDEN POR PRECIO

if (urlQuerys.sort) {
  
  const divSort = document.getElementById('sortcancelButton');
  
  const buttonSortCancel = document.createElement('button');
  
  buttonSortCancel.setAttribute('id', 'buttonSortCancel');
  buttonSortCancel.textContent = 'Eliminar Orden';
  
  divSort.appendChild(buttonSortCancel);

  buttonSortCancel.addEventListener("click", () => {
    urlQuerys.sort = false
    const newURL = createUrl()
    window.location.href = newURL
  })

}



// BOTÓN PARA CREAR CARRITO

let butCreateCart

if (!cartId) {
  cartId = 'new'
  butCreateCart = document.getElementById("createCart")
} 



let cartName



if (butCreateCart) {
  butCreateCart.addEventListener("click", () => {
  console.log('crear carrito')
  
  const userData = {
    userId
  }
      fetch('/carts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error(error));


        location.reload()
  
})
}

// BOTÓN PARA BORRAR CARRITO

if (butDeleteCart) {

butDeleteCart.addEventListener("click", () => {


  fetch(`/carts/${cartId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    //body: JSON.stringify(patchData),
  })
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));

  location.reload()
  
})
}

// BOTÓN PARA AGREGAR PRODUCTO AL CARRITO



document.getElementById('productsContainer').addEventListener('click', function(event) {
  if (event.target.tagName === 'BUTTON' && event.target.className === "AddProdToCart") {
      console.log('se agregó producto')
      const prodId = event.target.name

      const userData = {
        userId
      }
      
      fetch(`/carts/${cartId}/product/${prodId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        })
        .then(response => response.json())
        .then(data => {
          const message = data.message
          console.log(message)
          alert(message);
          location.reload()
  
        })
        .catch(error => console.error(error));       
  }
});



