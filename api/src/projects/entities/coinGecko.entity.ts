import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class CoinGecko {

	@Field(() => String)
	name!: string;

	@Field(() => String)
	token!: string;

	@Field(() => String, { nullable: true })
	coingecko_rank!: string;

	@Field(() => String, { nullable: true })
	coingecko_score!: string;

	@Field(() => String, { nullable: true })
	developer_score!: string;

	@Field(() => String, { nullable: true })
	community_score!: string;

	@Field(() => String, { nullable: true })
	liquidity_score!: string;

	@Field(() => String, { nullable: true })
	public_interest_score!: string;
}