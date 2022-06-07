let pageUrl = window.location.href.toString()
let searchParams = new URLSearchParams(pageUrl)
console.log(searchParams.get('id'))