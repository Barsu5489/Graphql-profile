import { createProjectResultsChart } from "./charts/projects.js";
import { createXPChart } from "./charts/xp.js";
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
    console.log(result.data.user[0].transactions)

    document.getElementById("loginContainer").style.display = "none";
    document.getElementById("profileContainer").style.display = "block"; 
    document.getElementById("logoutBtn").style.display = "inline-block";

       // Hide login form if token now exists
    if (localStorage.getItem("auth")) {
      console.log(result.data.user[0].transactions)
      console.log(result.data.user[0].transactions)
      console.log(userinfo[0])
      renderUserProfile(userinfo[0]);
    }
 
   

    

  } catch (error) {
    document.getElementById("error").textContent = "Invalid email or password. Please try again."


  }
});
document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("auth");
  if (token) {
    document.getElementById("loginContainer").style.display = "none";
    document.getElementById("profileContainer").style.display = "block";
    document.getElementById("logoutBtn").style.display = "inline-block";
    const eventId = 75;
    try {
      const result = await graphqlRequest(GET_USER_INFO, token, { eventId });
      if (result.data && result.data.user && result.data.user.length > 0) {
        renderUserProfile(result.data.user[0]); // Call new rendering function
      } else {
        throw new Error("No user data found");
      }
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
  document.getElementById("profileContainer").style.display = "none"; 

  // Optionally clear user content
  const userContainers = document.getElementsByClassName("userContainer");
  while (userContainers.length > 0) {
    userContainers[0].remove();
  }

});

// Takes user slices and dynamically renders to DOM
function renderUserProfile(userData) {
  document.getElementById("usernamehead").innerHTML =
  "Welcome" +
  "&nbsp;".repeat(3) +
  userData.attrs.firstName +
  "&nbsp;".repeat(3) +
  userData.attrs.lastName;
  console.log(userData)
  const filteredData = userData.transactions.filter(entry => {
    const date = new Date(entry.createdAt);
    const year = date.getFullYear();
    const month = date.getMonth(); // 0 = Jan, ..., 3 = April
  
    return (
      year > 2023 &&
      !(year === 2025 && month === 3) // Exclude April 2025
    );
  });
  // Display basic profile information
  document.getElementById('userLogin').textContent = userData.login;

  
  // Calculate total XP
  const totalXP = userData.transactions.reduce((sum, transaction) => {
    return transaction.type === "xp" ? sum + transaction.amount : sum;
  }, 0);

  document.getElementById('totalXP').textContent = Math.round(totalXP).toLocaleString() + " ";
  
  //Display audit ratio
  const auditRatio = parseFloat(userData.auditRatio).toFixed(2);
  document.getElementById('auditRatio').textContent = auditRatio;
  
  // Display latest project
  if (userData.progresses && userData.progresses.length > 0) {
    const latestProject = userData.progresses[0];
    const grade = latestProject.grade !== null ? latestProject.grade : "In progress";
    document.getElementById('latestProject').textContent = 
      `${latestProject.object.name} (${grade})`;
  } else {
    document.getElementById('latestProject').textContent = "No projects found";
  }
  
  // Create XP over time chart
  createXPChart(filteredData);
  
  //  Create Project Results chart
  createProjectResultsChart(userData.progresses);
}



