document.addEventListener('DOMContentLoaded', () => {


  let url = 'http://localhost:3000/api/products/'
  let Qty = 0
  let totalPriceAdd = 0
  let promises = []


  let objJson = JSON.parse(sessionStorage.getItem('articles'))
  for (let i = 0; i < objJson.length; i++) {
    let requete = fetch(url + objJson[i].id)
      .then((resp) => resp.json())
      .then(function (data) {
        let section = document.getElementById('cart__items')
        let article = createArticle('cart__item', objJson[i].id, objJson[i].color)
        let divImg = createDiv('cart__item__img')
        let img = createImg(data['imageUrl'], data['altTxt'])
        addChild(divImg, img)
        addChild(article, divImg)
        addChild(section, article)
        let divContent = createDiv('cart__item__content')
        let divDescription = createDiv('cart__item__content__description')
        addChild(divContent, divDescription)
        let h2 = createH2('', data['name'])
        let pColor = createP('', objJson[i].color)
        let pPrice = createP('', data['price'] + '€')
        addChild(divDescription, h2)
        addChild(divDescription, pColor)
        addChild(divDescription, pPrice)
        addChild(article, divContent)
        let divSettings = createDiv('cart__item__content__settings')
        let divSettQty = createDiv('cart__item__content__settings__quantity')
        addChild(divSettings, divSettQty)
        let pQty = createP('', 'Qté :')
        addChild(divSettQty, pQty)
        let input = createInput('itemQuantity', objJson[i].count)
        addChild(divSettQty, input)
        let divSettDel = createDiv('cart__item__content__settings__delete')
        addChild(divSettings, divSettDel)
        let pDel = createP('deleteItem', 'Supprimer')
        addChild(divSettDel, pDel)
        addChild(article, divSettings)
        let totalQty = document.getElementById('totalQuantity')
        let totalPrice = document.getElementById('totalPrice')
        Qty = Qty + parseInt(objJson[i].count)
        totalQty.textContent = Qty
        totalPriceAdd = totalPriceAdd + parseInt(objJson[i].count) * parseInt(data['price'])
        totalPrice.textContent = totalPriceAdd
      })
      .catch(function (error) {
        console.log(error)
      })
    promises.push(requete)
  }

  Promise.all(promises)
    .then(function () {
      const htmlCollection = document.getElementsByClassName('deleteItem')

      for (let j = 0; j < htmlCollection.length; j++) {
        htmlCollection[j].addEventListener('click', function (event) {
          let toDelete = event.target.closest('article.cart__item')
          let settings = event.target.closest('div.cart__item__content__settings')
          let price = toDelete.querySelectorAll('p')
          let number = settings.querySelector('.itemQuantity')
          deleteNbItems(number.value)
          deletePrice(number.value,parseInt(price[1].textContent.slice(0,-1)))
          toDelete.remove()
        })

      }
    })

    .then(function () {
      const inputs = document.getElementsByClassName('itemQuantity')

      for (let k = 0; k < inputs.length; k++) {
        inputs[k].addEventListener('change', function() {
          
        })
        
      }
    })



})

function addChild(parent, child) {
  parent.appendChild(child)
}

function createArticle(classname, data1, data2) {
  let article = document.createElement('article')
  article.setAttribute('class', classname)
  article.dataset.id = data1
  article.dataset.color = data2
  return article
}

function createDiv(classname) {
  let div = document.createElement('div')
  div.setAttribute('class', classname)
  return div
}

function createH2(classname, text) {
  let h2 = document.createElement('h2')
  h2.setAttribute('class', classname)
  h2.textContent = text
  return h2
}

function createP(classname, text) {
  let p = document.createElement('p')
  p.setAttribute('class', classname)
  p.textContent = text
  return p
}

function createImg(source, alt) {
  let img = document.createElement('img')
  img.src = source
  img.alt = alt
  return img
}

function createInput(classname, value) {
  let input = document.createElement('input')
  input.setAttribute('class', classname)
  input.name = classname
  input.type = 'number'
  input.value = value
  input.min = 1
  input.max = 100
  return input
}

/*function removeFromStorage(data1, data2) {

}*/

function deleteNbItems(number) {
  let totalItems = document.getElementById('totalQuantity')
  let totalItemsNb = parseInt(totalItems.textContent) - number
  totalItems.textContent = totalItemsNb
}

function deletePrice(number, price) {
  let totalPrice = document.getElementById('totalPrice')
  let finalPrice = parseInt(totalPrice.textContent) - (number * price)
  totalPrice.textContent = finalPrice
}