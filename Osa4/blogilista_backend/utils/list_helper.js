const lodash = require('lodash')

const dummy = (blogs) => {
    return 1
  }

const totalLikes = (blogs) => {
    let total = 0
    blogs.forEach(blog => {
        total += blog.likes
    })
    return total
}

const favoriteBlog = (blogs) => {
    let favBlog = blogs[0]

    blogs.forEach((blog) => {
        if (blog.likes > favBlog.likes) favBlog = blog
      })

      return {
        title: favBlog.title,
        author: favBlog.author,
        likes: favBlog.likes
      }
}

const mostBlogs = (blogs) => {
    const blogCount = lodash.countBy(blogs, "author")
    let topBlogger = { author: "", blogs: 0 }
    Object.keys(blogCount).forEach((author) => {
      if (topBlogger.blogs < blogCount[author]) {
        topBlogger = { author: author, blogs: blogCount[author] }
      }
    })
    return topBlogger
  }

const mostLikes = (blogs) =>  {
    const authorLikes = blogs.reduce((acc, blog) => {
        const author = blog.author
        const likes = blog.likes

        acc[author] = acc[author] ? acc[author] + likes : likes

        return acc
    }, {})

    const maxLikes = Math.max(...Object.values(authorLikes))
    const authorWithMaxLikes = Object.keys(authorLikes).find((author) => {
        return authorLikes[author] === maxLikes
      })

      return {
        author: authorWithMaxLikes,
        likes: maxLikes
      }
}
  
  module.exports = {
    favoriteBlog,
    dummy,
    totalLikes,
    mostBlogs,
    mostLikes
  }