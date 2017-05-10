'use strict';

const debug = require('debug')('app:color');

const env = require('./env');

// See: https://github.com/ManoMarks/docker-swarm-visualizer/blob/master/src/data-provider.js
const toHash = function (text) {
  if (!text) {
    throw new Error('Text is missing.');
  }

  let hash = 0;

  for (let i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash);
  }

  debug('Text: %s, Hash: %s', text, hash);
  return hash;
};

// See: https://github.com/ManoMarks/docker-swarm-visualizer/blob/master/src/data-provider.js
const toColor = function (hash) {
  if (!hash) {
    throw new Error('Hash is missing.');
  }

  const color = [];

  for (let i = 0; i < 3; i++) {
    color[i] = (hash >> (i * 8)) & 0xFF;
  }

  debug('Hash: %s, Color: [%d, %d, %d]', hash, color[0], color[1], color[2]);
  return color;
};

const color = function (label) {
  if (!label) {
    throw new Error('Label is missing.');
  }

  debug('Label: %s', label);

  const colors = env();

  // Try exact match
  if (colors[label]) {
    debug('Exact color match.');
    return colors[label];
  }

  // Try without tag
  const image = label.match(/^[^:@]+/)[0];

  if (colors[image]) {
    debug('Color match by image name.');
    return colors[image];
  }

  // Infere by hashing the image name
  return toColor(toHash(image));
};

module.exports = color;
