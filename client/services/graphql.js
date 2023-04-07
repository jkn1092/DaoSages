import { gql } from '@apollo/client';

export const REQUEST = {
    QUERY: {
        PROJECT: {
            GET_ALL: gql`
                query getAllProjects {
                    projects {
                        _id
                        daoId
                        name
                        description
                    }
                }`,
            GET_PROJECT_ID: gql`
                query projectFromId(
                    $daoId: String!,
                ) {
                    project(
                        daoId:$daoId,
                    )
                    {
                        name
                        token
                        email
                        codeSource
                        socialMedia
                        description
                    }
                }`,
            GET_COIN_GECKO: gql`
                query coinGeckoFromId(
                    $daoId: String!,
                ) {
                    coinGecko(
                        daoId:$daoId,
                    )
                    {
                        coingecko_rank,
                        coingecko_score,
                        developer_score,
                        community_score,
                        liquidity_score,
                        public_interest_score
                    }
                }`
        }
    },
    MUTATION: {
        PROJECT: {
            SUBMIT_PROJECT: gql`
                mutation submitProject(
                    $daoId: String!
                    $name: String!
                    $token: String!
                    $codeSource: String!
                    $socialMedia: String!
                    $email: String!
                    $description: String!
                ) {
                    createProject(
                        createProjectInput: {
                            daoId: $daoId
                            name: $name
                            token: $token
                            codeSource: $codeSource
                            socialMedia: $socialMedia
                            email: $email
                            description: $description
                        }
                    ) {
                        name
                    }
                }
            `,
        }
    }
}