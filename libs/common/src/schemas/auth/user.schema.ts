import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { DocumentWithCommonProps } from '../document-with-common-props';

@Schema({ collection: 'users' })
export class UserModel extends DocumentWithCommonProps {
  @Prop({ unique: true, index: true, required: true })
  username: string;

  @Prop({ unique: true, index: true, required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: Date, default: new Date() })
  lastAccess: Date;
}

export const UserSchema = SchemaFactory.createForClass(UserModel).set(
  'versionKey',
  false,
);
