/*

Table of Contents

- Background Pattern
- Go to Top Button
- Top Nav Menu Button (Mobile Only)
- Highlights Carousel

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


// Top Nav Menu Button (Mobile Only) ------------------------------------------
let top_nav = document.getElementById("top-nav");
let menu_btn = document.getElementById("top-nav-menu-btn");
let open_svg = document.getElementById("menu-btn-open");
let close_svg = document.getElementById("menu-btn-close");
let menu_txt = menu_btn.querySelector("span");
let decorative_line = top_nav.querySelector("hr");
let top_nav_links = document.getElementById("top-nav-links");

// set initial nav state
close_svg.classList.add("hidden");
decorative_line.classList.add("hidden");
top_nav_links.classList.add("hidden");

// menu button toggles nav
menu_btn.onclick = () => {
  // swap SVG's
  open_svg.classList.toggle("hidden");
  close_svg.classList.toggle("hidden");
  // toggle menu button text
  menu_txt.innerHTML==="Menu" ? menu_txt.innerHTML="Close" : menu_txt.innerHTML="Menu";
  // toggle decorative line
  decorative_line.classList.toggle("hidden");
  // toggle nav links
  top_nav_links.classList.toggle("hidden");
}

// Highlights Carousel --------------------------------------------------------
// to prevent button spamming - use throttle
const throttle = (func, delay) => {
  let inProgress = false;
  return (...args) => {
    if (inProgress) {
      return;
    }
    inProgress = true;
    func(...args);
    setTimeout(() => {
      inProgress = false;
    }, delay);
  }
};

class HighlightsCarousel {
  constructor() {
    this.section;    // #highlights
    this.cards;      // #highlights .highlight
    this.counter;    // #highlights-counter
    this.left_btn;   // #highlights-ctrl-left
    this.right_btn;  // highlights-ctrl-right

    this.prev;      // previous highlight card
    this.curr = 0;  // current highlight card
    this.next;      // next highlight card

    this.timer;              // timer object
    this.timerDelay = 5000;  // milliseconds

    // hook to required page components or return
    if (!this._hookToHTML()) return;

    // if less than two cards, disable carousel and return
    this.num_cards = this.cards.length;
    if (this.num_cards < 2) {
      this._disableCarousel();
      return;
    }

    // assign button functionality
    this.left_btn.onclick = throttle(() => {
      this._backBtn();
    }, 750);
    this.right_btn.onclick = throttle(() => {
      this._nextBtn();
    }, 750);

    // configure counter
    this._updateCounter(this.curr+1);

    // pause timer on mouse hover
    this.section.onmouseover = () => this._stopTimer();
    this.section.onmouseout = () => this._startTimer();

    // configure carousel and begin cycle animation
    this._configCarousel();
    this._startTimer();
  }

  /**
  * Function to try to hook to all of the required components for the carousel.
  * Logs custom errors to the console if any are not found. These components are
  * explicitly named within this function instead of being passed into the class
  * constructor, meaning the class can only be used once per page.
  */
  _hookToHTML() {
    try {
      // section
      this.section = document.getElementById("highlights");
      if (!this.section) throw new Error("Highlights section not found.");
      // cards
      this.cards = this.section.getElementsByClassName("highlight");
      // counter
      this.counter = document.getElementById("highlights-counter");
      if (!this.counter) {
        throw new Error("Highlights section has no counter component.");
      }
      // left button
      this.left_btn = document.getElementById("highlights-ctrl-left");
      if (!this.left_btn) {
        throw new Error("Highlights section has no left button component.");
      }
      // right button
      this.right_btn = document.getElementById("highlights-ctrl-right");
      if (!this.right_btn) {
        throw new Error("Highlights section has no right button component.");
      }
    } catch (err) {
      console.error(err);
      return false;
    }
    return true;
  }

  /**
  * Function to hide the carousel's counter, left button, and right button.
  * Called in the class constructor if the carousel has less than 2 cards,
  * since the controls are redundant until there are at least 2 cards.
  */
  _disableCarousel() {
    this.counter.style.display = "None";
    this.left_btn.style.display = "None";
    this.right_btn.style.display = "None";
  }

  /**
  * Function to configure the carousel after successfully hooking to the HTML
  * components and confirming that there are at least 2 cards. Sets the initial
  * state of the cards and their class names for the scrolling animation.
  */
  _configCarousel() {
    // configure prev and next
    this.prev = (this.curr - 1 + this.num_cards) % this.num_cards;
    this.next = (this.curr + 1) % this.num_cards;

    // configure card classes
    if (this.num_cards === 2) {
      this.cards[this.next].classList.add('shift-right');
    } else if (this.num_cards > 2) {
      // all cards
      for (let i=0; i<this.num_cards; i++) {
        this.cards[i].classList.add('no-anim');
        this.cards[i].classList.add('shift-left');
      }
      // curr card
      this.cards[this.curr].classList.remove('shift-left');
      this.cards[this.curr].classList.remove('no-anim');
      // next card
      this.cards[this.next].classList.add('no-anim');
      this.cards[this.next].classList.add('shift-right');
      // first iteration
      this._incrementClasses();
    }
  }

  /**
  * Functions used to stop and start the timer.
  */
  _stopTimer() {
    clearInterval(this.timer);
  }
  _startTimer() {
    clearInterval(this.timer);
    this.timer = setInterval(() => this._timerFunction(), this.timerDelay);
  }

  /**
  * Callback function for the carousel's timer. Directs the action to one of two
  * functions, depending on whether the carousel has 2 or 3+ cards.
  */
  _timerFunction() {
    // special case - two cards
    if (this.num_cards === 2) {
      this._handleTwo();
    // normal case - 3+ cards
    } else {
      this._handleMore();
    }
  }

  /**
  * Functions used to direct the actions required to display the current card.
  * _handleTwo() is only called if there are exactly two cards, whereas
  * _handleMore() is called if there are three or more cards.
  */
  _handleTwo() {
    // toggle displayed card
    this.cards[this.curr].classList.toggle("shift-left");
    this.cards[this.next].classList.toggle("shift-right");
    // update counter
    let twoCurr = (this.cards[this.next].classList.contains('shift-right')) ? 0 : 1;
    this._updateCounter(twoCurr+1);
  }
  _handleMore(forwards=true) {
    if (forwards) {
      this._incrementIndeces();
      this._incrementClasses();
      this._updateCounter(this.curr+1);
    } else {
      this._decrementIndeces();
      this._decrementClasses();
      this._updateCounter(this.curr+1);
    }
  }

  /**
  * Functions used to increase/decrease the prev/curr/next cards' indeces for
  * the carousel animation. Only used if the carousel has three or more cards.
  */
  _incrementIndeces() {
    this.curr = (this.curr + 1) % this.num_cards;
    this.prev = (this.curr - 1 + this.num_cards) % this.num_cards;
    this.next = (this.curr + 1) % this.num_cards;
  }
  _decrementIndeces() {
    this.curr = (this.curr - 1 + this.num_cards) % this.num_cards;
    this.prev = (this.curr - 1 + this.num_cards) % this.num_cards;
    this.next = (this.curr + 1) % this.num_cards;
  }

  /**
  * Functions used to update the classes required to display the current card in
  * the carousel animation. Only used if the carousel has three or more cards.
  */
  _incrementClasses() {
    // prev
    this.cards[this.prev].classList.add('shift-left');
    // curr
    this.cards[this.curr].classList.remove('no-anim');
    this.cards[this.curr].classList.remove('shift-right');
    // next
    this.cards[this.next].classList.add('no-anim');
    this.cards[this.next].classList.remove('shift-left');
    this.cards[this.next].classList.add('shift-right');
  }
  _decrementClasses() {
    // prev
    this.cards[this.prev].classList.add('no-anim');
    this.cards[this.prev].classList.remove('shift-right');
    this.cards[this.prev].classList.add('shift-left');
    // curr
    this.cards[this.curr].classList.remove('no-anim');
    this.cards[this.curr].classList.remove('shift-left');
    // next
    this.cards[this.next].classList.add('shift-right');
  }

  /**
  * Function used to update the text within the counter element.
  */
  _updateCounter(val) {
    this.counter.innerHTML = val + ' / ' + this.num_cards;
  }

  /**
  * Functions used to add functionality to the carousel's back and next buttons.
  */
  _backBtn() {
    if (this.num_cards === 2) {
      this._handleTwo();
    } else {
      this._handleMore(false);
    }
    this._startTimer();
  }
  _nextBtn() {
    if (this.num_cards === 2) {
      this._handleTwo();
    } else {
      this._handleMore(true);
    }
    this._startTimer();
  }
}

// add carousel object to page
new HighlightsCarousel();
