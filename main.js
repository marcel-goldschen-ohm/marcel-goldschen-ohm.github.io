/*

Table of Contents

- Background Pattern
- Go to Top Button

*/


// Background Pattern ---------------------------------------------------------
// add random squares to background element
var bg = document.getElementById("bg");
var rand_span;
var rand_x;
var rand_y;
var rand_size;
var rand_rotation;
for (i=0; i<30; i++) {
  rand_span = document.createElement("span");
  // generate random attributes
  rand_x = Math.floor(Math.random() * 100);         // 0 to 100 vw
  rand_y = Math.floor(Math.random() * 100);         // 0 to 100 vh
  rand_size = Math.floor(Math.random() * 15) + 10;  // 10 to 25 vmin
  rand_rotation = Math.floor(Math.random() * 360);  // 0 to 360 deg
  // set CSS styles
  rand_span.style.left = rand_x + "vw";
  rand_span.style.top = rand_y + "vh";
  rand_span.style.width = rand_size + "vmin";
  rand_span.style.height = rand_size + "vmin";
  rand_span.style.transform = "rotate(" + rand_rotation + "deg)";
  // place in bg
  bg.insertAdjacentElement("beforeend", rand_span);
}


// Go to Top Button -----------------------------------------------------------
var gototop = document.getElementById("gototop");
window.onscroll = function() {
  if (
    (document.body.scrollTop > 250) ||
    (document.documentElement.scrollTop > 250)
  ) { gototop.style.display = "block"; }
  else { gototop.style.display = "none"; }
}


// Highlights Carousel --------------------------------------------------------
let highlights_section = document.getElementById("highlights");
let highlights = highlights_section.getElementsByClassName("highlight");
let num_cards = highlights.length;

// Pause Animation on Mouse Hover
let hovering = false;
highlights_section.onmouseover = function() {
  hovering = true;
}
highlights_section.onmouseout = function() {
  hovering = false;
  resetTimer();
}

// Automatically Cycle Between Cards
let curr = 0;
let prev = (curr - 1 + num_cards) % num_cards;
let next = (curr + 1) % num_cards;

// configure the required initial card classes
function configClasses() {
  for (let i=0; i<num_cards; i++) {
    highlights[i].classList.add('no-anim');
    highlights[i].classList.add('shift-left');
  }

  highlights[curr].classList.remove('shift-left');
  highlights[curr].classList.remove('no-anim');

  highlights[next].classList.add('no-anim');
  highlights[next].classList.add('shift-right');
}
configClasses();

// update the classes for the appropriate cards at each iteration
function incrementClasses() {
  highlights[prev].classList.add('shift-left');

  highlights[curr].classList.remove('no-anim');
  highlights[curr].classList.remove('shift-right');

  highlights[next].classList.add('no-anim');
  highlights[next].classList.remove('shift-left');
  highlights[next].classList.add('shift-right');
}
incrementClasses();  // first iteration

function decrementClasses() {
  highlights[prev].classList.add('no-anim');
  highlights[prev].classList.remove('shift-right');
  highlights[prev].classList.add('shift-left');

  highlights[curr].classList.remove('no-anim');
  highlights[curr].classList.remove('shift-left');

  highlights[next].classList.add('shift-right');
}

// keep track of which cards to update at each iteration
function incrementIndeces() {
  curr = (curr + 1) % num_cards;
  prev = (curr - 1 + num_cards) % num_cards;
  next = (curr + 1) % num_cards;
}

function decrementIndeces() {
  curr = (curr - 1 + num_cards) % num_cards;
  prev = (curr - 1 + num_cards) % num_cards;
  next = (curr + 1) % num_cards;
}

// Visual Counter
let counter = document.getElementById("highlights-counter");

// update counter at each iteration
function updateCounter() {
  counter.innerHTML = curr+1 + ' / ' + num_cards;
}
updateCounter();  // first iteration


// Cycle Functionality
function mainTimerFunction() {
  if (hovering) return;  // pause on mouse hover
  // perform required changes
  incrementIndeces();
  updateCounter();
  incrementClasses();
}

// reset timer when user stop hovering
function resetTimer() {
  clearInterval(mainTimer);
  mainTimer = setInterval(mainTimerFunction, 5000);
}

// initial timer
let mainTimer = setInterval(mainTimerFunction, 5000);


// Button Controls
let left_btn = document.getElementById("highlights-ctrl-left");
let right_btn = document.getElementById("highlights-ctrl-right");

function backBtn() {
  decrementIndeces();
  updateCounter();
  decrementClasses();
  resetTimer();
}

function nextBtn() {
  incrementIndeces();
  updateCounter();
  incrementClasses();
  resetTimer();
}

left_btn.onclick = () => backBtn();
right_btn.onclick = () => nextBtn();
