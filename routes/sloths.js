const express = require('express');
const router = express.Router();
const knex = require(`../db/knex`);

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send({});
});

module.exports = router;
