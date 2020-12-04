// Set default session headers here
export async function prepare( headers ) {
  return {
    context: {
    },
    // These headers are for non-logged users
    headers: {
      KE_WEBAPP : "Hello, World!"
    }
  }
}

// This function takes context objects which could contain
// sensitive information like auth tokens. It then returns a
// safe session object for the client.
export function getSession( context ) {
  return {
    user: context.user && {
      username: context.user.username
    }
  }
}
