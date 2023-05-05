describe('Blog app', function () {
  beforeEach(function() {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, {
      name: 'Supertester',
      username: 'root',
      password: 'secret'
    })
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, {
      name: 'Supertester2',
      username: 'tester',
      password: 'secret'
    })
    cy.visit('')
  })

  it('Login from is shown', function() {
    cy.contains('Log in to application')
  })

  describe('Login', function() {
    it('succeeds with corect credentials', function() {
      cy.get('#username').type('root')
      cy.get('#password').type('secret')
      cy.get('#login-button').click()

      cy.contains('Supertester logged in')
    })

    it('fails with wrong crefentials', function() {
      cy.get('#username').type('root')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()

      cy.contains('wrong username or password').should('have.css', 'background-color', 'rgb(211, 211, 211)')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      const user = {
        username: 'root',
        password: 'secret'
      }
      cy.login(user)
    })

    it('A blog can be created', function() {
      cy.contains('create a new Blog').click()
      cy.get('#title').type('React it is a great library')
      cy.get('#author').type('Author')
      cy.get('#url').type('www.')
      cy.contains('send').click()

      cy.contains('React it is a great library Author')
      cy.contains('Author')
    })
  })

  describe('When a blog has been created', function () {
    beforeEach(function () {
      cy.login({ username: 'root', password: 'secret' })
      cy.createBlog({
        title: 'React it is a great library',
        author: 'tester',
        url: 'www.'
      })
    })

    it('it can be liked', function() {
      cy.contains('view').click()
      cy.contains('like').click()

      cy.contains('like 1')
    })

    it('the creator can delete it', function() {
      cy.contains('view').click()
      cy.contains('like').click()

      cy.contains('likes 1')
    })

    it('a non creator can delete a blog', function() {
      cy.contains('logout').click()
      cy.login({ username: 'tester', password: 'secret' })
      cy.contains('view').click()
      cy.contains('delete').should('not.exist')
    })
  })

  describe('When there exists several blogs', function() {
    const blogs = [
      { title: 'blog1', author: 'author1', url: 'google.com' },
      { title: 'blog2', author: 'author2', url: 'google.com' },
      { title: 'blog3', author: 'author3', url: 'google.com' }
    ]

    beforeEach(function() {
      cy.login({ username: 'root', password: 'secret' })
      cy.createBlog(blogs[0])
      cy.createBlog(blogs[1])
      cy.createBlog(blogs[2])
    })

    it('those are ordered by the likes', function() {
      cy.contains(blogs[0].title).contains('show').click()
      cy.contains(blogs[0].title).contains('like').as('like0')
      cy.contains(blogs[1].title).contains('show').click()
      cy.contains(blogs[1].title).contains('like').as('like1')
      cy.contains(blogs[2].title).contains('show').click()
      cy.contains(blogs[2].title).contains('like').as('like2')

      cy.get('@like2').click()
      cy.contains(blogs[2].title).contains('likes 1')
      cy.get('@like2').click()
      cy.contains(blogs[2].title).contains('likes 1')
      cy.get('@like2').click()
      cy.contains(blogs[2].title).contains('likes 2')
      cy.get('@like2').click()
      cy.contains(blogs[2].title).contains('likes 3')

      cy.get('@like1').click()
      cy.contains(blogs[1].title).contains('likes 1')
      cy.get('@like1').click()
      cy.contains(blogs[1].title).contains('likes 2')

      cy.get('@like0').click()
      cy.contains(blogs[0].title).contains('likes 1')

      cy.get('.blog').eq(0).should('contain', blogs[2].title)
      cy.get('.blog').eq(1).should('contain', blogs[1].title)
      cy.get('.blog').eq(2).should('contain', blogs[0].title)
    })
  })
})