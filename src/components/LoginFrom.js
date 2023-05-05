import PropTypes from 'prop-types'
import { useState } from 'react'

const LoginForm = ({ login }) => {
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const handleSumbit = (event) => {
    event.preventDefault()

    login({ password, username })
  }

  return (
    <form id='loginForm' onSubmit={handleSumbit}>
      <div>
        username
        <input
          id='username'
          value={username}
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          id='password'
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        />
        <button type='submit' id='login-button'>
          login
        </button>
      </div>
    </form>
  )
}

LoginForm.propTypes = {
  login: PropTypes.func.isRequired
}

export default LoginForm