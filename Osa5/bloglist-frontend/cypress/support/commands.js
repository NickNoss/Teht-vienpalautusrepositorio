Cypress.Commands.add("createBlog", ({ title, author, url, token }) => {
    cy.request({
      url: "http://localhost:3000/api/blogs",
      method: "POST",
      body: {
        title: title,
        author: author,
        url: url,
      },
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('loggedInUser')).token}`
      }
    })
  
    cy.visit("http://localhost:3000")
  })
  