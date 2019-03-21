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
