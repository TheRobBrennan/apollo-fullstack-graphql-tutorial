import { ApolloProvider } from 'react-apollo'
import React from 'react'
import ReactDOM from 'react-dom'
import Pages from './pages'

import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'

const cache = new InMemoryCache()
const link = new HttpLink({
  uri: `https://fullstack-tutorial-server-wvigdpddtw.now.sh`
})

// Define our Apollo client
const client = new ApolloClient({
  cache,
  link
})

// Wrap our app in the Apollo provider
ReactDOM.render(
  <ApolloProvider client={client}>
    <Pages />
  </ApolloProvider>, document.getElementById('root')
)

