const currentUserId = 1

window.addEventListener('DOMContentLoaded', (event) => {
  fetch(`http://localhost:3000/api/v1/users/${currentUserId}`)
    .then(r => r.json())
    .then(data => {
      renderUser(data)
      renderPosts(data)
    })
});

// Fetch
const updateUser = user => {
  fetch(`http://localhost:3000/api/v1/users/${currentUserId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ 
      name: "Cordelia Chases"
    })
  })
    .then(r => r.json())
    .then(console.log)
}

// User Helper Methods

const renderUser = user => {
  const userInfo = document.querySelector("#user-info")

  const name = document.querySelector("#user-name")
  name.textContent = user.name

  const age = document.querySelector("#user-age")
  age.textContent = user.age

  const bio = document.querySelector("#user-bio")
  bio.textContent = user.bio

  userInfo.dataset.id = user.id

}

const main = document.querySelector("main")
const div = document.createElement('div')
div.id = 'posts'

// Post Helper Methods
const createPostCard = (post) => {

  const card = document.createElement("card")
  card.innerHTML = `
  <h3>${post.title}</h3>  
  <p>${post.content}</p>
  <button class=edit>Edit</button>
  <button class=delete>Delete</button>
  `
  card.dataset.id = post.id
  card.className = 'cards'

  div.prepend(card)
  main.append(div)
}



const renderPosts = user => {

  user.posts.forEach(post => {
    createPostCard(post)
  })
}

const postForm = document.querySelector('#post-form')
console.log(postForm)



//------------ Make POST request for a new post, update in comments board ------------//
// Add Event Handler for Submit
postForm.addEventListener("submit", event => {
  event.preventDefault()
  // console.log('You clicked Submit')
  createNewPost(event)
})
// Grab textarea.value
const createNewPost = (event) => {
  // Grab info
  const title = event.target.title.value
  const content = event.target.content.value
  // Use to update post data
  createPostFetch(title, content)
}

const createPostFetch = (title, content) => {
  const configObj = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      user_id: currentUserId,
      title: title,
      content: content
    })
  }
  // Add to database (CREATE)
  fetch(`http://localhost:3000/api/v1/posts`, configObj)
  .then(r => r.json())
  .then(post => {
    console.log(post)
    // Render post
    createPostCard(post)
  })
}


// User can edit their post (show that it was edited) PATCH request
div.addEventListener("click", event => {
  // console.log('You clicked me')
  const card = event.target.parentElement
  const postId = card.dataset.id
  
  if (event.target.matches('.edit')) {
    editPostForm(card)
  }

  if (event.target.matches('.delete')) {
    // deletePost(event, postId, card)
  }
})
//a form replaces the card with title and content
const editPostForm = (card) => {
  const title = card.querySelector('h3').innerText
  const content = card.querySelector('p').textContent
  const form = document.createElement('form')

  form.innerHTML = `
  <form id="post-edit-form">
          <fieldset>
            <legend>Edit Post:</legend>
            <label for=title>Title:</label><br>
            <textarea name=title>${title}</textarea><br>
            <label for=content>Content:</label><br>
            <textarea name=content>
              ${content}             
            </textarea> 
            <input type=submit value=Submit>
          </fieldset>
  `
  card.innerHTML = ""
  card.append(form)
  cardEdit(card)
  
}
// Grab the value
const cardEdit = (card) => {
  card.addEventListener("submit", event => {
    event.preventDefault()
    // console.log('Meeeeeeee')
    editPost(event)
  })
}
// Use to update database
const editPost = (event) => {
  const title = event.target.title.value
  const content = event.target.content.value
  const card = event.target.parentElement
  const postId = card.dataset.id

  // console.log(postId)
  
  editPostFetch(title, content, postId, card)
}

const editPostFetch = (title, content, postId, card) => {
  const configObj = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      title: title,
      content: content
    })
  }
  // Add to database (CREATE)
  fetch(`http://localhost:3000/api/v1/posts/${postId}`, configObj)
  .then(r => r.json())
  .then(post => {
    console.log(post)
    //Delete Form from card
    card.innerHTML = ""
    // Render post
    createPostCard(post)

  })
}
// Front End
// Render post
// Back End
// Grab info
// Add to database (PATCH)


