document.addEventListener('DOMContentLoaded', () => {


  let url = 'http://localhost:3000/api/products/'
  let Qty = 0
  let totalPriceAdd = 0
  let promises = []


  let objJson = JSON.parse(localStorage.getItem('articles'))
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
          // Fonction qui permet de supprimer le produit via le bouton supprimer
          let toDelete = event.target.closest('article.cart__item')
          let settings = event.target.closest('div.cart__item__content__settings')
          let price = toDelete.querySelectorAll('p')
          let number = settings.querySelector('.itemQuantity')
          let dataId = toDelete.dataset.id
          let dataColor = toDelete.dataset.color
          removeFromStorage(dataId, dataColor)
          deleteNbItems(number.value)
          deletePrice(number.value, parseInt(price[1].textContent.slice(0, -1)))
          removeFromStorage('')
          toDelete.remove()
        })
      }
    })

    .then(function () {
      const inputs = document.getElementsByClassName('itemQuantity')
      for (let k = 0; k < inputs.length; k++) {
        // Fonction qui permet de modifier les quantités via l'input de chaque produit
        inputs[k].addEventListener('change', function (event) {
          event.preventDefault()
          let valueToChange = event.target.value
          let article = event.target.closest('article.cart__item')
          let elements = article.querySelectorAll('p')
          let price = parseInt(elements[1].textContent.slice(0, -1))
          let dataId = article.dataset.id
          let dataColor = article.dataset.color
          changeTotalPrice(dataId, dataColor, valueToChange, price)
          changeTotalQty()

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

function removeFromStorage(data1, data2) {
  // Fonction qui supprime le produit correspondant du localStorage
  let objJson = JSON.parse(localStorage.getItem('articles'))
  for (let i = 0; i < objJson.length; i++) {
    if (objJson[i].id == data1 && objJson[i].color == data2) {
      objJson.pop(i)
    }
    localStorage.setItem("articles", JSON.stringify(objJson))
  }
}

function deleteNbItems(number) {
  // Fonction qui supprime la quantité du produit supprimé dans le localStorage
  let totalItems = document.getElementById('totalQuantity')
  let totalItemsNb = parseInt(totalItems.textContent) - number
  totalItems.textContent = totalItemsNb
}

function deletePrice(number, price) {
  // Fonction qui supprime le prix du produit supprimé dans le localStorage
  let totalPrice = document.getElementById('totalPrice')
  let finalPrice = parseInt(totalPrice.textContent) - (number * price)
  totalPrice.textContent = finalPrice
}

function changeValue(id, color, value) {
  // Fonction qui permet de changer la quantité du produit dans le localStorage
  let objJson = JSON.parse(localStorage.getItem('articles'))
  for (let i = 0; i < objJson.length; i++) {
    if (objJson[i].id == id && objJson[i].color == color) {
      objJson[i].count = value
    }
  }
  localStorage.setItem("articles", JSON.stringify(objJson))
}

function changeTotalPrice(id, color, qty, price) {
  // Fonction qui change le prix total de la commande
  let objJson = JSON.parse(localStorage.getItem('articles'))
  let totalPrice = document.getElementById('totalPrice')
  for (let i = 0; i < objJson.length; i++) {
    if (objJson[i].id == id && objJson[i].color == color && objJson[i].count < qty) {
      totalPrice.textContent = parseInt(totalPrice.textContent) + price
      changeValue(id, color, qty)
    } else if (objJson[i].id == id && objJson[i].color == color && objJson[i].count > qty) {
      totalPrice.textContent = parseInt(totalPrice.textContent) - price
      changeValue(id, color, qty)
    }
  }
}

function changeTotalQty() {
  // Fonction qui change la quantité totale de la commande
  let objJson = JSON.parse(localStorage.getItem('articles'))
  let totalQty = document.getElementById('totalQuantity')
  let totalQtyInt = 0
  for (let i = 0; i < objJson.length; i++) {
    totalQtyInt = totalQtyInt + parseInt(objJson[i].count, 10)
  }
  totalQty.textContent = totalQtyInt
}

let submitButton = document.getElementById('order')
submitButton.addEventListener('click', function (event) {
  // Fonction qui permet d'envoyer le formulaire afin de valider la commande
  event.preventDefault()
  let firstname = document.getElementById('firstName').value
  let lastname = document.getElementById('lastName').value
  let city = document.getElementById('city').value
  let email = document.getElementById('email').value
  let address = document.getElementById('address').value
  let articles = document.querySelectorAll('article')
  regexUsername(firstname, lastname, city)
  regexAddress(address)
  regexEmail(email)
  if (regexUsername(firstname, lastname, city) == true && regexAddress(address) == true && regexEmail(email) == true) {
    let user = createUserObject(firstname, lastname, address, city, email)
    let productsId = getDataId(articles)
    let orderInfos = { contact: user, products: productsId }
    fetch('http://localhost:3000/api/products/order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(orderInfos)
    })
      .then(response => response.json())
      .then(data => {
        localStorage.setItem('orderId', data.orderId)
        document.location.href = 'confirmation.html?id=' + data.orderId
        localStorage.removeItem('orderId')
        localStorage.removeItem('articles')
      })
  }
})

function regexUsername(firstname, lastname, city) {
  // Fonctio
  let masque = /[A-Za-z]/
  let testFirstname = masque.test(firstname)
  let testLastname = masque.test(lastname)
  let testCity = masque.test(city)
  if (testFirstname == false && testLastname == true && testCity == true) {
    alert("Le prénom est incorrect")
    return false
  } else if (testFirstname == true && testLastname == false && testCity == true) {
    alert("Le nom est incorrect.")
    return false
  } else if (testFirstname == true && testLastname == true && testCity == false) {
    alert("Le nom de la ville est incorrect.")
    return false
  } else {
    return true
  }
}

function regexEmail(email) {
  let masque = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
  let testEmail = masque.test(email)
  if (testEmail == false) {
    alert("L'adresse mail est incorrecte.")
    return false
  } else {
    return true
  }
}

function regexAddress(address) {
  let masque = /^\d+\s[A-z]+\s[A-z]+/
  let testAddress = masque.test(address)
  if (testAddress == false) {
    alert("L'adresse est incorrecte.")
    return false
  } else {
    return true
  }
}

function getDataId(array) {
  let id = []
  for (let i = 0; i < array.length; i++) {
    id.push(array[i].dataset.id)
  }
  return id
}

function createUserObject(firstname, lastname, address, city, email) {
  let user = {
    firstName: firstname,
    lastName: lastname,
    address: address,
    city: city,
    email: email
  }
  return user
}