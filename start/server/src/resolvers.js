const { paginateResults } = require('./utils')

module.exports = {
  /*
    These are resolvers for the Query type defined in start/server/src/schema.js.

    The first argument to our resolvers, parent, is always blank because it refers to the root of our graph.
    The second argument refers to any arguments passed into our query, which we use in our launch query to fetch a launch by its id.
    Finally, we destructure our data sources off the third argument, context, in order to call them in our resolvers.

    Our resolvers are simple and concise because the logic is embedded in the LaunchAPI and UserAPI data sources. We recommend keeping your resolvers thin as a best practice, which allows you to safely refactor without worrying about breaking your API.
  */
  Query: {
    // launches: async(_, __, { dataSources }) => dataSources.launchAPI.getAllLaunches(),
    launches: async (_, { pageSize = 20, after }, { dataSources }) => {
      const allLaunches = await dataSources.launchAPI.getAllLaunches()
      // We want these in reverse chronological order
      allLaunches.reverse()

      const launches = paginateResults({
        after,
        pageSize,
        results: allLaunches,
      })

      return {
        launches,
        cursor: launches.length ? launches[launches.length - 1].cursor : null,

        // If the cursor at the end of the paginated results is the same as the
        // last item in _all_ results, then there are no more results after this
        hasMore: launches.length
          ? launches[launches.length - 1].cursor !==
            allLaunches[allLaunches.length - 1].cursor
          : false,
      }
    },
    launch: (_, { id }, { dataSources }) =>
      dataSources.launchAPI.getLaunchById({ launchId: id }),
    me: async (_, __, { dataSources }) =>
      dataSources.userAPI.findOrCreateUser(),
  },
  Mission: {
    // Make sure the default size is 'large' in case the user doesn't specify
    // Note how the first argument passed into the resolve is the parent, which is the mission object.
    missionPatch: (mission, { size } = { size: 'LARGE' }) => {
      return size === 'SMALL'
        ? mission.missionPatchSmall
        : mission.missionPatchLarge
    },
  },
  Launch: {
    isBooked: async(launch, _, { dataSources }) => dataSources.userAPI.isBookedOnLaunch({ launchId: launch.id }),
  },
  User: {
    trips: async(_, __, { dataSources }) => {
      // Get ids of launches by user
      const launchIds = await dataSources.userAPI.getLaunchIdsByUser()

      if (!launchIds.length) return []

      // Look up those launches by their ids
      return (
        dataSources.launchAPI.getLaunchesByIds({
          launchIds,
        }) || []
      )
    },
  },
}
