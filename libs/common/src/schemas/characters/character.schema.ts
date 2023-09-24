import mongoose from 'mongoose';
import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { DocumentWithCommonProps } from '../document-with-common-props';
import { UserModel } from '../auth';

@Schema({ collection: 'characters' })
export class CharacterModel extends DocumentWithCommonProps {
  @Prop({ unique: true, required: true })
  name: string;

  @Prop({ type: mongoose.Types.ObjectId, required: true, ref: UserModel.name })
  user: UserModel;

  @Prop({ type: Date, default: new Date() })
  lastSeen: Date;
}

export const CharacterSchema = SchemaFactory.createForClass(CharacterModel).set(
  'versionKey',
  false,
);
