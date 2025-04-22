document.getElementById('loginBtn').addEventListener('click', async () => {
    
    const username = prompt("Enter your username:");
    const password = prompt("Enter your password:");
    const token = await getJWT(username, password);
    console.log(token)
  console.log("ceww",token, username)
    const result = await graphqlRequest(GET_USER_INFO, token, { name: username });
    console.log(result)
    let userInfo= result.data.user;
    renderUsers(userInfo)
    
  });
  
  // Takes user slices and dynamically renders to DOM
  function renderUsers(userIntel){
    console.log(userIntel)
    if (Array.isArray(userIntel)){
console.log("array  ")
    }
    const userContainer = document.createElement("div")
    userContainer.className = "userContainer"
    const userItems = userIntel.map(user => `
        <li>
      <h3>${user.attrs.email}</h3>
      <p>${user.attrs.gender}</p>
       <p>${user.auditRatio}</p>
    </li>
      `).join('')
userContainer.innerHTML = userItems
      document.body.appendChild(userContainer);
    
  }