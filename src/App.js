import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import Notification from './components/Notification'
import LoginForm from './components/LoginFrom'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [info, setInfo] = useState({ message: null })

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs.sort(compareLikes))
    )
  }, [])

  const compareLikes = (a, b) => {
    return b.likes - a.likes
  }

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

  const handleDeleteBlog = async (id) => {
    try {
      await blogService.remove(id)
      setBlogs(blogs.filter(a => a.id !== id))
      setNotification('delete blog')
    } catch (error) {
      setErrorMessage(error)
    }
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
      setErrorMessage('wrong username or password')
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

  const addBlog = async ({
    title,
    author,
    url
  }) => {
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

  const updateBlog = async ({
    title,
    author,
    url,
    likes,
    user,
    id
  }) => {
    try {
      const returnedBlog = await blogService
        .apdate(
          id,
          {
            user: user.id,
            likes,
            author,
            title,
            url,
          }
        )
      setBlogs(blogs.map(blog => blog.id !== id ? blog : returnedBlog))
    } catch (error) {
      setErrorMessage(error)
    }
  }


  if (user === null) {
    return <LoginForm
      handleSumbit={handleLogin}
      handleUsernameChange={({ target }) => {setUsername(target.value)}}
      handlePasswordChange={({ target }) => {setPassword(target.value)}}
      username={username}
      password={password}
      info={info}
    />
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification info={info} />
      <p>{user.name} logged in
        <button onClick={handleLogout}>logout</button>
      </p>
      <Togglable buttonLabel='create a new Blog'>
        <BlogForm
          createBlog={addBlog}
        />
      </Togglable>
      {blogs.map(blog =>
        <Blog
          user={user}
          handleDeleteBlog={() => handleDeleteBlog(blog.id)}
          key={blog.id}
          blog={blog}
          updateBlog={(newBlog) => { updateBlog(newBlog) }}
        />
      )}
    </div>
  )
}

export default App