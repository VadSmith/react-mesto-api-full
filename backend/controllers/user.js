const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
/* eslint-disable consistent-return */
const CastError = require('../errors/CastError');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const UserExistsError = require('../errors/UserExistsError');
const User = require('../models/user');

const JWT_SECRET = 'verysecretphrase';

const login = (req, res, next) => {
  console.log('inside user.js/login', Date.now());
  const { email, password } = req.body;

  if (!email || !password) { return next(new CastError('Email или пароль не могут быть пустыми')); }

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) { return next(new UnauthorizedError('Неправильный email или пароль')); }

      return bcrypt.compare(password, user.password)
        .then((isValidPassword) => {
          if (!isValidPassword) { return next(new UnauthorizedError('Неправильный email или пароль')); }
          const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
          res.status(200);
          res.cookie('jwt', token, {
            maxAge: 3600000,
            httpOnly: true,
            sameSite: 'none',
            secure: true,
          });
          res.send({ message: 'Успешный вход' });
        })
        .catch(() => next());
    });
};

// Logout
const logout = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user) {
        // res.clearCookie('jwt');
        // res.cookie('jwt', {}, { maxAge: -1 });
        // res.cookie('jwt', {}, { expires: Date.now(0) });
        // res.clearCookie('jwt', { path: '/', domain: 'api.vad.nomoreparties.sbs' });
        res.clearCookie('jwt', {
          sameSite: 'none',
          secure: true,
        }).send({ message: 'Успешный выход из системы' });
      }
    })
    .catch(next);
};

// Обновить профиль
const patchUser = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    { name: req.body.name, about: req.body.about },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
      // upsert: true // если пользователь не найден, он будет создан
    },
  )
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Пользователь не найден'));
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ValidationError('Ошибка: Введены некорректные данные'));
      }
      next(err);
    });
};

// Обновить аватар
const patchAvatar = (req, res, next) => {
  User.findByIdAndUpdate(
    { _id: req.user._id },
    { avatar: req.body.avatar },
    {
      new: true,
      runValidators: true,
      // upsert: true
    },
  )
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Пользователь не найден'));
      }
      res.send(user);
    })
    .catch((err) => {
      // if (err.name === 'CastError') {
      //   return next(new CastError('Ошибка: Введен некорректный id пользователя'));
      // }
      if (err.name === 'ValidationError') {
        return next(new ValidationError('Ошибка: Введены некорректные данные'));
      }
      next(err);
    });
};

// Получение списка юзеров
const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      if (!users) {
        return next(new NotFoundError('Пользователей нет'));
      }
      res.send(users);
    })
    .catch((err) => {
      next(err);
    });
};

const getUsersMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Пользователь не найден'));
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      // if (err.name === 'CastError') {
      //   return next(new CastError('Ошибка: Введен некорректный id пользователя!'));
      // }
      next(err);
    });
};

// Поиск юзера по ID
const getUser = (req, res, next) => {
  User.findById({ _id: req.params.userId })
    .then((user) => {
      // console.log(user);
      if (!user) {
        return next(new NotFoundError('Пользователь не найден'));
        // throw new NotFoundError('Пользователь не найден');
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      // console.log(err);
      // if (err.name === 'CastError') {
      //   return next(new CastError('Ошибка: Введен некорректный id пользователя'));
      // }
      next(err);
    });
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create(
      {
        name, about, avatar, email, password: hash,
      },
      // с этими опциями не видит передаваемых полей
      // {
      //   new: true,
      //   runValidators: true,
      // },
    ))
    .then((user) => {
      res.send(
        {
          _id: user._id,
          email: user.email,
          name: user.name,
          about: user.about,
          avatar: user.avatar,
        },
      );
    })
    .catch((err) => {
      // console.log(err);
      if (err.code === 11000) {
        next(new UserExistsError('Пользователь с таким email существует'));
      } else if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new ValidationError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  createUser,
  getUser,
  getUsers,
  getUsersMe,
  patchUser,
  patchAvatar,
  login,
  logout,
  JWT_SECRET,
};
