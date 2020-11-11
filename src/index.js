let currentUserId = 1

const userInfo = document.querySelector("#user-info")
const userName = document.querySelector("#user-name")
const userAge = document.querySelector("#user-age")
const userBio = document.querySelector("#user-bio")

window.addEventListener('DOMContentLoaded', (event) => {
  initUser()
});


//

const initUser = () => {
  fetch(`http://localhost:3000/api/v1/users/${currentUserId}`)
    .then(r => r.json())
    .then(data => {
      renderUser(data)
      renderPosts(data)
      editUserEventHandler()
    })
}

// init()

// Fetch

// const updateUser = user => {
//   fetch(`http://localhost:3000/api/v1/users/${currentUserId}`, {
//     method: "PATCH",
//     headers: {
//       "Content-Type": "application/json"
//     },
//     body: JSON.stringify({ 
//       name: "Cordelia Chases"
//     })
//   })
//     .then(r => r.json())
//     .then(console.log)
// }

const deleteUser = () => {
  const configObj = {
    method: "DELETE",
  }
  // Add to database (CREATE)
  fetch(`http://localhost:3000/api/v1/users/${currentUserId}`, configObj)

  currentUserId += 1
  initUser()
}

// User Helper Methods


const renderUser = user => {

  userName.textContent = user.name
  userAge.textContent = user.age
  userBio.textContent = user.bio
  userInfo.dataset.id = user.id
  currentUserId = user.id
}



const editUserForm = () => {

  const form = document.createElement('form')
  form.innerHTML = `
  <form id="user-edit-form">
  <fieldset>
  <legend>Edit User:</legend>
  <label for=name>Name:</label><br>
  <textarea name=name>${userName.textContent}</textarea><br>
  <label for=age>Age:</label><br>
  <textarea name=age>${userAge.textContent}</textarea><br>
  <label for=bio>Bio:</label><br>
  <textarea name=bio>${userBio.textContent}</textarea> 
  <input type=submit value=Submit>
  </fieldset>
  `
  
  userInfo.querySelector('button').style.display = 'none'
  userInfo.querySelectorAll('p').forEach(p => {
    p.style.display = 'none'
  });
  userInfo.append(form)
  userInfoEdit(userInfo)
  
}

const userInfoEdit = (userInfo) => {
  userInfo.addEventListener("submit", event => {
    event.preventDefault()
    editUser(event)
  })
}


const editUser = (event) => {

  const name = event.target.name.value
  const age = event.target.age.value
  const bio = event.target.bio.value

  let userObj = {name, age, bio}
  
  editUserFetch(userObj)
}

const editUserFetch = (userObj) => {
  const configObj = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(userObj)
  }
  // Add to database (CREATE)
  fetch(`http://localhost:3000/api/v1/users/${currentUserId}`, configObj)
  .then(r => r.json())
  .then(user => {

    renderUser(user)
    userInfo.querySelector('.edit').style.display = ''
    userInfo.querySelectorAll('p').forEach(p => {
      p.style.display = ''
    });
    userInfo.querySelector('form').remove()
    
  })
}


const main = document.querySelector("main")
const div = document.createElement('div')

// Post Helper Methods
div.id = 'posts'
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
  div.innerHTML = ""
  user.posts.forEach(post => {
    createPostCard(post)
  })
}

const postForm = document.querySelector('#post-form')
console.log(postForm)

// Event Listeners

  // User Event Listener
const editUserEventHandler = () => {
  userInfo.addEventListener('click', event => {
    if (event.target.matches('.edit')) {
      editUserForm()
    } 
    if (event.target.matches('.delete')) {
      if (confirm('Are you sure you want to delete your account?')) {
        deleteUser()
        console.log('User was removed from the database.');
      } else {
        console.log('User was not removed from the database.');
      }
    } 
  })
}

//------------ Make POST request for a new post, update in comments board ------------//
// Add Event Handler for Submit
postForm.addEventListener("submit", event => {
  event.preventDefault()
  // console.log('You clicked Submit')
  createNewPost(event)
  postForm.reset()
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
    // console.log("I am delete")
    if (confirm('Are you sure you want to delete this post?')) {
      deletePost(postId, card)
      console.log('Post was removed from the database.');
    } else {
      console.log('Post was not removed from the database.');
    }
  }
})

// User can delete their post
const deletePost = (postId, card) => {
  const configObj = {
    method: "DELETE",
    headers: {"Content-Type": "application/json"}
  }
  
  fetch(`http://localhost:3000/api/v1/posts/${postId}`, configObj)
  .then(card.remove())
}


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
            <textarea name=content>${content}</textarea> 
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
  // Add to database
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


