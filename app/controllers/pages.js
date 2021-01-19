const express = require('express');
const createError = require('http-errors');
const nanoid = require('nanoid');
const { Page, Sequelize: { Op: { like, or } } } = require('../models');
const upload = require('../../lib/upload').storage;
const passportJwt = require('../../lib/passport/jwt');

const router = express.Router();

/* POST pages/upload-image' */
router.post('/upload-image', passportJwt.authenticate('jwt', { session: false }),
  upload.single('image'), async (req, res) => {
    res.send(`/uploads/${req.file.originalname}`);
  });

/* GET */
router.get('/', async (req, res, next) => {
  try {
    const pages = await Page.findAll();
    res.send(pages);
  } catch (error) {
    return next(createError(error));
  }
});

/* GET pages/core-categories */
router.get('/core-categories', async (req, res, next) => {
  try {
    const aliases = await Page.findAll({
      order: [
        ['alias', 'ASC'],
      ],
      attributes: ['id', 'alias'],
    });
    res.send(aliases);
  } catch (error) {
    return next(createError(error));
  }
});

/* GET pages/category-pages */
router.get('/category-pages', async (req, res, next) => {
  const { alias } = req.query;
  try {
    const pages = await Page.findAll({
      where: { alias: { [like]: `%${alias}/%` } },
      attributes: ['id', 'alias'],
    });
    res.send(pages);
  } catch (error) {
    return next(createError(error));
  }
});

/* GET pages/:alias */
router.get('/:alias', async (req, res, next) => {
  const alias = req.params.alias.split('--slash--').join('/');

  try {
    const page = await Page.findOne({ where: { alias } });
    res.send(page);
  } catch (err) {
    return next(createError(err));
  }
});

/* PUT */
router.put('/', passportJwt.authenticate('jwt', { session: false }), async (req, res, next) => {
  const { id, alias, data } = req.body;
  try {
    const page = await Page.findByPk(id);
    page.setAttributes({ alias, data });
    await page.save();
    res.end();
  } catch (error) {
    return next(createError(error));
  }
});

/* PUT pages/update-category-pages */
router.put('/update-category-pages', passportJwt.authenticate('jwt', { session: false }), async (req, res, next) => {
  const { alias, new_alias } = req.body;
  try {
    const pages = await Page.findAll({
      where: { alias: { [like]: `${alias}/%` } },
    });

    await Promise.all(
      pages.map(e => e.update({ alias: e.alias.replace(alias, new_alias) })),
    );

    res.send();
  } catch (error) {
    return next(createError(error));
  }
});

/* POST */
router.post('/', passportJwt.authenticate('jwt', { session: false }), async (req, res, next) => {
  const { alias, data } = req.body;
  try {
    await Page.create({ alias: alias || nanoid(20), data });
    res.end();
  } catch (error) {
    return next(createError(error));
  }
});

/* DELETE */
router.delete('/', passportJwt.authenticate('jwt', { session: false }), async (req, res, next) => {
  const { id } = req.query;
  try {
    await Page.destroy({ where: { id } });
    res.end();
  } catch (error) {
    return next(createError(error));
  }
});

/* DELETE pages/remove-all-category-pages */
router.delete('/remove-all-category-pages', passportJwt.authenticate('jwt', { session: false }), async (req, res, next) => {
  const { alias } = req.query;
  try {
    await Page.destroy({
      where: {
        [or]: [
          { alias },
          { alias: { [like]: `${alias}/%` } },
        ],
      },
    });

    res.end();
  } catch (error) {
    return next(createError(error));
  }
});

module.exports = router;
