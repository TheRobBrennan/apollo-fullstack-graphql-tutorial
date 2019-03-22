import { Query, ApolloProvider } from 'react-apollo'
import gql from 'graphql-tag'
import React from 'react'
import ReactDOM from 'react-dom'

import Pages from './pages'
import Login from './pages/login'
import { resolvers, typeDefs } from './resolvers'
import injectStyles from './styles'

import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'

const cache = new InMemoryCache()
const link = new HttpLink({
  uri: 'http://localhost:4000/graphql',
  headers: {
    // This token is read every time a GraphQL operation is made
    authorization: localStorage.getItem('token'),
  },
})

// Define our Apollo client
const client = new ApolloClient({
  connectToDevTools: true,
  cache,
  link,
  resolvers,
  typeDefs,
})

/*
Since queries execute as soon as the component mounts, it’s important for us to warm the Apollo cache with some default state so those queries don’t error out.
*/
cache.writeData({
  data: {
    isLoggedIn: !!localStorage.getItem('token'),
    cartItems: [],
  }
})

/*
Querying local data from the Apollo cache is almost the same as querying remote data from a graph API. The only difference is that you add a @client directive to a local field to tell Apollo Client to pull it from the cache.
*/
const IS_LOGGED_IN = gql`
  query IsUserLoggedIn {
    isLoggedIn @client
  }
`

injectStyles()

// Wrap our app in the Apollo provider and render either a login screen or the homepage.
// Since cache reads are synchronous, we don't have to account for any loading state.
ReactDOM.render(
  <ApolloProvider client={client}>
    <Query query={IS_LOGGED_IN}>
      {({ data }) => (data.isLoggedIn ? <Pages /> : <Login />)}
    </Query>
  </ApolloProvider>, document.getElementById('root')
)

