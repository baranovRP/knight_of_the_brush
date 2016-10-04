/* eslint no-use-before-define: ["error", { "functions": false }] */
/* eslint no-global-assign: "warn" */
/* eslint-env browser */

import Circle from './circle';

let counter = 0;

export default function Playfield() {
  this.node = document.body;
  this.fieldEvents();
  this.circles = init();
  this.render(this.circles);
}

Playfield.prototype.render = function render(l) {
  const self = this.node;
  [...l].forEach(item => self.appendChild(item.node));
};

Playfield.prototype.addCircle = function addCircle(circle) {
  this.circles.push(circle);
  this.node.appendChild(circle.node);
};

Playfield.prototype.removeCircle = function addCircle(circle) {
  const idToRemove = circle.getAttribute('id');
  this.circles = this.circles.filter(i => i.node.getAttribute('id') !== idToRemove);
  this.node.removeChild(circle);
};

Playfield.prototype.fieldEvents = function fieldEvents() {
  this.node.addEventListener('dblclick', event => {
    const target = event.target;
    if (target.classList.contains('circle')) {
      this.removeCircle(event.target);
    } else if (target === this.node) {
      const center = { x: event.clientX, y: event.clientY };
      if (!isCrossed(this.circles, center)) {
        this.addCircle(new Circle(center, counter++));
      }
    }
  });
};

/**
 * Create initial set of circles
 * @returns {Array}
 */
function init() {
  const length = 10;
  const coords = [];
  while (coords.length < length) {
    const center = randomCoordinates();
    if (!isCrossed(coords, center)) {
      coords.push(new Circle(center, counter++));
    }
  }
  return coords;
}

/**
 * Generate random coordinates
 * @returns {{x: number, y: number}}
 */
function randomCoordinates() {
  const radius = 50;
  const width = this.node.clientWidth;
  const height = this.node.clientHeight;

  const newX = randomInt(radius, width - radius);
  const newY = randomInt(radius, height - radius);

  return { x: newX, y: newY };
}

/**
 * Generate random int including both limits (min, max)
 * @param {number} mn
 * @param {number} mx
 * @returns {number}
 */
function randomInt(mn, mx) {
  const min = Math.ceil(mn);
  const max = Math.floor(mx);
  return Math.floor(Math.random() * ((max - min) + 1)) + min;
}

/**
 * Check is circle crossed with any item in the list
 * @param {Array<Object>} l
 * @param {Object} center
 * @returns {*}
 */
function isCrossed(l, center) {
  const radius = 50;

  if (l.length === 0) {
    return false;
  }
  return l.some(el => {
    const xPow = (el.coordinates.x - center.x) * (el.coordinates.x - center.x);
    const yPow = (el.coordinates.y - center.y) * (el.coordinates.y - center.y);
    return radius * 2 > Math.sqrt(xPow + yPow);
  });
}
