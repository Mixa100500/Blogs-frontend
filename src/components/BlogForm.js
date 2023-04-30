import { useState } from 'react'
import PropTypes from 'prop-types'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title,
      author,
      url
    })
  }

  return (
    <form onSubmit={addBlog}>
      <h2>create new</h2>
      <div>
      title:
        <input
          onChange={({ target }) => setTitle(target.value)}
          placeholder='write blog title here'
          type="text"
          value={title}
        />
      </div>
      <div>
      author:
        <input
          onChange={({ target }) => setAuthor(target.value)}
          placeholder='write blog auther name here'
          type="text"
          value={author}
        />
      </div>
      <div>
      url:
        <input
          onChange={({ target }) => setUrl(target.value)}
          placeholder='write blog url addresse here'
          type="text"
          value={url}
        />
      </div>
      <button type='submit'>send</button>
    </form>
  )
}

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired
}

export default BlogForm