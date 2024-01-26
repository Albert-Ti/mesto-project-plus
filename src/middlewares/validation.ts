import { Joi, Segments } from 'celebrate';

const authUser = {
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(200),
    avatar: Joi.string().uri(),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
};

const updateUser = {
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(200),
    avatar: Joi.string().uri(),
    email: Joi.string().email(),
    password: Joi.string(),
  }),
};

const cards = {
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().uri(),
    owner: Joi.string().alphanum(),
    likes: Joi.array(),
    createdAt: Joi.string().isoDate(),
  }),
};

export default {
  authUser,
  updateUser,
  cards,
};
