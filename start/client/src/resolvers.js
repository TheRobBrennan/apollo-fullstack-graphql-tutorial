import gql from 'graphql-tag'
import { GET_CART_ITEMS } from './pages/cart';

/*
To build a client schema, we extend the types of our server schema and wrap it with the gql function. Using the extend keyword allows us to combine both schemas inside developer tooling like Apollo VSCode and Apollo DevTools.
*/
export const typeDefs = gql`
  extend type Query {
    isLoggedIn: Boolean!
    cartItems: [Launch]!
  }

  extend type Launch {
    isInCart: Boolean!
  }

  extend type Mutation {
    addOrRemoveFromCart(id: ID!): [Launch]
  }
`

/*
One of the unique advantages of managing your local data with Apollo Client is that you can add virtual fields to data you receive back from your graph API. These fields only exist on the client and are useful for decorating server data with local state. In our example, we’re going to add an isInCart virtual field to our Launch type.
*/
export const schema = gql`
  extend type Launch {
    isInCart: Boolean!
  }
`

/*
Next, specify a client resolver on the Launch type to tell Apollo Client how to resolve your virtual field
The important thing to note is that the resolver API on the client is the same as the resolver API on the server.
*/
export const resolvers = {
  Launch: {
    isInCart: (launch, _, { cache }) => {
      const { cartItems } = cache.readQuery({ query: GET_CART_ITEMS })
      return cartItems.includes(launch.id)
    },
  },
  /*
  What if we wanted to perform a more complicated local data update such as adding or removing items from a list? For this situation, we’ll use a local resolver. Local resolvers have the same function signature as remote resolvers ((parent, args, context, info) => data). The only difference is that the Apollo cache is already added to the context for you. Inside your resolver, you’ll use the cache to read and write data.
  */
  Mutation: {
    addOrRemoveFromCart: (_, { id }, { cache }) => {
      const { cartItems } = cache.readQuery({ query: GET_CART_ITEMS })
      const data = {
        cartItems: cartItems.includes(id) ? cartItems.filter(i => i !== id) : [...cartItems, id]
      }

      cache.writeQuery({ query: GET_CART_ITEMS, data })
      return data.cartItems
    }
  },
}
