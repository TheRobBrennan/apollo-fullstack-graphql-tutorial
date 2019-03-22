import React from 'react'
import styled from 'react-emotion'
import { ApolloConsumer } from 'react-apollo'

import { menuItemClassName } from '../components/menu-item'
import { ReactComponent as ExitIcon } from '../assets/icons/exit.svg'

export default function LogoutButton() {
  return (
    <ApolloConsumer>
      {client => (
        <StyledButton onClick={() => {
          // Direct cache writes are convenient when you want to write a simple field, like a boolean or a string, to the Apollo cache
          client.writeData({ data: { isLoggedIn: false }})
          localStorage.clear()
        }}
        >
          <ExitIcon />
          Logout
        </StyledButton>
      )}
    </ApolloConsumer>
  )
}

/**
 * STYLED COMPONENTS USED IN THIS FILE ARE BELOW HERE
 */

const StyledButton = styled('button')(menuItemClassName, {
  background: 'none',
  border: 'none',
  padding: 0,
});
