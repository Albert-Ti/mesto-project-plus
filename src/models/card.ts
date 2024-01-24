import { Schema, model } from 'mongoose';
import { SCHEMA_NAMES } from '../constants';

type Card = {
  name: string;
  link: string;
  owner: Schema.Types.ObjectId;
  likes: Schema.Types.ObjectId[];
  createdAt: Date;
};

const cardSchema = new Schema<Card>(
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
      type: Schema.Types.ObjectId,
      ref: SCHEMA_NAMES.user,
      required: true,
    },
    likes: {
      type: [{ type: Schema.Types.ObjectId, ref: SCHEMA_NAMES.user }],
      default: [],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false },
);

export default model<Card>(SCHEMA_NAMES.card, cardSchema);
