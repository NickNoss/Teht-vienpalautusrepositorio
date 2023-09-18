import { func } from "prop-types"

describe('Blog app', function() {

  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
    username: "CypressHillFan",
    name: "John",
    password: "Illusion"
    }
    cy.request('POST', 'http://localhost:3003/api/users', user)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('log in to application')
    cy.get('input[name="Username"]').should('exist')
    cy.get('input[name="Password"]').should('exist')
    cy.get('button[type="submit"]').should('exist')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get("#username").type("CypressHillFan")
      cy.get("#password").type("Illusion")
      cy.get("#login-button").click()
      cy.contains("Logged in as John")
    })

    it('fails with wrong credentials', function() {
      cy.get("#username").type("CypressFan")
      cy.get("#password").type("asd")
      cy.get("#login-button").click()
      
      cy.contains("Wrong username/password")
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.get("#username").type("CypressHillFan")
      cy.get("#password").type("Illusion")
      cy.get("#login-button").click()
    })

    it('A blog can be created', function() {
      cy.get("#togglablebutton").click()
      cy.get("#titleinput").type("CypressBlogi")
      cy.get("#authorinput").type("BiggestFan")
      cy.get("#urlinput").type("CypressHill.com")
      cy.contains("button", "create").click()

      cy.contains("CypressBlogi")
    })
  })

  describe('User interactions', function() {

    beforeEach(function() {
      cy.get("#username").type("CypressHillFan")
      cy.get("#password").type("Illusion")
      cy.get("#login-button").click()
      cy.get("#togglablebutton").click()
      cy.createBlog({
        title: "CypressBlog",
        author: "BiggestFan",
        url: "cypresshill.com"
      })
    })
    
    it('Blog can be liked', function() {
    cy.contains("button", "View").click()
    cy.contains("0 likes")
    cy.contains("button", "Like").click()

    cy.contains("1 like")
    })

    it('Blog can be deleted', function() {
      cy.contains("button", "View").click()
      cy.contains("button", "remove").click()
      cy.get("html").should("not.contain", "CypressBlogi")
    })

    it("Blog can't be removed by user who isn't creator", function() {
      cy.createBlog({
        title: "ASD",
        author: "DSA",
        url: "hahaha",
        token: "ooooo"
      })
      cy.contains("ASD")
      cy.contains("button", "View").click()
      cy.contains("remove").click()
      cy.contains("ASD")
    })
  })

  describe('Arrangement test', function() {
    beforeEach(function() {
      cy.get("#username").type("CypressHillFan")
      cy.get("#password").type("Illusion")
      cy.get("#login-button").click()
      cy.get("#togglablebutton").click()
    })

    it('Blogs sorted by likes', function() {
      cy.createBlog({
        title: "first",
        author: "1st",
        url: "asd"
      }),
      cy.createBlog({
        title: "second",
        author: "2nd",
        url: "asd"
      }),
      cy.createBlog({
        title: "third",
        author: "3rd",
        url: "asd"
      })
      cy.contains("View").click()
      cy.contains("View").click()
      cy.contains("View").click()

      cy.get('button:contains(Like)').then(($buttons) => {
        $buttons.each((index, $button) => {
          if (index === 0) {
            cy.wrap($button).click().click().click();
          } else if (index === 1) {
            cy.wrap($button).click().click();
          } else if (index === 2) {
            cy.wrap($button).click();
          }
        })
      })

      cy.get(".blog").eq(0).contains("first")
      cy.get(".blog").eq(1).contains("second")
      cy.get(".blog").eq(2).contains("third")
    })
  })
})