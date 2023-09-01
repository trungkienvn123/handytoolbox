const myInterval = setInterval(myTimer, 1000);
function myTimer() {
  const date = new Date();
  document.getElementById("subClock").innerHTML = date.toLocaleTimeString('en-US');
}
function closeFunction(){
  document.querySelector(".sub-clock").style.display = "none";
  document.querySelector(".close-icon").style.display = "none";    }

function clockAppear(){
  document.querySelector(".sub-clock").style.display="block";
  document.querySelector(".close-icon").style.display="block";
}
function updateClock(){
  let now = new Date();
  let second = now.getSeconds();
  let minute = now.getMinutes();
  let hour = now.getHours();
  document.getElementById("second").style.transform = `rotate(${90 + second * 6 }deg)`;
  document.getElementById("minute").style.transform = `rotate(${90 + minute * 6 }deg)`;
  document.getElementById("hour").style.transform = `rotate(${90 + hour * 30 }deg)`;
}
setInterval(updateClock,1000);
