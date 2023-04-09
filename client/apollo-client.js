import {ApolloClient, ApolloLink, from, HttpLink, InMemoryCache} from "@apollo/client";
import {onError} from "@apollo/client/link/error";
import {typeDefs} from "@/models/typeDefs";
import {cache} from "@/models/cache";

const httpLink = new HttpLink({
    uri: 'https://daosages.herokuapp.com/graphql',
});

const activityMiddleware = new ApolloLink((operation, forward) => {
    // add the recent-activity custom header to the headers
    const token = localStorage.getItem('getAddress');
    operation.setContext(({ headers = {} }) => ({
        headers: {
            ...headers,
        },
    }));

    return forward(operation);
});

const errorLink = onError(({ networkError }) => {
    if (networkError) {
        switch (networkError.statusCode) {
            case 404:
                networkError.message = 'app.error.erroroccurred';
                break;
            default:
                break;
        }
    }
});

const client = new ApolloClient({
    link: from([errorLink, activityMiddleware, httpLink]),
    cache,
    typeDefs,
    fetch
});

export default client