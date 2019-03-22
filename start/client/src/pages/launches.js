import React, { Fragment } from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'

import { LaunchTile, Header, Button, Loading } from '../components'

// We define a GraphQL fragment by giving it a name (LaunchTile) and defining it on a type on our schema (Launch). The name we give our fragment can be anything, but the type must correspond to a type in our schema.
export const LAUNCH_TILE_DATA = gql`
  fragment LaunchTile on Launch {
    id
    isBooked
    rocket {
      id
      name
    }
    mission {
      name
      missionPatch
    }
  }
`

/*
Here, we’re defining a query to fetch a list of launches by calling the launches query from our schema. The launches query returns an object type with a list of launches, in addition to the cursor of the paginated list and whether or not the list hasMore launches. We need to wrap the query with the gql function in order to parse it into an AST.
*/
const GET_LAUNCHES = gql`
  query launchList($after: String) {
    launches(after: $after) {
      cursor
      hasMore
      launches {
        ...LaunchTile
      }
    }
  }
  ${LAUNCH_TILE_DATA}
`

export default function Launches() {
  return (
    <Query query={GET_LAUNCHES}>
      {({ data, loading, error, fetchMore }) => {
        if (loading) return <Loading />
        if (error) return <p>ERROR</p>

        return (
          <Fragment>
            <Header />
            {data.launches &&
              data.launches.launches &&
              data.launches.launches.map(launch => (
                <LaunchTile key={launch.id} launch={launch} />
              ))}

            {/* Load more */}
            {data.launches && data.launches.hasMore && (
              <Button onClick={() => {
                fetchMore({
                  variables: {
                    after: data.launches.cursor,
                  },
                  updateQuery: (prev, { fetchMoreResult, ...rest}) => {
                    if (!fetchMoreResult) return prev

                    return {
                      ...fetchMoreResult,
                      launches: {
                        ...fetchMoreResult.launches,
                        launches: [
                          ...prev.launches.launches,
                          ...fetchMoreResult.launches.launches,
                        ],
                      },
                    }
                  },
                })
              }}>
                Load More
              </Button>
            )}
          </Fragment>
        )
      }}
    </Query>
  )
}
