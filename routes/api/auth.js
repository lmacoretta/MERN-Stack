const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator/check');
const config = require('config');
const jwt = require('jsonwebtoken');

const User = require('../../models/User');

/**
 * @route  GET api/auth
 * @desc   TEST Route
 * @access public
 */
router.get('/', auth, async (req, res) => {
  try {
    const user = User.findById(req.user.id).select('-password'); //Con select excluyo el password.

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

/**
 * @route  POST api/auth
 * @desc   Authenticated user & get token
 * @access public
 */
router.post(
  '/',
  [
    check('email', 'Por favor, incluya un email valido').isEmail(),
    check('password', 'El password es requerido').exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ erorrs: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // Busco si el usuario esta registrado
      let user = await User.findOne({ email });

      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Credenciales invalidas' }] });
      }

      const isMatch = await user.isValidPassword(password);

      if (!isMatch) {
        return res.status(400).json({ msg: 'Credenciales invalidas' });
      }

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
