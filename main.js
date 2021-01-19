const express = require('express');
const path = require('path');
const next = require('next');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const controllers = require('./app/controllers');

require('dotenv').config();

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      version: '1.0.0',
      title: 'API',
      description: 'API Information',
      contact: {
        name: 'Amazing Developer',
      },
      servers: ['http://localhost:3000'],
    },
  },
  apis: ['main.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const server = express();

app.prepare().then(async () => {
  server.use(logger('dev'));
  server.use(express.json());
  server.use(express.urlencoded({ extended: false }));
  server.use(cookieParser());

  server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

  // Routes
  /**
 * @swagger
 * /pages:
 *  get:
 *    description: Get all pages
 *    responses:
 *      '200':
 *        description: A successful response
 *  post:
 *    description: Get all pages
 *    responses:
 *      '200':
 *        description: A successful response
 */

  server.use('/api', controllers);

  server.on('connection', socket => {
    socket.setNoDelay();
  });

  server.use(express.static(path.join(__dirname, 'public')));

  server.get('/studio', (req, res) => {
    app.render(req, res, '/studio');
  });

  server.get('/contact', (req, res) => {
    app.render(req, res, '/contact');
  });

  server.get('/pages', (req, res) => {
    app.render(req, res, '/pages');
  });

  server.get('/login', (req, res) => {
    app.render(req, res, '/login');
  });

  server.get('/', (req, res) => {
    app.render(req, res, '/index');
  });

  server.get('*', (req, res) => handle(req, res));

  server.listen(3000);
});

module.exports = server;
