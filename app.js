document.getElementById('loginBtn').addEventListener('click', async () => {
    
    const username = prompt("Enter your username:");
    const password = prompt("Enter your password:");
    const token = await getJWT(username, password);
    console.log(token)
  console.log("ceww",token, username)
    const result = await graphqlRequest(GET_USER_INFO, token, { name: username });
    console.log(result)
    document.getElementById('output').textContent = JSON.stringify(result, null, 2);
  });
  