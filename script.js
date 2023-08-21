const myInterval = setInterval(myTimer, 1000);
function myTimer() {
  const date = new Date();
  document.getElementById("clock").innerHTML = date.toLocaleTimeString('en-US');
  document.getElementById("subClock").innerHTML = date.toLocaleTimeString('en-US');
}
function myFunction(){
  document.getElementById("clock-part").style.display = "none";    }


function myFunction2(){
  document.getElementById("clock").style.position="fixed"
  document.getElementById("clock").style.top="0"
}
function clockAppear(){
  document.querySelector(".sub-clock").style.display="block"
}