import { useState } from 'react'
import PropTypes from 'prop-types'

const Togglable = (props) => {
  const [blogVisible, setBlogVisible] = useState(false)

  const toggleVisiblity = () => {
    setBlogVisible(!blogVisible)
  }

  const hideWhenVisible = { display: blogVisible ? 'none' : '' }
  const showWhenVisible = { display: blogVisible ? '' : 'none' }

  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisiblity}>{props.buttonLabel}</button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <button onClick={toggleVisiblity}>cancel</button>
      </div>
    </div>
  )
}
Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired
}

export default Togglable