let values = document.querySelectorAll(".num");
let interval = 5000 ;

values.forEach((value) => {
    let startValue = 0 ;
    let endValue = parseInt(value.getAttribute("data-val"));
    let duration = Math.floor(interval / endValue);
    let counter = setInterval(function () {
        startValue += 5 ;
        value.textContent = startValue ;
        if(startValue == endValue){
            clearInterval(counter);
        }
    }, duration);
})