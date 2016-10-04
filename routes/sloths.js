const express = require('express');
const router = express.Router();
const knex = require(`../db/knex`);

/* GET users listing. */
router.get('/', (req, res, next) => {
  knex(`sloths`)
    .then(data => {res.json(data)})
    .catch(err => {return err})
});

router.post(`/sloths`, (req, res) => {
  const newSloth = req.body;
  knex(`sloths`)
    .insert(newSloth)
    .then(() => {
      req.status(200).done();
    })
    .catch(err => {
      return err;
    });
})

module.exports = router;
