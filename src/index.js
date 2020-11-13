let currentUserId = 1

const userInfo = document.querySelector("#user-info")
const userName = document.querySelector("#user-name")
const userAge = document.querySelector("#user-age")
const userBio = document.querySelector("#user-bio")
const userProfilePhoto = document.querySelector("#user-profile-photo")

let addPost = false;

window.addEventListener('DOMContentLoaded', (event) => {
  initUser()
  const addBtn = document.querySelector("#new-post-btn");
  const postFormContainer = document.querySelector(".container");
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
});


// Fetch

const initUser = () => {
  fetch(`http://localhost:3000/api/v1/users/${currentUserId}`)
    .then(r => r.json())
    .then(data => {
      renderUser(data)
      renderPosts(data)
      editUserEventHandler()
    })
}

const deleteUser = () => {
  const configObj = {
    method: "DELETE",
  }
  // Add to database (CREATE)
  fetch(`http://localhost:3000/api/v1/users/${currentUserId}`, configObj)

  currentUserId += 1
  initUser()
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

const main = document.querySelector("main")
const div = document.createElement('div')

// Post Helper Methods
div.id = 'posts'
div.className = 'row row-cols-1 row-cols-md-2'
const createPostCard = (post) => {

  const card = document.createElement("card")
  card.innerHTML = `
      <h3 class=card-header>${post.title}</h3>  
      <p class=card-body>${post.content}</p>
      <div class="btn-group dropup">
        <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          Options
        </button>
        <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
          <button type=button class="edit btn btn-secondary dropdown-item">Edit Post</button>
          <div class="dropdown-divider"></div>
          <button type=button class="delete btn btn-danger dropdown-item">Delete Post</button>
        </div>
        <button class="view-comments btn btn-secondary">View Comments</button>
      </div>
  <br>
  `
  card.dataset.id = post.id
  card.className = 'col mb-4 card'

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
  // Event listener for .view-comments button
  // can add to div event listener
  if (event.target.matches('.view-comments')) {
    console.log("View Comments!")
    viewComments(postId)
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
    card.remove()
    // Render post
    createPostCard(post)

  })
}

//--------***************RENDER POST & COMMENTS******************--------//
// Fetch post comments 
// Render comments in 'post-comments'
const postComments = document.querySelector('post-comments')
const postAndComments = document.querySelector('post-and-comments')
console.log(postComments.innerHTML)

const viewComments = (postId) => {
  console.log(postId)
  fetchPost(postId)
}

const createPostCardWithComments = (post) => {
  postComments.innerHTML = ""

  const div = document.createElement('div')
  div.className = "post-and-comments"
  const card = document.createElement("card")
  card.innerHTML = `
        <div class="card-header">
          <h3>${post.title}</h3>
        </div>
        <div class="card-body">
          <p class="card-title">${post.content}</p>
          <div class="btn-group dropdown">
            <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              Options
            </button>
            <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
              <button type=button class="edit btn btn-secondary dropdown-item">Edit Post</button>
              <div class="dropdown-divider"></div>
              <button type=button class="delete btn btn-danger dropdown-item">Delete Post</button>
            </div>
          </div>
          <div class=comments></div>
        </div>
  `
  card.dataset.id = post.id
  card.className = 'post-with-comments card'
  div.append(card)
  postComments.append(div)
}

let commentCreated = 1

const createCommentLi = (comment) => {
  const div = document.querySelector('.comments')
  console.log(div)

  const card = document.createElement('card')
  card.className = "card"
  card.innerHTML = `
  <div class="card-body">
    <p class="card-title">"${comment.content}"</p>
    <p class="card-text"><em><small>${commentCreated+=1} hours ago</small></em></p>
  </div>
  `
  div.append(card)
}

const renderComments = post => {
  // ul.innerHTML = ""
  post.comments.forEach(comment => {
    createCommentLi(comment)
  })
}

const fetchPost = (postId) => {
  fetch(`http://localhost:3000/api/v1/posts/${postId}`)
  .then(r => r.json())
  .then(post => {
    console.log(post)
    createPostCardWithComments(post)
    renderComments(post)
  })
}


// Close