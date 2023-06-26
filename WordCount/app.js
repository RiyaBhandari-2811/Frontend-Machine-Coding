let txtarea = document.querySelector("#txtarea ");
let noOfWord = document.querySelector("#noOfWord ");
let noOfChar = document.querySelector("#noOfChar ");

txtarea.addEventListener("input", () => {
  // Count no of characters , it includes whitespaces also
  noOfChar.textContent = txtarea.value.length;

  // Now to calculate words
  // First we get the entire string and remove the spaces from both the side
  let data = txtarea.value.trim();

  //data.split(/\s+/): This line of code splits the string data into an array of substrings using a regular expression /\s+/ as the separator. The regular expression \s+ matches one or more consecutive whitespace characters, such as spaces, tabs, or line breaks. So, the string is split wherever there is one or more whitespace characters. For example, if data is "Hello World", this code will create an array ["Hello", "World"].

  //.filter((item) => item): This is a filtering operation performed on the resulting array from the previous step. The filter() method is used to create a new array with all elements that pass a certain condition. In this case, the condition is (item) => item, which is an arrow function that checks if the item is truthy. In JavaScript, values such as empty strings, null, undefined, and false are considered falsy, while any other non-empty string or value is considered truthy. Therefore, this line of code filters out any falsy values from the array, effectively removing any empty strings. For example, if the array is ["Hello", "", "World"], this code will create a new array ["Hello", "World"].

  //.length: Finally, the .length property is accessed on the filtered array. This property returns the number of elements in the array.

  noOfWord.textContent = data.split(/\s+/).filter((item) => item).length;
});
