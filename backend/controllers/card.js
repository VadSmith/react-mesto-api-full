/* eslint-disable comma-dangle */
/* eslint-disable eol-last */
/* eslint-disable no-undef */
/* eslint-disable consistent-return */
const CastError = require('../errors/CastError');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const ForbiddenError = require('../errors/ForbiddenError');
const Card = require('../models/card');
// const card = require('../models/card');

// Получение списка карточек
const getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      if (!cards) {
        return next(new NotFoundError('Карточки не найдены'));
      }
      res.send(cards);
    })
    .catch((err) => {
      // eslint-disable-next-line no-undef
      next(err);
    });
};

// Создание карточки
const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create(
    { name, link, owner },
    // {
    //   new: true,
    //   runValidators: true
    // }
  )
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Ошибка: Введены некорректные данные'));
      }
      next(err);
    });
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .orFail(() => new NotFoundError('Карточка с этим ID не найдена'))
    .then((card) => {
      if (!card.owner.equals(req.user._id)) {
        return next(new ForbiddenError('Нельзя удалить чужую карточку'));
      }
      return card.remove()
        .then(() => res.send({ message: 'Карточка удалена' }));
    }).catch(next);
};

// const deleteCard = (req, res, next) => {
//   Card.findByIdAndRemove(req.params.cardId)
//     .then((card) => {
//       console.log('deleteCard', card);
//       if (!card) {
//         throw new NotFoundError('Карточка не найдена');
//       }
//       if (card.owner._id.toString() !== req.user._id.toString()) {
//         throw new ForbiddenError('Невозможно удалить чужую карточку');
//       }
//       res.send({ message: 'Карточка удалена' });
//     })
//     .catch((err) => {
//       if (err.name === 'CastError') {
//         next(new BadRequestError('Некорректные данные'));
//       }
//       next(err);
//     });
// };

// Поиск карточки по ID
const getCard = (req, res) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Карточки не существует'));
      }
      res.send(card);
    })
    .catch((err) => next(err));
  // .catch ((err) => res.status(500).send({ message: err.message }));
};

// Лайк карточке
const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  ).then((card) => {
    // eslint-disable-next-line no-console
    console.log(card);
    if (!card) {
      return next(new NotFoundError('Карточки не существует'));
    }
    res.send(card);
  })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new CastError('Ошибка: Некорректный формат ID карточки'));
      }
      next(err);
    });
};

// Снятие лайка
const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    { _id: req.params.cardId },
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return next(new NotFoundError('Карточки не существует'));
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new CastError('Ошибка: Некорректный формат ID карточки'));
      }
      next(err);
    });
};

module.exports = {
  deleteCard,
  getCards,
  createCard,
  getCard,
  likeCard,
  dislikeCard
};