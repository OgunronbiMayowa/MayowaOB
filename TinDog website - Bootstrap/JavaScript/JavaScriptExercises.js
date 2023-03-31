// FIZZBUZZ USING FOR LOOP
// for (let i = 1; i < 101; i++) {
//     if (i % 3 === 0 && i % 5 === 0)  {
//         console.log('FizzBuzz')
//     }  else if (i % 3 === 0)  {
//         console.log('Fizz')
//     } else if (i % 5 === 0)  {
//         console.log('Buzz')
//     } else {
//         console.log(i);
//     }
// }


// FIZZBUZZ USING WHILE LOOP
// let i = 1;
// while (i < 100) {
//     if (i % 3 === 0 && i % 5 === 0)  {
//         console.log('FizzBuzz')
//     }  else if (i % 3 === 0)  {
//         console.log('Fizz')
//     } else if (i % 5 === 0)  {
//         console.log('Buzz')
//     } else {
//         console.log(i);
//     }

//     i++;
// }


// BMI CALCULATOR
// var weight = prompt("Input weight in KG?");
// var height = prompt("Input height in Meter?");

// var bmi = Math.round(weight / (height*height))
// alert("Your BMI result is " + bmi );


// CROSS-CHECKING GUEST LIST USING ARRAY
// var guestList = ["Angela", "John", "Banke", "Salewa", "Abike", "Prince"];
// var input = prompt("What is your name?");
// if (guestList.includes(input)) {
//     alert('Welcome ' + input + ". Have fun!")
// } else {
//     alert("Oooops, not today. Please try some other time!")
// }



// FIBONACCI CHALLENGE
// function fibonacciGenerator(n) {
//     var result = [];

//     if (n === 1) {
//         result = [0];
//     } else if (n === 2) {
//         result = [0,1]
//     } else {
//         result = [0,1];
//         for (let i = 2; i < n; i++) {
//             result.push(result[(result.length) - 2] + result[(result.length) - 1]);
//         }
//     }
//     return result;
// }

// var output = fibonacciGenerator(6);
// console.log(output);

