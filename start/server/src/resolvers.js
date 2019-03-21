module.exports = {
  /*
    These are resolvers for the Query type defined in start/server/src/schema.js.

    The first argument to our resolvers, parent, is always blank because it refers to the root of our graph.
    The second argument refers to any arguments passed into our query, which we use in our launch query to fetch a launch by its id.
    Finally, we destructure our data sources off the third argument, context, in order to call them in our resolvers.

    Our resolvers are simple and concise because the logic is embedded in the LaunchAPI and UserAPI data sources. We recommend keeping your resolvers thin as a best practice, which allows you to safely refactor without worrying about breaking your API.
  */
  Query: {
    launches: async(_, __, { dataSources }) => dataSources.launchAPI.getAllLaunches(),
    launch: (_, { id }, { dataSources }) => dataSources.launchAPI.getLaunchById({ launchId: id }),
    me: async(_, __, { dataSources }) => dataSources.userAPI.findOrCreateUser(),
  },
}
