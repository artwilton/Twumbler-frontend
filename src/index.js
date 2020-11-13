// define global variables

let currentUserId = 1
let addPost = false;
let loggedIn = false;

const main = document.querySelector("main")

// User Info Elements
const userInfo = document.querySelector("#user-info")
const userInfoText = userInfo.querySelector('#user-info-text')
const userName = document.querySelector("#user-name")
const userAge = document.querySelector("#user-age")
const userBio = document.querySelector("#user-bio")
const userProfilePhoto = document.querySelector("#user-profile-photo")

// Post Elements


// DOM Content Loaded
window.addEventListener('DOMContentLoaded', (event) => {
  initLogin()
  // initUser()
});


// Login 

const initLogin = () => {
  document.body.className = 'login-page'
  renderLoginPage()
  loginEventHandler()
}

function renderLoginPage() {

  main.innerHTML = `
    <form id="login-form">
      <div class="form-group">
        <label for="user-email">Email address</label>
        <input type="email" class="form-control" name="email" id="user-email" aria-describedby="emailHelp">
      </div>
      <div class="form-group">
        <label for="user-password">Password</label>
        <input type="password" class="form-control" id="user-password">
      </div>
      <button type="submit" class="btn btn-primary">Submit</button>
    </form>
  `

}

function loginEventHandler() {
  document.querySelector('#login-form')
  .addEventListener('submit', event => {
    event.preventDefault()
    getUserIdFromLogin(event.target.email.value)
  })
}

function getUserIdFromLogin(email) {
  fetch(`http://localhost:3000/api/v1/users/`)
  .then(r => r.json())
  .then(data => {
    data.forEach(user => {
      if (email === user.email) {
        currentUserId = user.id
      }
    })
    initUser()
  })
}

// Fetch

fetchUser = () => {
  return fetch(`http://localhost:3000/api/v1/users/${currentUserId}`)
    .then(r => r.json())
}

renderPostEditForm = () => {
  const postEditDiv = document.createElement('div')
  postEditDiv.className = 'container'
  postEditDiv.innerHTML = `
  <form id="post-form">
    <fieldset>
      <legend>New Post</legend>
      <div class="form-group">
        <label for="title">Title</label>
        <input type="text" id="title" name="title" style="width:50%">
      </div>
      <div class="form-group">
        <label for="content">Content</label>
        <textarea name="content" style="width:100%; height: 100px;" value=""></textarea> 
      </div>
      <button type="submit" value="Submit" class="btn btn-primary">Submit</button>
    </fieldset>
  </form>    
  `
  main.prepend(postEditDiv)
}

const initUser = () => {
    fetchUser()
    .then(data => {
      loggedIn = !loggedIn
      //re-render navbar to say "logout"
      document.body.className = 'logged-in'
      renderUser(data)
      renderPosts(data)
      editUserEventHandler()
      renderPostEditForm()
      newPostEventListener()
      document.querySelector('#login-form').remove()
    })
}

const deleteUser = () => {
  const configObj = {
    method: "DELETE",
  }
  // Add to database (CREATE)
  fetch(`http://localhost:3000/api/v1/users/${currentUserId}`, configObj)

  currentUserId += 1
  initLogin()
}

// User Helper Methods

const renderUser = user => {

  console.log(user)

  userName.textContent = user.name
  userAge.textContent = user.age
  userBio.textContent = user.bio

  userInfo.dataset.id = user.id
  userInfo.className = 'card'

  userProfilePhoto.src = `http://localhost:3000/${user.user_profile_photo}`
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
  <textarea name=bio>${userBio.textContent}</textarea><br><br>
  <Input type='file' name='profile_photo' class="edit-profile-photo"/><br><br>
  <input type=submit value=Submit>
  </fieldset>
  `
  
  toggle(userInfoText)
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
  
  editProfilePhoto(userObj)
}

// REFACTOR to rename div

const div = document.createElement('div')

// Post Helper Methods
div.id = 'posts'
div.className = 'row row-cols-1 row-cols-md-2'
const createPostCard = (post) => {

  const card = document.createElement("card")
  card.innerHTML = `
      <h3 class=card-header>${post.title}</h3>  
      <p class=card-body>${post.content}</p>
      <div class="btn-group dropleft">
        <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Options</button>
        <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
          <button type=button class="edit btn btn-primary dropdown-item">Edit</button>
          <div class="dropdown-divider"></div>
          <button type=button class="delete btn btn-danger dropdown-item">Delete</button>
        </div>
      </div>
  <br>
  `
  card.dataset.id = post.id
  card.className = 'col mb-4 card'

  div.prepend(card)
  main.append(div)
}

const renderPosts = user => {
  const createPostButton = document.createElement('button')
  createPostButton.id = "new-post-btn"
  createPostButton.className = "btn btn-outline-secondary"
  createPostButton.textContent = "Create A New Post"
  main.append(createPostButton)
  div.innerHTML = ""
  user.posts.forEach(post => {
    createPostCard(post)
  })
}

// Event Listeners

  // User Event Listener
const editUserEventHandler = () => {
  userInfo.addEventListener('click', event => {
    if (event.target.matches('.edit')) {
      editUserForm()
    } else if (event.target.matches('.delete')) {
        if (confirm('Are you sure you want to delete your account?')) {
          deleteUser()
          console.log('User was removed from the database.');
        } else {
          console.log('User was not removed from the database.');
        }
    }
  })
}

  // Post Event Listener
const newPostEventListener = () => {

  const addBtn = document.querySelector("#new-post-btn")
  const postFormContainer = document.querySelector(".container")

  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addPost = !addPost;
    if (addPost) {
      postFormContainer.style.display = "block";
      addBtn.textContent = "Hide Form"
    } else {
      postFormContainer.style.display = "none";
      addBtn.textContent = "Create A New Post"
    }
  });
  postFormEventListener()
}

const editProfilePhoto = (userObj) => {

  const formData = new FormData();
  const fileField = document.querySelector('input[type="file"]');
  
  formData.append('name', userObj.name);
  formData.append('age', userObj.age);
  formData.append('bio', userObj.bio);

  if (!!fileField.files[0]) {
    formData.append('profile_photo', fileField.files[0]);
  }
  
  fetch(`http://localhost:3000/api/v1/users/${currentUserId}`, {
    method: 'PUT',
    body: formData
  })
  .then(response => response.json())
  .then(user => {
    userInfo.querySelector('form').remove()
    renderUser(user)
    toggle(userInfoText)
  })
 
}

function toggle(element) {
  if (element.style.display == "none") {
    element.style.display = ""
  } else {
    element.style.display = "none"
  }
}

//------------ Make POST request for a new post, update in comments board ------------//
// Add Event Handler for Submit
const postFormEventListener = () => {
  const postForm = document.querySelector('#post-form')
  postForm.addEventListener("submit", event => {
    event.preventDefault()
    // console.log('You clicked Submit')
    createNewPost(event)
    postForm.reset()
  })
}
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
  const card = event.target.closest('card')
  // console.log(card)
  const postId = card.dataset.id
  // console.log(postId)
  
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
    editPost(event)
  })
}
// Use to update database
const editPost = (event) => {
  const title = event.target.title.value
  const content = event.target.content.value
  const card = event.target.parentElement
  const postId = card.dataset.id

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
    card.remove()
    // Render post
    createPostCard(post)

  })
}

// renderFriends
