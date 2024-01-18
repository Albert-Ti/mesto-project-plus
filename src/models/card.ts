import { Schema, model, Types } from 'mongoose';
import { User } from './types';

type Card = {
  name: string;
  link: string;
  owner: Types.ObjectId | User;
  likes: Types.ObjectId[] | User[];
  createdAt: Date;
};

const cardScheme = new Schema<Card>(
  {
    name: {
      type: String,
      required: true,
      maxlength: 30,
      minlength: 2,
    },
    link: {
      type: String,
      required: true,
    },
    owner: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    },
    likes: {
      type: [{ type: Types.ObjectId, ref: 'User' }],
      default: [],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false },
);

export default model<Card>('Card', cardScheme);
