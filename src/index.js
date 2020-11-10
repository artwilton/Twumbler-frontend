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
  // const userInfo = document.querySelector("#user-info")

  const name = document.querySelector("#user-name")
  name.textContent = user.name

  const age = document.querySelector("#user-age")
  age.textContent = user.age

  const bio = document.querySelector("#user-bio")
  bio.textContent = user.bio

  

  // renderUser(user)
}

// Post Helper Methods
const createPostCard = (post, postCards) => {
  const card = document.createElement("card")
  card.innerHTML = `<h3>${post.title}</h3>  <p>${post.content}</p>`
  
  postCards.append(card)
}

const renderPosts = user => {
  const postCards = document.querySelector("main")

  user.posts.forEach(post => {
    createPostCard(post, postCards)
  })
}