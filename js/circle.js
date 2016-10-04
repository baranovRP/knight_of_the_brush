/* eslint no-use-before-define: ["error", { "functions": false }] */
/* eslint no-global-assign: "warn" */
/* eslint-env browser */

export default function Circle(coords, idx) {
  this.coordinates = _extends({}, coords);
  this.color = getRandomColor();
  this.node = getNode(this.color, this.coordinates, idx);
}

function getNode(color, coords, idx) {
  const radius = 50;
  const y = coords.y - radius;
  const x = coords.x - radius;
  const div = document.createElement('div');
  div.innerHTML = `<div class="circle" id = ${idx} style="top: ${y}px; left: ${x}px; background: ${color}"></div>`;
  return div.firstChild;
}

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
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

