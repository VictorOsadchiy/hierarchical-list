import { ApolloClient, InMemoryCache } from '@apollo/client';
import { END_POINT } from 'utils/constants';

export const client = new ApolloClient({
  uri: END_POINT,
  cache: new InMemoryCache()
});
