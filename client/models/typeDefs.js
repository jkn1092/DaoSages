import { gql } from '@apollo/client';

export const typeDefs = gql`
	extend type Query {
		IsFinder: Boolean!,
		IsBrainer: Boolean!,
		IsWise: Boolean!,
		GetAddress: String!,
	}
`;
