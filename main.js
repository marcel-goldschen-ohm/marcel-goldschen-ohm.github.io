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

// debounce functionality (only trigger once per scroll)
const debounce = (fn, delay) => {
  let timerId;
  return (...args) => {
    clearTimeout(timerId);
    timerId = setTimeout(fn, delay, [...args]);
  };
};

// debounced change handler
const debouncedChangeHandler = debounce(() => {
  if (
    (document.body.scrollTop > 250) ||
    (document.documentElement.scrollTop > 250)
  ) { gototop.style.display = "block"; }
  else { gototop.style.display = "none"; }
}, 250);  // fires after scroll event has stopped for at least 250ms

// toggle gototop visibility based on page scroll position
window.addEventListener("scroll", debouncedChangeHandler);
