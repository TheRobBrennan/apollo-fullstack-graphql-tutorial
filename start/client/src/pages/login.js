import React from 'react'
import { Mutation, ApolloConsumer } from 'react-apollo'
import gql from 'graphql-tag'

import { LoginForm, Loading } from '../components'

const LOGIN_USER = gql`
  mutation login($email: String!) {
    login(email: $email)
  }
`

export default function Login() {
  /*
    ApolloConsumer takes a render prop function as a child that is called with the client instance. Let’s wrap our Mutation component with ApolloConsumer to expose the client. Next, we want to pass an onCompleted callback to Mutation that will be called once the mutation is complete with its return value. This callback is where we will save the login token to localStorage.

    Our Mutation component takes a render prop function as a child that exposes a mutate function (login) and the data object returned from the mutation. Finally, we pass our login function to the LoginForm component.
  */

  return (
    <ApolloConsumer>
      {client => (
        <Mutation mutation={LOGIN_USER} onCompleted={({ login }) => {
          // Save the login token to local storage
          localStorage.setItem('token', login)

          // Write local data to the Apollo cache to indicate our user is logged in
          client.writeData({ data: { isLoggedIn: true }})
        }}>
          {(login, { loading, error }) => {
            // This loading state will probably never show, but it's helpful to have for testing
            if (loading) return <Loading />
            if (error) return <p>An error occurred.</p>

            return <LoginForm login={login} />
          }}
        </Mutation>
      )}
    </ApolloConsumer>
  )
}
