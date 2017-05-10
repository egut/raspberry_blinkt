'use strict';

const debug = require('debug')('app:redis');

const blinkt = require('./blinkt');
const brightness = require('./brightness');
const color = require('./color');


const redis = require("redis"),
    redis_opt = {host: process.env.REDIS_HOST};


if (fs.existsSync('/run/secrets/redis_secret')) {
  const password = fs.readFileSync('/run/secrets/redis_secret','utf8');
  redis_opt['password']=password.replace('\n','');
}
redis_client = redis.createClient(redis_opt);

const colorredis = function (interval) {
  if (!interval) {
    throw new Error('Interval is missing.');
  }

  debug('Update interval: %d ms', interval);

  const toRGBA = function(hex) {
  	var hex = hex || "#00000000";
  	var hex = hex.replace('#', '');
  	var r = parseInt(hex.substring(0, 2), 16);
  	var g = parseInt(hex.substring(2, 4), 16);
  	var b = parseInt(hex.substring(4, 6), 16);
   	var a = parseInt(hex.substring(6, 8), 16) || 100;

	return [r, g, b, a / 100]
  }


  const update = function () {
    debug('Update');

    //Read from redis to get the current colors and view them

    const keys = ['color0','color1','color2','color3','color4','color5','color6','color7'];

    redis_client.mget(keys,(errList, redis_colors) => {
      if (errList) {
        throw errList;
      }
      debug("Color", redis_colors);
      const colors = [];
      for (let i = 0; i < redis_colors.length; i++) {
      	debug("Convert HEX", redis_colors[i]);
      	colors[i] = toRGBA(redis_colors[i]);
      }
      blinkt(colors);
    });
  };

  setInterval(update, interval);
};

module.exports = colorredis;