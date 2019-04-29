const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const brcypt = require('bcryptjs');

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  avatar: {
    type: String
  },

  data: {
    type: Date,
    dafault: Date.now()
  }
});

userSchema.pre('save', async function(next) {
  try {
    const salt = await brcypt.genSalt(10);

    //Genero el password con el hash (salt + hash)
    const hashPassword = await brcypt.hash(this.password, salt);

    //Remplazo la passwors de texto plana por esta encriptada.
    this.password = hashPassword;
    next();
  } catch (err) {
    next(err);
  }
});

/** Comparo la password */
userSchema.methods.isValidPassword = async function(newPassword) {
  try {
    return await brcypt.compare(newPassword, this.password);
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = mongoose.model('user', userSchema);
