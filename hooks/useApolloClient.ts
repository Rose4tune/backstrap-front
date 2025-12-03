import { useState } from 'react';
import { ApolloClient } from '@apollo/client';
import { initializeApollo } from '@libs/apolloClient';

export const useApolloClient = (): ApolloClient<any> => {
  const [client] = useState(() => initializeApollo());
  return client;
};
