document.getElementById('loginBtn').addEventListener('click', async () => {
  const username = prompt("Enter your username:");
  const password = prompt("Enter your password:");
  const token = await getJWT(username, password);

  const eventId = 75; // or fetch dynamically if needed

  const result = await graphqlRequest(GET_USER_INFO, token, { eventId });
  const userInfo = result.data.user;
  // console.log(result.data.user[0].login);
  // console.log(result.data.xp); // if xp is part of your query

  renderUsers(userInfo);
});


// Takes user slices and dynamically renders to DOM
function renderUsers(userIntel) {
  const userContainer = document.createElement("div")
  userContainer.className = "userContainer"
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
