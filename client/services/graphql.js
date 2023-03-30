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