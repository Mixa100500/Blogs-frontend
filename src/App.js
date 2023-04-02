import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [info, setInfo] = useState({ message: null })

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogout = async (event) => {
    event.preventDefault()

    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setNotification(`login ${username}`)
    } catch (error) {
      setErrorMessage('wrond username or password')
    }
  }

  const setErrorMessage = (error) => {
    setInfo({ 
      message: error,
      type: 'error' 
    })

    setTimeout(() => {
      setInfo({ message: null })
    }, 5000)
  }

  const setNotification = (message) => {
    setInfo({
      message: message,
      type: 'notificition'
    })

    setTimeout(() => {
      setInfo({ message: null })
    }, 5000)
  }

  
  const BlogForm = ({ blogs, setBlogs }) => {
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setUrl] = useState('')

    const handleBlog = async (event) => {
      event.preventDefault()
      try {
        const newBlog = await blogService.create({
          title,
          author,
          url,
        })

        setNotification(`a new blog ${title} ${author} added`)

        setBlogs(blogs.concat(newBlog))
      } catch (error) {
        setErrorMessage(error)
      }
    }
    
    return (
      <form onSubmit={handleBlog}>
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

  const Notification = ({ info }) => {
    if (info.message === null) {
      return null
    }

    const style = {
      color: info.type === 'error' ? 'red' : 'green',
      background: 'lightgrey',
      fontSize: 20,
      borderRadius: 5,
      borderStyle: 'solid',
      padding: 10,
      marginBottom: 10
    }

    return (
      <div style={style}>
        {info.message}
      </div>
    )
  }

  const LoginForm = () => {

    return (
      <form onSubmit={handleLogin}>
        <h2>Log in to application</h2>
        <Notification info={info}/>
        <div>
          username
          <input 
          type="text"
          value={username}
          onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input 
          type="text" 
          value={password}
          onChange={({ target }) => setPassword(target.value)}
          />
          <button type='submit'>login</button>
        </div>
      </form>
    )
  }

  if (user === null) {
    return LoginForm()
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification info={info} />
      <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
      <BlogForm blogs={blogs} setBlogs={setBlogs}/>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App