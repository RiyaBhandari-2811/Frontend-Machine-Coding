let btn = document.querySelector("#submit");

let num = [Math.floor(Math.random()*99)]

btn.addEventListener("click" , () => {
    let score = document.querySelector(".score");
    let input = parseInt(document.querySelector("#num").value) ;

    if(input == num || input == 100) {
        score.textContent = ` Right Guess Number was ${input}` 
        setTimeout(() => {
            document.querySelector("#num").value = ""
            score.textContent = "";
        }, 1500);
    }else if (input < num){
        score.textContent = ` Guess is Low` 
    }else{
        score.textContent = ` Guess is High` 
    }

})