const { celebrate, Joi } = require('celebrate');

const router = require('express').Router();
const {
  getCards, deleteCard, createCard, likeCard, dislikeCard,
} = require('../controllers/card');
// const { deleteCard } = require('../controllers/card');
module.exports = router;
// GET / cards — возвращает все карточки
// DELETE / cards /: cardId — удаляет карточку по идентификатору
// POST / cards — создаёт карточку
// PUT / cards /: cardId / likes — поставить лайк карточке
// DELETE / cards /: cardId / likes — убрать лайк с карточки
router.get('/cards', getCards);

router.delete('/cards/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().hex().length(24),
  }),
}), deleteCard);
// router.delete('/cards/:cardId', deleteCard);

// router.post('/cards', createCard);
// router.put('/cards/:cardId/likes', likeCard);

router.post(
  '/cards',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required().pattern(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/),
    }).messages({ 'string.pattern': 'Должен быть корректный URL' }),

  }),
  createCard,
);

router.put('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().hex().length(24),
  }),
}), likeCard);

router.delete('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().hex().length(24),
  }),
}), dislikeCard);
