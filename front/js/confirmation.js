let pageUrl = window.location.href
let searchParams = new URLSearchParams(new URL(pageUrl).search)
let id = searchParams.get('id');

let orderId = document.getElementById('orderId')
orderId.textContent = id