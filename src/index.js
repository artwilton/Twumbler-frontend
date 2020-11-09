fetch("http://localhost:3000/api/v1/users/24")
  .then(r => r.json())
  .then(console.log)


// fetch("http://localhost:3000/api/v1/users/24", {
//   method: "PATCH",
//   headers: {
//     "Content-Type": "application/json"
//   },
//   body: JSON.stringify({ 
//     name: "updated name"
//   })
// })
//   .then(r => r.json())
//   .then(console.log)