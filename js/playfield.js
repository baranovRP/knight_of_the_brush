/* eslint no-use-before-define: ["error", { "functions": false }] */
/* eslint no-global-assign: "warn" */
/* eslint-env browser */

import Circle from './circle';

let counter = 0;

export default function Playfield(radius) {
  const size = 10;
  this.radius = radius;
  this.node = document.body;
  this.fieldEvents();
  this.circles = init(this, size, (this.radius * 2));
  this.render(this.circles);
}

Playfield.prototype.render = function render(l) {
  const self = this.node;
  self.innerHTML = '';
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
  const self = this;
  this.node.addEventListener('dblclick', event => {
    const target = event.target;
    if (target.classList.contains('circle')) {
      this.removeCircle(event.target);
    } else if (target === this.node) {
      const center = { x: event.clientX, y: event.clientY };
      if (!isCrossed(this.circles, center, (self.radius * 2))) {
        this.addCircle(new Circle(center, counter++, self.radius));
      }
    }
  });
  this.node.addEventListener('circlemove', event => {
    const circle = event.detail.circle;
    let list = this.circles.filter(i => i !== circle);

    while (isCrossed(list, circle.coordinates, (self.radius / 2))) {
      const nearestCircle = list.reduce((previous, current) => {
        const minDist = calcDistance(previous.coordinates, circle.coordinates);
        const currDist = calcDistance(current.coordinates, circle.coordinates);
        return minDist > currDist ? current : previous;
      }, list[0]);

      if (self.radius / 2 > calcDistance(nearestCircle.coordinates, circle.coordinates)) {
        circle.color = mixColors(nearestCircle.color, circle.color);
        circle.coordinates.y = (nearestCircle.coordinates.y + circle.coordinates.y) / 2;
        circle.coordinates.x = (nearestCircle.coordinates.x + circle.coordinates.x) / 2;
        this.removeCircle(nearestCircle.node);
        circle.setStyles();
        list = this.circles.filter(i => i !== circle);
      }
    }
  });
};

/**
 * Find average color by mixing two colors
 * @param {String} color1
 * @param {String} color2
 * @returns {string}
 */
function mixColors(color1, color2) {
  function toDex(num) {
    return parseInt(num, 16);
  }

  const avg = Math.round((toDex(color1.slice(1)) + toDex(color2.slice(1))) / 2);
  return `#${avg.toString(16)}`;
}

/**
 * Create initial array of circles
 * @param {Object} field
 * @param {number} length
 * @param {number} limit
 * @returns {Array}
 */
function init(field, length, limit) {
  const coords = [];
  while (coords.length < length) {
    const center = randomCoordinates(field);
    if (!isCrossed(coords, center, limit)) {
      coords.push(new Circle(center, counter++, field.radius));
    }
  }

  return coords;
}

/**
 * Generate random coordinates
 * @param {Object} field
 * @returns {{x: number, y: number}}
 */
function randomCoordinates(field) {
  const width = field.node.clientWidth;
  const height = field.node.clientHeight;

  const newX = randomInt(field.radius, width - field.radius);
  const newY = randomInt(field.radius, height - field.radius);

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
 * @param {number} limit
 * @returns {*}
 */
function isCrossed(l, center, limit) {
  if (l.length === 0) {
    return false;
  }
  return l.some(el =>
    limit > calcDistance(el.coordinates, center)
  );
}

/**
 * Calculate distance between two points
 * @param {Object} point1
 * @param {Object} point2
 * @returns {number}
 */
function calcDistance(point1, point2) {
  const xPow = Math.pow((point1.x - point2.x), 2);
  const yPow = Math.pow((point1.y - point2.y), 2);
  return Math.sqrt(xPow + yPow);
}
