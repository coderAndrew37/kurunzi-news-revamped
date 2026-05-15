import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { registerApolloClient } from '@apollo/client-react-streaming';

export const { getClient } = registerApolloClient(() => {
  return new ApolloClient({
    link: new HttpLink({
      uri: process.env.NEXT_PUBLIC_WP_GRAPHQL_URL, // e.g. http://kurunzi-sports.local/graphql
    }),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: { fetchPolicy: 'no-cache' }, // good for news sites
      query: { fetchPolicy: 'no-cache' },
    },
  });
});