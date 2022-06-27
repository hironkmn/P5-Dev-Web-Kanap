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
        let article = document.createElement('article')
        article.setAttribute('class', 'cart__item')
        article.dataset.id = objJson[i].id
        article.dataset.color = objJson[i].color
        let divImg = document.createElement('div')
        divImg.setAttribute('class', 'cart__item__img')
        let img = document.createElement('img')
        img.src = data['imageUrl']
        img.alt = data['altTxt']
        divImg.appendChild(img)
        article.appendChild(divImg)
        section.appendChild(article)
        let divContent = document.createElement('div')
        let divDescription = document.createElement('div')
        divContent.setAttribute('class', 'cart__item__content')
        divDescription.setAttribute('class', 'cart__item__content__description')
        divContent.appendChild(divDescription)
        let h2 = document.createElement('h2')
        let pColor = document.createElement('p')
        let pPrice = document.createElement('p')
        h2.textContent = data['name']
        pColor.textContent = objJson[i].color
        pPrice.textContent = data['price'] + '€'
        divDescription.appendChild(h2)
        divDescription.appendChild(pColor)
        divDescription.appendChild(pPrice)
        article.appendChild(divContent)
        let divSettings = document.createElement('div')
        divSettings.setAttribute('class', 'cart__item__content__settings')
        let divSettQty = document.createElement('div')
        divSettQty.setAttribute('class', 'cart__item__content__settings__quantity')
        divSettings.appendChild(divSettQty)
        let pQty = document.createElement('p')
        pQty.textContent = 'Qté :'
        divSettQty.appendChild(pQty)
        let input = document.createElement('input')
        input.setAttribute('class', 'itemQuantity')
        input.type = 'number'
        input.name = 'itemQuantity'
        input.value = objJson[i].count
        input.min = 1
        input.max = 100
        divSettQty.appendChild(input)
        let divSettDel = document.createElement('div')
        divSettDel.setAttribute('class', 'cart__item__content__settings__delete')
        divSettings.appendChild(divSettDel)
        let pDel = document.createElement('p')
        pDel.setAttribute('class', 'deleteItem')
        pDel.textContent = 'Supprimer'
        divSettDel.appendChild(pDel)
        article.appendChild(divSettings)
        let totalQty = document.getElementById('totalQuantity')
        let totalPrice = document.getElementById('totalPrice')
        Qty = Qty + parseInt(objJson[i].count)
        totalQty.textContent = Qty
        totalPriceAdd = totalPriceAdd + parseInt(objJson[i].count) * parseInt(data['price'])
        totalPrice.textContent = totalPriceAdd
      })
      .catch(function (error) {
        console.log(error);
      })
    promises.push(requete)
  }

  Promise.all(promises)
    .then(function () {
      const htmlCollection = document.getElementsByClassName('deleteItem')
      console.log(htmlCollection)

      for (let j = 0; j < htmlCollection.length; j++) {
        htmlCollection[j].addEventListener('click', function (event) {
          let toDelete = event.target.closest('article.cart__item')
          console.log(toDelete)
          toDelete.remove()
        });

      }
    })



})