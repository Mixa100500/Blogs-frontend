describe('Blog app', function () {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Supertester',
      username: 'root',
      password: 'secret'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  it('Login from is shown', function() {
    cy.get('#loginForm')
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
      cy.get('input[placeholder="write blog title here"]').type('React it is a great library')
      cy.get('input[placeholder="write blog auther name here"]').type('Author')
      cy.get('input[placeholder="write blog url addresse here"]').type('www.')
      cy.contains('send').click()

      cy.get('.blog').contains('React it is a great library Author')
    })

    describe('and a blog exists', function () {
      beforeEach(function () {
        cy.createBlog({
          title: 'React it is a great library',
          author: 'author',
          url: 'www.'
        })
      })

      it('Users can like a blog', function() {
        cy.get('.blog').contains('view').click()
        cy.get('.buttonLike').click()
        cy.get('.blogContent').contains('likes 1')
      })
    })

  })
})