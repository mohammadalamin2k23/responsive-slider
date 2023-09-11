// Slider (all slides in a container)
const slider = document.querySelector(".slider");
// All trails
const trail = document.querySelectorAll(".trail div");

// Transform value
let value = 0;
// Trail index number
let trailValue = 0;
// Interval (Duration)
let interval = 4000;

// Function to slide forward
const slide = (direction) => {
  // Clear interval
  clearInterval(start);

  // Update value and trailValue
  direction === "next" ? incrementValue() : decrementValue();

  // Move slide
  moveSlider(value, trailValue);

  // Restart Animation
  animate();

  // Start interval for slides back
  start = setInterval(() => slide("next"), interval);
};

// Function for increasing (forward, next) configuration
const incrementValue = () => {
  // Remove active from all trails
  trail.forEach(cur => cur.classList.remove("active"));

  // Increase transform value
  value = (value + 20) % 100;

  // Update trailValue based on value
  updateTrailValue();
};

// Function for decreasing (backward, previous) configuration
const decrementValue = () => {
  // Remove active from all trails
  trail.forEach(cur => cur.classList.remove("active"));

  // Decrease transform value
  value = (value - 20 + 100) % 100;

  // Update trailValue based on value
  updateTrailValue();
};

// Function to transform slide
const moveSlider = (transformValue, trailIndex) => {
  // Transform slider
  slider.style.transform = `translateX(-${transformValue}%)`;
  // Add active class to the current trail
  trail[trailIndex].classList.add("active");
};

const tl = gsap.timeline({ defaults: { duration: 0.6, ease: "power2.inOut" } });
tl.from(".bg", { x: "-100%", opacity: 0 })
  .from("p", { opacity: 0 }, "-=0.3")
  .from("h1", { opacity: 0, y: "30px" }, "-=0.3")
  .from("button", { opacity: 0, y: "-40px" }, "-=0.8");

// Function to restart animation
const animate = () => tl.restart();

// Function to update trailValue based on slide value
const updateTrailValue = () => {
  trailValue = value / 20;
};

// Start interval for slides
let start = setInterval(() => slide("next"), interval);

// Next and Previous button function (SVG icon with different classes)
document.querySelectorAll("svg").forEach(cur => {
  // Assign function based on the class Name ("next" and "prev")
  cur.addEventListener("click", () =>
    cur.classList.contains("next") ? slide("next") : slide("previous")
  );
});

// Function to slide when trail is clicked
const clickCheck = e => {
  // Clear interval
  clearInterval(start);
  // Remove active class from all trails
  trail.forEach(cur => cur.classList.remove("active"));
  // Get selected trail
  const check = e.target;
  // Add active class
  check.classList.add("active");

  // Update slide value based on the selected trail
  value = parseInt(check.dataset.slideValue, 10);
  // Update trail based on value
  updateTrailValue();
  // Transform slide
  moveSlider(value, trailValue);
  // Start animation
  animate();
  // Start interval
  start = setInterval(() => slide("next"), interval);
};

// Add function to all trails
trail.forEach(cur => cur.addEventListener("click", clickCheck));

// Mobile touch Slide Section
const touchSlide = (() => {
  let start, move, change, sliderWidth;

  // Do this on initial touch on screen
  slider.addEventListener("touchstart", e => {
    // Get the touch position of X on the screen
    start = e.touches[0].clientX;
    // (each slide width) the width of the slider container divided by the number of slides
    sliderWidth = slider.clientWidth / trail.length;
  });

  // Do this on touchDrag on screen
  slider.addEventListener("touchmove", e => {
    // Prevent default function
    e.preventDefault();
    // Get the touch position of X on the screen when dragging stops
    move = e.touches[0].clientX;
    // Subtract initial position from end position and save it to change variable
    change = start - move;
  });

  const mobile = () => {
    // If change is greater than a quarter of sliderWidth, move to the next slide, else do nothing
    change > sliderWidth / 4 ? slide("next") : null;
    // If change * -1 is greater than a quarter of sliderWidth, move to the previous slide, else do nothing
    change * -1 > sliderWidth / 4 ? slide("previous") : null;
    // Reset all variables to 0
    [start, move, change, sliderWidth] = [0, 0, 0, 0];
  };

  // Call mobile on touch end
  slider.addEventListener("touchend", mobile);
})();
