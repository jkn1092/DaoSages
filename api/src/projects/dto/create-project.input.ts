import { InputType, Field } from '@nestjs/graphql';
import {IsOptional, MinLength} from 'class-validator';

@InputType()
export class CreateProjectInput {

  @Field(() => String)
  daoId: string;

  @MinLength(8)
  @Field(() => String)
  name: string;

  @Field(() => String)
  token: string;

  @IsOptional()
  @Field(() => String)
  codeSource: string;

  @IsOptional()
  @Field(() => String)
  socialMedia: string;

  @IsOptional()
  @Field(() => String)
  email: string;

  @IsOptional()
  @Field(() => String)
  description: string;
}
