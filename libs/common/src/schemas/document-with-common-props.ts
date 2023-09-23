import * as mongoose from 'mongoose';
import { Prop } from '@nestjs/mongoose';

export class DocumentWithCommonProps extends mongoose.Document {
  @Prop({
    required: true,
    default: new Date().getTime(),
    select: false,
  })
  createdAt: Date;

  @Prop({
    select: false,
  })
  updatedAt?: Date;

  @Prop({
    select: false,
  })
  deletedAt?: Date;

  @Prop({
    required: true,
    default: false,
    select: false,
  })
  deleted: boolean;
}
