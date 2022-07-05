let pageUrl = window.location.href //Récupération de l'URL de la page
let searchParams = new URLSearchParams(new URL(pageUrl).search)
let id = searchParams.get('id') //Récupération de l'id dans l'URL

let orderId = document.getElementById('orderId')
orderId.textContent = id //Affichage de l'id sur la page