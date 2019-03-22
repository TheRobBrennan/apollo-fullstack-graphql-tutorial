const { ApolloServer } = require('apollo-server')
const typeDefs = require('./schema')
const resolvers = require('./resolvers')

// Add our datasources
const { createStore } = require('./utils')
const LaunchAPI = require('./datasources/launch')
const UserAPI = require('./datasources/user')
const store = createStore()

// Email validation
const isEmail = require('isemail')

const server = new ApolloServer({
  // The context function on your ApolloServer instance is called with the request object each time a GraphQL operation hits your API. Use this request object to read the authorization headers.
  context: async({ req }) => {
    // Authenticate the user within the context function.
    //
    // While we definitely don’t advocate using this specific implementation in production since it’s not secure, all of the concepts outlined here are transferable to how you’ll implement authentication in a real world application.

    // Simple auth check on every GraphQL request
    const auth = (req.headers && req.headers.authorization) || ''
    const email = Buffer.from(auth, 'base64').toString('ascii')

    // If the email isn't formatted validly, return null for the user
    if (!isEmail.validate(email)) return { user: null }

    // Find a user by their email
    const users = await store.users.findOrCreate({ where: { email }})
    const user = users && users[0] ? users[0] : null

    // Once the user is authenticated, attach the user to the object returned from the context function.
    return { user: { ...user.dataValues }}
  },
  typeDefs,
  resolvers,
  dataSources: () => ({
    launchAPI: new LaunchAPI(),
    userAPI: new UserAPI({ store }),
  }),
  engine: {
    apiKey: process.env.ENGINE_API_KEY,
  },
})

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`)
})
