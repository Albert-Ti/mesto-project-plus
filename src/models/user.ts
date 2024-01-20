import { Schema, model } from 'mongoose';
import { SCHEMA_NAMES } from '../constants';

type User = {
  name: string;
  about: string;
  avatar: string;
};

const userSchema = new Schema<User>(
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

export default model<User>(SCHEMA_NAMES.user, userSchema);
