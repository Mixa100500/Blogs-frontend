import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({
  blog,
  updateBlog,
  user,
  handleDeleteBlog
}) => {
  const [blogVisible, setBlogVisible] = useState(false)

  const hideWhenVisible = { display: blogVisible ? 'none' : '' }
  const showWhenVisible = { display: blogVisible ? '' : 'none' }

  const toggleVisibility = () => {
    setBlogVisible(!blogVisible)
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
    updateBlog({
      ...blog,
      likes: blog.likes + 1
    })
  }

  const deleteBlog = () => {
    const answer = window.confirm(`Remove blog ${blog.title}`)
    if (answer) handleDeleteBlog()
  }

  let showWhenYour = { display: 'none' }
  if (user) {
    showWhenYour = { display: blog.user.username === user.username ? '' : 'none' }
  }

  return (
    <div className='blog' style={blogStyle}>
      <div style={hideWhenVisible} className='previewBlog'>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>view</button>
      </div>
      <div style={showWhenVisible} className='blogContent'>
        <div>
          {blog.title}
          <button onClick={toggleVisibility}>hide</button>
        </div>
        <div><a href={blog.url}>{blog.url}</a></div>
        <div>likes {blog.likes}
          <button onClick={addLikes} className='buttonLike'>like</button>
        </div>
        <div>{blog.author}</div>
        <button
          style={showWhenYour}
          onClick={deleteBlog}
        >
          delete
        </button>
      </div>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  updateBlog: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  handleDeleteBlog: PropTypes.func.isRequired
}

export default Blog