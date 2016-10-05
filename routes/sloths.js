const express = require('express');
const router = express.Router();
const knex = require(`../db/knex`);

/* GET users listing. */
router.get('/', (req, res, next) => {
  knex(`sloths`)
    .then(data => {res.json(data)})
    .catch(err => {return err})
});

router.get('/id', (req, res, next) => {
  const id = req.params.id;
  knex(`sloths`)
    .where(`id`, id)
    .then(data => {res.json(data)})
    .catch(err => {return err})
});

router.post(`/sloths`, (req, res) => {
  const newSloth = req.body;
  knex(`sloths`)
    .insert(newSloth)
    .then(() => {
      res.status(200).done();
    })
    .catch(err => {
      res.send(err);
    });
})

module.exports = router;
