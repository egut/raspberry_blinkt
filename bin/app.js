'use strict';

const getenv = require('getenv');

const redis = require('../lib/redis');

redis(getenv.int('INTERVAL', 1000));
