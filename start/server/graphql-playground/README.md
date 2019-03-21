# GraphQL Playground

Here are some examples you can experiment with in the GraphQL playground.

## Simple query: GetLaunches

```graphql
query GetLaunches {
  launches {
    id
    mission {
      name
    }
  }
}
```

## Simple query: GetLaunchById

### Hardcoded example

```graphql
query GetLaunchById {
  launch(id: 60) {
    id
    rocket {
      id
      type
    }
  }
}
```

### Dynamic example

```graphql
query GetLaunchById($id: ID!) {
  launch(id: $id) {
    id
    rocket {
      id
      type
    }
  }
}

# In the Query Variables section, pass in something like
{ "id": 60 }
```

## Simple mutation: Login user

```graphql
mutation LoginUser {
  login(email: "daisy@apollographql.com")
}
```

This will give you a response like:

```graphql
{
  "data": {
    "login": "ZGFpc3lAYXBvbGxvZ3JhcGhxbC5jb20="
  }
}
```

## Advanced mutation: BookTrips as an authenticated user

```graphql
mutation BookTrips {
  bookTrips(launchIds: [67,68,69]) {
    success
    message
    launches {
      id
    }
  }
}
```

Now paste in your authorization header into the HTTP Headers box at the bottom of the playground:

```graphql
{
  "authorization": "ZGFpc3lAYXBvbGxvZ3JhcGhxbC5jb20"
}
```