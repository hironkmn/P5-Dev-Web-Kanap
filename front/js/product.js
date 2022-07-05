let url = 'http://localhost:3000/api/products/'

let pageUrl = window.location.href
let searchParams = new URLSearchParams(new URL(pageUrl).search)
let id = searchParams.get('id') // Récupération de l'id de l'article

fetch(url+id) // Requête à l'API pour récupérer les informations sur le produit
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
  // Fonction qui sauvegarde le panier dans le localStorage
  localStorage.setItem("articles", JSON.stringify(cart))
}

function getCart() {
  // Fonction qui permet de récupérer le panier dans le localStorage
  let cart = localStorage.getItem("articles")
  if (cart == null) {
    return []
  } else {
      return JSON.parse(cart)
  }
}

function getArticle() {
  // Fonction qui construit un objet contenant les informations du produit
  let objJson = {}
  let colors = document.getElementById('colors')
  let color = colors.options[colors.selectedIndex].value
  let number = document.getElementById('quantity').value
  objJson.id = id
  objJson.color = color
  objJson.count = number
  return objJson  
}

const button = document.getElementById('addToCart')
button.addEventListener("click", function() {
  // Fonction qui ajoute le produit, sa quantité et sa couleur dans le panier
  let article = getArticle()
  let cart = getCart()
  let foundArticle = cart.find(p => p.id == article.id && p.color == article.color) // Vérifier que le produit n'est pas déjà dans le panier
  if (foundArticle != undefined) { // S'il y est, incrémenter la quantité du produit
    alert('Votre article a été ajouté au panier !')
    foundArticle.count++
  } else { // Sinon rajouter le produit au tableau de produits
    if (article.color != '' && article.number != 0) {
      alert('Votre article a été ajouté au panier !')
      cart.push(article)
    }
  }
  saveCart(cart)
})