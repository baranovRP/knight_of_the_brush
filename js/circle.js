/* eslint no-use-before-define: ["error", { "functions": false }] */
/* eslint no-global-assign: "warn" */
/* eslint-env browser */

export default function Circle(coords, idx, radius) {
  this.coordinates = _extends({}, coords);
  this.radius = radius;
  this.color = randomColor();
  this.node = this._createNode(idx);
  this.circleEvents();
}

Circle.prototype.circleEvents = function move() {
  const self = this;

  self.node.addEventListener('mousedown', (event) => {
    let el = event.target;

    if (!el.classList.contains('circle')) {
      el = null;
      return;
    }

    const elCoord = getCoords(self.node);
    const shiftX = event.pageX - elCoord.left;
    const shiftY = event.pageY - elCoord.top;

    self.node.classList.add('moving');

    const onMouseMove = e => {
      if (!self.node.classList.contains('moving')) {
        return;
      }
      const delta = computeDelta(e, {
        x: parseInt(self.node.style.left, 10),
        y: parseInt(self.node.style.top, 10),
      });
      self.node.style.top = `${(parseInt(self.node.style.top, 10) - shiftY) + delta.y}px`;
      self.node.style.left = `${(parseInt(self.node.style.left, 10) - shiftX) + delta.x}px`;

      self.coordinates.x = parseInt(self.node.style.left, 10) + self.radius;
      self.coordinates.y = parseInt(self.node.style.top, 10) + self.radius;
    };

    const onMouseUp = () => {
      self.node.classList.remove('moving');
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);

      self.node.dispatchEvent(new CustomEvent('circlemove', {
        detail: { circle: this },
        bubbles: true,
        composed: true,
      }));
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });
};

Circle.prototype.setStyles = function setStyles() {
  this.node.style.top = `${this.coordinates.y - this.radius}px`;
  this.node.style.left = `${this.coordinates.x - this.radius}px`;
  this.node.style.backgroundColor = this.color;
};

/**
 * Create circle's node
 * @param {number} idx
 * @returns {Node}
 */
Circle.prototype._createNode = function _createNode(idx) {
  const y = this.coordinates.y - this.radius;
  const x = this.coordinates.x - this.radius;
  const div = document.createElement('div');
  div.innerHTML = `<div class="circle" id = ${idx} style="top: ${y}px; left: ${x}px; background: ${this.color}"></div>`;
  return div.firstChild;
}

/**
 * Generate random hex color
 * @returns {string}
 */
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

function getCoords(el) {
  const box = el.getBoundingClientRect();

  return {
    top: box.top + pageYOffset,
    left: box.left + pageXOffset,
  };
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

