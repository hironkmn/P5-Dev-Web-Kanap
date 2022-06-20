const url = 'http://localhost:3000/api/products';

fetch(url)
.then((resp) => resp.json())
.then(function(data) {
  console.log(data[0])
  let section = document.getElementById('items')
  let productUrl = "./product.html?id="
  for (let i = 0; i < data.length; i++) {
    let a = document.createElement('a')
    let article = document.createElement('article')
    let img = document.createElement('img')
    let h3 = document.createElement('h3')
    let p = document.createElement('p')
    h3.setAttribute('class','productName')
    p.setAttribute('class','productDescription')
    a.href = productUrl + data[i]['_id']
    img.src = data[i]['imageUrl']
    img.alt = data[i]['altTxt']
    h3.textContent = data[i]['name']
    p.textContent = data[i]['description']
    section.appendChild(a)
    a.appendChild(article)
    article.appendChild(img)
    article.appendChild(h3)
    article.appendChild(p)
  }
  let article = document.createElement('article')

})
.catch(function(error) {
  console.log(error);
});