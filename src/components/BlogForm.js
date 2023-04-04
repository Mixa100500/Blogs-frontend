import { useState } from "react"

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
        onChange={({ target })=> setTitle(target.value)}
        type="text"
        value={title}
        />
      </div>
      <div>
      author:
        <input
        onChange={({ target })=> setAuthor(target.value)}
        type="text"
        value={author}
        />
      </div>
      <div>
      url:
        <input
        onChange={({ target })=> setUrl(target.value)}
        type="text"
        value={url}
        />
      </div>
      <button type='submit'>send</button>
    </form>
  )
}

export default BlogForm