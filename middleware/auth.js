const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req, res, next) {
  //tomo el token del header
  const token = req.header('x-auth-token');

  //verifico si no hay token
  if (!token) {
    return res.status(401).json({ msg: 'No hay token, autorizacion denegada' });
  }

  try {
    //verifico
    const decode = jwt.verify(token, config.get('jwtSecret'));

    req.user = decode.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'El token no es valido' });
  }
};
