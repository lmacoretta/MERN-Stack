const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');

/**
 * @route  POST api/users
 * @desc   Register user
 * @access public
 */
router.post(
  '/',
  [
    check('name', 'El nombre es requerido')
      .not()
      .isEmpty(),
    check('email', 'Por favor, incluya un email valido').isEmail(),
    check(
      'password',
      'Por favor, ingrese un password entre 6 o mas caracteres'
    ).isLength({ min: 6 })
  ],
  (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ erorrs: errors.array() });
    }

    res.send('User route');
  }
);

module.exports = router;
