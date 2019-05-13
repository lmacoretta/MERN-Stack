const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const { check, validationResult } = require('express-validator/check');
const config = require('config');

const User = require('../../models/User');

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
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      // Busco si el usuario esta registrado
      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'El usuario ya existe' }] });
      }

      // Gravatar config
      const avatar = gravatar.url(email, {
        s: '200', //size
        r: 'pg',
        d: 'mm'
      });

      // Creo una instancia del usuario
      user = new User({ name, email, avatar, password });

      //Lo guardo en la db
      await user.save();

      //Respondo con un token
      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
