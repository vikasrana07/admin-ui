const router = require('express').Router();
const AuthController = require('./AuthController');
//const Middleware = require('../../cors/middleware').checkToken;
//const Validation = require('../../validation/UserValidation')

module.exports = (app) => {
  router.route('/generatetoken')
    .post(
      AuthController.generateToken
    );
  app.use(
    router
  );
};