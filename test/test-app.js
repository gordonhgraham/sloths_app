process.env.NODE_ENV = 'test';

const request = require('supertest');
const expect = require('chai').expect;
const app = require('../app');
const knex = require('../db/knex');

beforeEach(done => {
  Promise.all([
    knex('sloths').insert({
      id: 1,
      name: 'Jerry',
      age: 4,
      image: 'https://gifts.worldwildlife.org/gift-center/Images/large-species-photo/large-Three-toed-Sloth-photo.jpg'
    }),
    knex('sloths').insert({
      id: 2,
      name: 'Sally',
      age: 2,
      image: 'http://www.wildlifeextra.com/resources/listimg/world/Africa/3_toed_sloth@large.jpg'
    }),
    knex('sloths').insert({
      id: 3,
      name: 'Sawyer',
      age: 1,
      image: 'http://www.rainforest-alliance.org/sites/default/files/styles/responsive_breakpoints_theme_rainforest_wide_1x/public/slideshow/header/three-toed-sloth.jpg'
    })
  ]).then(() => done());
});

afterEach(done => {
  knex('sloths').del().then(() => done())
});

describe('GET /sloths', () => {
  it('responds with JSON', done => {
    request(app)
      .get('/sloths')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });

  it('returns an array of all sloth objects when responding with JSON', done => {
    request(app)
      .get('/sloths')
      .end((err, res) => {
        expect(res.body).to.deep.equal([{
          id: 1,
          name: 'Jerry',
          age: 4,
          image: 'https://gifts.worldwildlife.org/gift-center/Images/large-species-photo/large-Three-toed-Sloth-photo.jpg'
        }, {
          id: 2,
          name: 'Sally',
          age: 2,
          image: 'http://www.wildlifeextra.com/resources/listimg/world/Africa/3_toed_sloth@large.jpg'
        }, {
          id: 3,
          name: 'Sawyer',
          age: 1,
          image: 'http://www.rainforest-alliance.org/sites/default/files/styles/responsive_breakpoints_theme_rainforest_wide_1x/public/slideshow/header/three-toed-sloth.jpg'
        }]);
        done();
      });
  });
});

describe(`GET /sloths/:id`, () => {
  it('responds with JSON', done => {
    request(app)
      .get('/sloths')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });

  it(`returns an array with one object with sloth data of id provided`, done => {
    request(app)
      .get(`/sloths/1`)
      .end((err, res) => {
        expect(res.body).to.depp.equal([{
          id: 1,
          name: 'Jerry',
          age: 4,
          image: 'https://gifts.worldwildlife.org/gift-center/Images/large-species-photo/large-Three-toed-Sloth-photo.jpg'
        }]);
        done();
      });
  });

  it(`returns an array with one object with sloth data of id provided`, done => {
    request(app)
      .get(`/sloths/2`)
      .end((err, res) => {
        expect(res.body).to.depp.equal([{
          id: 2,
          name: 'Sally',
          age: 2,
          image: 'http://www.wildlifeextra.com/resources/listimg/world/Africa/3_toed_sloth@large.jpg'
        }]);
        done();
      });
  });

  it(`returns an array with one object with sloth data of id provided`, done => {
    request(app)
      .get(`/sloths/3`)
      .end((err, res) => {
        expect(res.body).to.depp.equal([{
          id: 3,
          name: 'Sawyer',
          age: 1,
          image: 'http://www.rainforest-alliance.org/sites/default/files/styles/responsive_breakpoints_theme_rainforest_wide_1x/public/slideshow/header/three-toed-sloth.jpg'
        }]);
        done();
      });
  });

});

describe('POST /sloths', () => {
  const newSloth = {
    sloth: {
      id: 4,
      name: 'Veronica',
      age: 8,
      image: 'http://www.wherecoolthingshappen.com/wp-content/uploads/2016/01/1200.jpg'
    }
  };

  it('responds with JSON', done => {
    request(app)
      .post('/sloths')
      .type('form')
      .send(newSloth)
      .expect('Content-Type', /json/)
      .expect(200, done);
  });

  it('adds the new sloth to the database', done => {
    request(app)
      .post('/sloths')
      .type('form')
      .send(newSloth)
      .end((err, res) => {
        knex('sloths').select().then(sloths => {
          expect(sloths).to.have.lengthOf(4);
          expect(sloths).to.deep.include(newSloth.sloth);
        });
        done();
      });
  });
});

describe('PUT /sloths/:id', () => {
  const updatedSloth = {
    sloth: {
      name: 'Homunculus',
      age: 500,
      image: 'http://i878.photobucket.com/albums/ab344/TheScav/FMA%20Characters/sloth.png'
    }
  };

  it('responds with JSON', done => {
    request(app)
      .put('/sloths/1')
      .type('form')
      .send(updatedSloth)
      .expect('Content-Type', /json/)
      .expect(200, done);
  });

  it('updates the sloth in the database', done => {
    request(app)
      .put('/sloths/1')
      .type('form')
      .send(updatedSloth)
      .end((err, res) => {
        knex('sloths').where('id', 1).first().then(sloth => {
          expect(sloth.name).to.equal(updatedSloth.sloth.name);
          expect(sloth.age).to.equal(updatedSloth.sloth.age);
          expect(sloth.image).to.equal(updatedSloth.sloth.image);
        });
        done();
      });
  });
});

xdescribe('DELETE /sloths/:id', () => {
  const deletedSloth = knex(`sloths`).where(`id`, 1);

  it('responds with JSON', done => {
    request(app)
      .delete('/sloths/1')
      .send(deletedSloth)
      .expect('Content-Type', /json/)
      .expect(200, done);
  });

  it('deletes the sloth from the database', done => {
    request(app)
      .put('/sloths/1')
      .type('form')
      .send(deletedSloth)
      .end((err, res) => {
        knex('sloths').where('id', 1).first().then(sloth => {
          expect(sloths).to.have.lengthOf(2);
          expect(sloths).to.deep.exclude(deletedSloth);
          done();
        });
      });
  });

});
