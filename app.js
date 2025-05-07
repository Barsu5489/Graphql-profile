//login spa
document.getElementById('loginForm').addEventListener('submit', async (event) => {
  event.preventDefault(); 

  // Get the username and password from the form inputs
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  try {
    // Get the JWT token
    const token = await getJWT(username, password);
    // localStorage.setItem("authtkn", token); // save token
    // Fetch eventId dynamically or set it manually
    const eventId = 75; 
    // Fetch user info
    const result = await graphqlRequest(GET_USER_INFO, token, { eventId });
    const userinfo = result.data.user;

    document.getElementById("loginContainer").style.display = "none";
    document.getElementById("logoutBtn").style.display = "inline-block";
       // Hide login form if token now exists
    if (localStorage.getItem("auth")) {
      renderUsers(userinfo);
    }
 
   

    

  } catch (error) {
    alert("Login failed: " + error.message);
  }
});
document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("auth");
  if (token) {
    document.getElementById("loginContainer").style.display = "none";
    document.getElementById("logoutBtn").style.display = "inline-block";
    const eventId = 75;
    try {
      const result = await graphqlRequest(GET_USER_INFO, token, { eventId });
      const userinfo = result.data.user;
      renderUsers(userinfo);
    } catch (error) {
      console.error("Token invalid or expired. Logging out.");
      localStorage.removeItem("auth");
      document.getElementById("loginContainer").style.display = "block";
    }
  }
});
//logout

document.getElementById('logoutBtn').addEventListener('click', () => {
  // Remove the token
  localStorage.removeItem("auth");

  // Show the login form again
  document.getElementById("loginContainer").style.display = "block";

  // Hide the logout button
  document.getElementById("logoutBtn").style.display = "none";

  // Optionally clear user content
  const userContent = document.getElementsByClassName("userContainer");
  if (userContent) userContent.innerHTML = "";
});

// Takes user slices and dynamically renders to DOM
function renderUsers(userIntel) {
  const userContainer = document.createElement("div")
  userContainer.className = "userContainer"
  userContainer.innerHTML = ""
  const userItems = userIntel.map(user => 
    
    `
        <li>
      <h3>${user.attrs.email}</h3>
      <p>${user.attrs.gender}</p>
       <p>${user.auditRatio}</p>
    </li>
      `).join('')
  userContainer.innerHTML = userItems
  document.body.appendChild(userContainer);

}

function renderXP(xpList) {
  const xpContainer = document.createElement("div");
  xpContainer.className = "xpContainer";

  const xpItems = xpList.map(xp => `
      <li>
        <strong>User:</strong> ${xp.user.login} <br />
        <strong>XP:</strong> ${xp.amount}
      </li>
    `).join('');


  xpContainer.innerHTML = `<ul>${xpItems}</ul>`;
  document.body.appendChild(xpContainer);
}
