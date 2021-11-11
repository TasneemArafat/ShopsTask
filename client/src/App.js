import React from 'react';
import ApolloClient from 'apollo-boost';
// import { ApolloProvider } from '@apollo/react-hooks';
import { ApolloProvider } from 'react-apollo';
// import {Product} from "./components/Product";
import {Search} from "./components/Search";
import {Form} from "./components/Form";
import {Product} from "./components/Product"

const client = new ApolloClient({
  uri: 'http://localhost:8000/graphql/',
});

const App = () => (
  <ApolloProvider client={client}>
      <Product/>
      <Search/>
      <Form/>
  </ApolloProvider>
);

export default App;
