import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {HydratedDocument, Types} from "mongoose";
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
@Schema({ timestamps: true })
export class Project {

  @Field(() => String)
  _id: Types.ObjectId;

  @Prop({ unique: true, required: true })
  @Field(() => String)
  daoId!: string;

  @Prop({ required: true })
  @Field(() => String)
  name!: string;

  @Prop({ required: true })
  @Field(() => String)
  token!: string;

  @Prop({ required: true })
  @Field(() => String, { nullable: true })
  codeSource!: string;

  @Prop({ required: true })
  @Field(() => String, { nullable: true })
  socialMedia!: string;

  @Prop({ required: true })
  @Field(() => String, { nullable: true })
  email!: string;

  @Prop()
  @Field(() => String, { nullable: true } )
  description!: string;

  @Prop()
  @Field(() => Date)
  createdAt?: Date;
}

export type ProjectDocument = HydratedDocument<Project>;

export const ProjectSchema = SchemaFactory.createForClass(Project);