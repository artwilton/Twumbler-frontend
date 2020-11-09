fetch("http://localhost:3000/api/v1/users/24")
  .then(r => r.json())
  .then(data => {
    renderUser(data)
    renderPosts(data)
  })


// fetch("http://localhost:3000/api/v1/users/24", {
//   method: "PATCH",
//   headers: {
//     "Content-Type": "application/json"
//   },
//   body: JSON.stringify({ 
//     name: "Cordelia Chases"
//   })
// })
//   .then(r => r.json())
//   .then(console.log)

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


const createPostCard = (post, postCards) => {
  const card = document.createElement("card")
  card.innerHTML = `<h3>${post.title}</h3>  <p>${post.content}</p>`
  
  postCards.append(card)
}

const renderPosts = user => {
  const postCards = document.querySelector("main")
  postCards.innerHTML = ""

  user.posts.forEach(post => {
    createPostCard(post, postCards)
  })
}