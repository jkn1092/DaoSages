import { InputType, Field } from '@nestjs/graphql';
import { MinLength } from 'class-validator';

@InputType()
export class CreateProjectInput {

  @Field(() => String)
  daoId: string;

  @MinLength(8)
  @Field(() => String)
  name: string;

  @MinLength(8)
  @Field(() => String)
  description: string;
}
