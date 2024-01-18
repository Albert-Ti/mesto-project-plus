import { Schema, model } from 'mongoose';
import { User } from './types';

const userScheme = new Schema<User>(
  {
    name: {
      type: String,
      required: true,
      maxlength: 30,
      minlength: 2,
    },
    about: {
      type: String,
      required: true,
      maxlength: 200,
      minlength: 2,
    },
    avatar: {
      type: String,
      required: true,
    },
  },
  { versionKey: false },
);

export default model<User>('User', userScheme);
