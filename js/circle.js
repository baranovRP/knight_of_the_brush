/* eslint no-use-before-define: ["error", { "functions": false }] */
/* eslint no-global-assign: "warn" */
/* eslint-env browser */

export default function Circle(coords, idx) {
  this.coordinates = _extends({}, coords);
  this.color = randomColor();
  this.node = createNode(this.color, this.coordinates, idx);
  this.circleEvents();
}

Circle.prototype.circleEvents = function move() {
  const radius = 50;
  const self = this;

  self.node.addEventListener('mousedown', (event) => {
    let el = event.target;

    if (!el.classList.contains('circle')) {
      el = null;
      return;
    }

    self.coordinates.x = event.x;
    self.coordinates.y = event.y;
    self.node.classList.add('moving');

    document.addEventListener('mousemove', e => {
      if (!self.node.classList.contains('moving')) {
        return;
      }
      const delta = computeDelta(e, self.coordinates);

      self.node.style.top = `${(self.coordinates.y - radius) + delta.y}px`;
      self.node.style.left = `${(self.coordinates.x - radius) + delta.x}px`;

      self.coordinates.x = e.x;
      self.coordinates.y = e.y;
    });

    document.addEventListener('mouseup', () => {
      self.node.classList.remove('moving');
      // self.removeEventListener('mousemove');
      // self.removeEventListener('mouseup');

      self.node.dispatchEvent(new CustomEvent('circlemove', {
        detail: { circle: this },
        bubbles: true,
        composed: true,
      }));
    });
  });
};

Circle.l = function () {

};

Circle.prototype.getCoordinates = function getCoordinates() {

};

Circle.prototype.setCoordinatesStyle = function setCoordinatesStyle(coords) {
  this.node.style.top = coords.y;
  this.node.style.left = coords.x;
};

function createNode(color, coords, idx) {
  const radius = 50;
  const y = coords.y - radius;
  const x = coords.x - radius;
  const div = document.createElement('div');
  div.innerHTML = `<div class="circle" id = ${idx} style="top: ${y}px; left: ${x}px; background: ${color}"></div>`;
  return div.firstChild;
}

function randomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

/**
 * Compute delta between two elements
 * @param {Object} el1
 * @param {Object} el2
 * @returns {{x: number, y: number}}
 */
function computeDelta(el1, el2) {
  const x = el1.x - el2.x;
  const y = el1.y - el2.y;
  return { x, y };
}

const _extends = Object.assign || function (target) {
    for (let i = 1; i < arguments.length; i++) {
      const source = arguments[i];
      for (let key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };

