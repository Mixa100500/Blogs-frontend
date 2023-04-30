import PropTypes from 'prop-types'
import Notification from './Notification'

const LoginForm = ({
  handleSumbit,
  handleUsernameChange,
  handlePasswordChange,
  username,
  password,
  info
}) => {

  return (
    <form id='loginForm' onSubmit={handleSumbit}>
      <h2>Log in to application</h2>
      <Notification info={info}/>
      <div>
        username
        <input
          id='username'
          value={username}
          onChange={handleUsernameChange}
        />
      </div>
      <div>
        password
        <input
          id='password'
          value={password}
          onChange={handlePasswordChange}
        />
        <button type='submit' id='login-button'>
          login
        </button>
      </div>
    </form>
  )
}

LoginForm.propTypes = {
  handleSumbit: PropTypes.func.isRequired
}

export default LoginForm