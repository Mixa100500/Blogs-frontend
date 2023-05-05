import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({
  blog,
  like,
  own,
  handleDeleteBlog
}) => {
  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const addLikes = (event) => {
    event.preventDefault()
    like(blog)
  }

  const deleteBlog = () => {
    const answer = window.confirm(`Remove blog ${blog.title}`)
    if (answer) handleDeleteBlog()
  }

  let showWhenYour = { display: 'none' }
  if (own) {
    showWhenYour = { display: '' }
  }

  return (
    <div className='blog' style={blogStyle}>
      {!visible && (<div className='previewBlog'>
        <span>{blog.title} {blog.author}</span>
        <button onClick={toggleVisibility}>{visible ? 'hide' : 'view'}</button>
      </div>)}
      {visible && (
        <div className='blogContent'>
          <div>
            <span>{blog.title}</span>
            <button onClick={toggleVisibility}>hide</button>
          </div>
          <div><a href={blog.url}>{blog.url}</a></div>
          <div>
            <span>likes {blog.likes}</span>
            <button style={showWhenYour} onClick={addLikes} className='buttonLike'>like</button>
          </div>
          <div>{blog.author}</div>
          <button
            style={showWhenYour}
            onClick={deleteBlog}
          >
            delete
          </button>
        </div>
      )}
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  like: PropTypes.func.isRequired,
  own: PropTypes.bool.isRequired,
  handleDeleteBlog: PropTypes.func.isRequired
}

export default Blog