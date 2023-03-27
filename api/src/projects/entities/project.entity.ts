import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from "mongoose";
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
@Schema({ timestamps: true })
export class Project {
  @Prop({ unique: true, required: true })
  @Field(() => String)
  _id!: string;

  @Prop({ required: true })
  @Field(() => String)
  name!: string;

  @Prop({ required: true })
  @Field(() => String )
  description!: string;

  @Prop()
  @Field(() => Date)
  createdAt?: Date;
}

export type ProjectDocument = HydratedDocument<Project>;

export const ProjectSchema = SchemaFactory.createForClass(Project);