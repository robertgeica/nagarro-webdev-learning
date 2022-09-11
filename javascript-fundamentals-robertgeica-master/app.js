/* 1. You will be given an array of drinks, with each drink being an object with two properties: name and price. 
Create a function that has the drinks array as an argument and return the drinks objects sorted by price in ascending order. 
Assume that the following array of drink objects needs to be sorted: 
  drinks = [  {name: "lemonade", price: 50},  {name: "lime", price: 10}]
The output of the sorted drinks object will be:
  sortDrinkByPrice(drinks) ➞ [{name: "lime", price: 10}, {name: "lemonade", price: 50}] 
*/

const drinksInput = [
  { name: "lemonade", price: 50},
  { name: "lime", price: 10}
];

const sortDrinkByPrice = (input) => {
  const sortedDrinks = input.sort((a, b) => {return a.price - b.price});
  console.log(`sortDrinkByPrice(drinks) -> ${JSON.stringify(sortedDrinks)}`);
}

sortDrinkByPrice(drinksInput);


/* 2. . A word is on the loose and now has tried to hide amongst a crowd of tall letters! 
Help write a function to detect what the word is, knowing the following rules: The wanted word is in lowercase.
The crowd of letters is all inuppercase. Note that the word will be spread out amongst the random letters, but their letters remain in the same order. Examples: 
  detectWord("UcUNFYGaFYFYGtNUH") ➞ "cat"
  detectWord("bEEFGBuFBRrHgUHlNFYaYr") ➞ "burglar"
  detectWord("YFemHUFBbezFBYzFBYLleGBYEFGBMENTment") ➞ "embezzlement"
*/

const detectWord = (input) => {

  let wantedWord = '';
  for( let i = 0; i < input.length; i++) {
    if(input[i].toLowerCase() == input[i]) {
      wantedWord += input[i]; //
    }
  }
  console.log(`detectWord("${input}") -> ${wantedWord}`);
}
console.log('\n');
detectWord("UcUNFYGaFYFYGtNUH");
detectWord("bEEFGBuFBRrHgUHlNFYaYr");
detectWord("YFemHUFBbezFBYzFBYLleGBYEFGBMENTment");

/* 3. In this challenge you will be given a relation between two numbers, written as a string. 
Write a function that determines if the relation is true or false. Examples: 
  isTrue("2=2") ➞ true
  isTrue("8<7") ➞ false
  isTrue("5=13") ➞ false
  isTrue("15>4") ➞ true 
*/

const isTrue = (input) => {
  // console.log(input);
  let isTrueOrFalse = false;
  const operators = ['>', '=', '<'];

  operators.map(operator => {
    if(input.indexOf(operator) !== -1) {
      const numberLeft = parseInt(input.slice(0, input.indexOf(operator)));
      const numberRight = parseInt(input.slice(input.indexOf(operator)+1, input.length));

      switch(operator) {
        case '=':
          return (isTrueOrFalse = numberLeft === numberRight);
        case '>':
          return (isTrueOrFalse = numberLeft > numberRight);
        case '<':
          return (isTrueOrFalse = numberLeft < numberRight);
      }
    };
  });

  console.log(`isTrue("${input}") -> ${isTrueOrFalse}`);
}
console.log('\n');
isTrue("2=2");
isTrue("8<7");
isTrue("5=13");
isTrue("15>4");


/* 4. Given an object of how many more pages each ink color can print, output the maximum number of pages the printer can print before any of the colors run out.
Examples:
  inkLevels({  "cyan": 23,  "magenta": 12,  "yellow": 10}) ➞ 10
  inkLevels({  "cyan": 432,  "magenta": 543,  "yellow": 777}) ➞ 432
  inkLevels({  "cyan": 700,  "magenta": 700,  "yellow": 0}) ➞ 0
*/
const inkLevels = (input) => {
  let colorsLevel = [];
  for(const color in input) {
    if(input.hasOwnProperty(color)) {
      colorsLevel.push(input[color]);
    }
  };
  
  colorsLevel.sort();
  const maxPrintPages = colorsLevel[0]; 
  console.log(`inkLevels("${JSON.stringify(input)}") -> ${maxPrintPages}`);

}
console.log('\n');
inkLevels({  "cyan": 23,  "magenta": 12,  "yellow": 10});
inkLevels({  "cyan": 432,  "magenta": 543,  "yellow": 777});
inkLevels({  "cyan": 700,  "magenta": 700,  "yellow": 0});


/* 5. A set is a collection of unique items. A set can be formed from an array from removing all duplicate items.
  [1, 3, 3, 5, 5, 5] // original array
  [1, 3, 5] // original array transformed into a set
Create a function that sorts an array and removes all duplicate items from it.
Examples: 
  set([1, 3, 3, 5, 5]) ➞ [1, 3, 5]
  set([4, 4, 4, 4]) ➞ [4]
  set([5, 7, 8, 9, 10, 15]) ➞ [5, 7, 8, 9, 10, 15]
  set([3, 3, 3, 2, 1]) ➞ [1, 2, 3]
*/

const set = (input) => {
  const uniqueItems = [];

  for(let i = 0; i < input.length; i++) {
    if(input[i] !== input[i+1]) {
      uniqueItems.push(input[i]);
    } 
  }

  console.log(`set([${input}]) -> [${uniqueItems.sort((a, b) => a - b)}]`);
}
console.log('\n');
set([1, 3, 3, 5, 5]);
set([4, 4, 4, 4]);
set([5, 7, 8, 9, 10, 15]);
set([3, 3, 3, 2, 1]);