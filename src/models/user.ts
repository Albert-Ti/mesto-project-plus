import { Schema, model } from 'mongoose';
import { SCHEMA_NAMES } from '../constants';

type User = {
  name: string;
  about: string;
  avatar: string;
  email: string;
  password: string;
};

const userSchema = new Schema<User>(
  {
    name: {
      type: String,
      maxlength: 30,
      minlength: 2,
      default: 'Жак-Ив Кусто',
    },
    about: {
      type: String,
      maxlength: 200,
      minlength: 2,
      default: 'Исследователь',
    },
    avatar: {
      type: String,
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
        message: 'Некорректный формат почты: {VALUE}',
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },

  { versionKey: false },
);

userSchema.methods.toJSON = function toJSON() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export default model<User>(SCHEMA_NAMES.user, userSchema);
