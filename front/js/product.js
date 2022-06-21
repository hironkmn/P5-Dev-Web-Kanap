let url = 'http://localhost:3000/api/products/'

let pageUrl = window.location.href
let searchParams = new URLSearchParams(new URL(pageUrl).search)
let id = searchParams.get('id');

fetch(url+id)
.then((resp) => resp.json())
.then(function (data){
    let select = document.getElementById('colors')
    let divImg = document.getElementsByClassName('item__img')
    let img = document.createElement('img')
    let title = document.getElementById('title')
    let price = document.getElementById('price')
    let description = document.getElementById('description')
    img.src = data['imageUrl']
    img.alt = data['altTxt']
    divImg[0].appendChild(img)
    title.textContent = data['name']
    price.textContent = data['price']
    description.textContent = data['description']
    for (let i = 0; i < data['colors'].length; i++) {
        select.options[select.options.length] = new Option(data['colors'][i],data['colors'][i]);
    }
})
.catch(function(error) {
  console.log(error);
});

function saveCart(cart) {
  sessionStorage.setItem("articles", JSON.stringify(cart))
}

function getCart() {
  let cart = sessionStorage.getItem("articles")
  if (cart == null) {
    return []
  } else {
      return JSON.parse(cart)
  }
}

function getArticle() {
  let objJson = {}
  let colors = document.getElementById('colors')
  let color = colors.options[colors.selectedIndex].value
  let number = document.getElementById('quantity').value
  objJson.id = id
  objJson.color = color
  objJson.count = number
  console.log(number)
  return objJson
  
}

const button = document.getElementById('addToCart')
button.addEventListener("click", function() {
  let article = getArticle()
  let cart = getCart()
  let foundArticle = cart.find(p => p.id == article.id && p.color == article.color)
  if (foundArticle != undefined) {
    alert('Votre article a été ajouté au panier !')
    foundArticle.count++
  } else {
    if (article.color != '' && article.number != 0) {
      alert('Votre article a été ajouté au panier !')
      cart.push(article)
    }
  }
  saveCart(cart)
})