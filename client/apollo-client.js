import {ApolloClient, ApolloLink, from, HttpLink, InMemoryCache} from "@apollo/client";
import {onError} from "@apollo/client/link/error";

const httpLink = new HttpLink({
    uri: 'daosages.herokuapp.com/graphql',
});

const activityMiddleware = new ApolloLink((operation, forward) => {
    // add the recent-activity custom header to the headers
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
    cache: new InMemoryCache(),
    fetch
});

export default client