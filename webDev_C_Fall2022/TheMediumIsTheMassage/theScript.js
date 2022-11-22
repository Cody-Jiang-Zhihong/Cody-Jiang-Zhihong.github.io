console.log("DEEZ")
words = document.getElementsByClassName("word"); 
var vels = [];
function shuffle(){
    for (let i = 0; i < words.length; i++){
        let word = document.getElementById(i.toString())
        word.style.top = Math.round(Math.random()*97.5) + "vh"
        word.style.left = Math.round(Math.random()*96.5) + "vw"
    }
}
var body = document.querySelector("body")
body.addEventListener("mousemove", function() { shuffle() })
