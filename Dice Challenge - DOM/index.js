// FOR THE FIRST DICE 
var randomNumber1 = Math.floor(Math.random() * 6) + 1;

var randomImage1 = "dice" + randomNumber1 + ".png";

var randomImageSrc1 = "Images/" + randomImage1;

document.querySelector(".img1").setAttribute("src", randomImageSrc1);


// FOR THE SECOND DICE 
var randomNumber2 = Math.floor(Math.random() * 6) + 1;

var randomImage2 = "dice" + randomNumber2 + ".png";

var randomImageSrc2 = "Images/" + randomImage2;

document.querySelector(".img2").setAttribute("src", randomImageSrc2);

if (randomNumber1 > randomNumber2) {
    document.querySelector("h1").innerHTML = "&#128681 Player 1 Wins!";
} else if (randomNumber1 < randomNumber2 ) {
    document.querySelector("h1").innerHTML = "Player 2 Wins! &#128681";
} else {
    document.querySelector("h1").innerHTML = "We have a Draw!";
}