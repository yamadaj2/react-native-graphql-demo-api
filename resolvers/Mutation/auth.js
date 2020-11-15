const {User} = require('../../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('custom-env').env();
const {APP_SECRET} = process.env;

const invalidCredentialsError = () => {
  throw new Error('Invalid credentials');
}

const auth = {
  async signUp(_, { username, email, password }) {
    try {
      const password_digest = await bcrypt.hash(password, 10);
      const user = await User.create({username, email, password_digest});

      const payload = {
        id: user.id,
        username: user.username,
        email: user.email
      };

      const token = jwt.sign(payload, APP_SECRET);
      return { user, token };

    } catch (err) {
      throw new Error(err.message)
    }
  },

  async signIn(_, {username, email, password}) {
    try {
      if (username || email) {
        const user = await User.findOne({ where: username ? {username} : {email}})
        if (await bcrypt.compare(password, user.dataValues.password_digest)) {
          const payload = {
            id: user.id,
            username: user.username,
            email: user.email,
          }
          const token = jwt.sign(payload, APP_SECRET);
          return {user, token}
        }
        invalidCredentialsError();
      }
      invalidCredentialsError();
    } catch (err) {
      throw new Error(err.message);
    }
  },
}

module.exports = { auth };