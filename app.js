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
    alert("Login failed: " + error.message);
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
  console.log(filteredData);
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

function createXPChart(transactions) {
  const svg = document.getElementById('xpChart');
  
  // Clear previous chart
  svg.innerHTML = '';
  
  const width = 800;
  const height = 300;
  const margin = { top: 20, right: 30, bottom: 50, left: 60 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;
  
  // Process data for cumulative XP over time
  let cumulativeXP = 0;
  const dataPoints = transactions.map(t => {
    cumulativeXP += t.amount;
    return {
      date: new Date(t.createdAt),
      xp: cumulativeXP
    };
  });
  
  if (dataPoints.length === 0) {
    svg.innerHTML = '<text x="400" y="150" text-anchor="middle">No XP data available</text>';
    return;
  }
  
  // Define scales
  const xMin = dataPoints[0].date;
  const xMax = dataPoints[dataPoints.length - 1].date;
  const yMax = cumulativeXP;
  
  const xScale = (date) => {
    const range = xMax - xMin;
    return margin.left + ((date - xMin) / range) * chartWidth;
  };
  
  const yScale = (value) => {
    return height - margin.bottom - (value / yMax) * chartHeight;
  };
  
  // Create the line
  let pathData = `M ${xScale(dataPoints[0].date)} ${yScale(dataPoints[0].xp)}`;
  for (let i = 1; i < dataPoints.length; i++) {
    pathData += ` L ${xScale(dataPoints[i].date)} ${yScale(dataPoints[i].xp)}`;
  }
  
  // Create path
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', pathData);
  path.setAttribute('fill', 'none');
  path.setAttribute('stroke', '#3498db');
  path.setAttribute('stroke-width', '2');
  svg.appendChild(path);
  
  // Create axes
  // X-axis
  const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  xAxis.setAttribute('x1', margin.left);
  xAxis.setAttribute('y1', height - margin.bottom);
  xAxis.setAttribute('x2', width - margin.right);
  xAxis.setAttribute('y2', height - margin.bottom);
  xAxis.setAttribute('stroke', '#333');
  xAxis.setAttribute('stroke-width', '1');
  svg.appendChild(xAxis);
  
  // Y-axis
  const yAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  yAxis.setAttribute('x1', margin.left);
  yAxis.setAttribute('y1', margin.top);
  yAxis.setAttribute('x2', margin.left);
  yAxis.setAttribute('y2', height - margin.bottom);
  yAxis.setAttribute('stroke', '#333');
  yAxis.setAttribute('stroke-width', '1');
  svg.appendChild(yAxis);
  
  // Add X-axis labels
  const firstDate = new Date(xMin).toLocaleDateString();
  const lastDate = new Date(xMax).toLocaleDateString();
  
  const firstDateLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  firstDateLabel.setAttribute('x', margin.left);
  firstDateLabel.setAttribute('y', height - margin.bottom + 20);
  firstDateLabel.setAttribute('text-anchor', 'middle');
  firstDateLabel.textContent = firstDate;
  svg.appendChild(firstDateLabel);
  
  const lastDateLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  lastDateLabel.setAttribute('x', width - margin.right);
  lastDateLabel.setAttribute('y', height - margin.bottom + 20);
  lastDateLabel.setAttribute('text-anchor', 'middle');
  lastDateLabel.textContent = lastDate;
  svg.appendChild(lastDateLabel);
  
  // Add Y-axis labels
  const yLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  yLabel.setAttribute('x', 20);
  yLabel.setAttribute('y', margin.top + 10);
  yLabel.setAttribute('text-anchor', 'middle');
  yLabel.setAttribute('transform', `rotate(-90, 20, ${margin.top + 10})`);
  yLabel.textContent = "XP";
  svg.appendChild(yLabel);
  
  // Add Y-axis values
  const yValues = [0, Math.round(yMax / 2), Math.round(yMax)];
  yValues.forEach(value => {
    const yValueLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    yValueLabel.setAttribute('x', margin.left - 10);
    yValueLabel.setAttribute('y', yScale(value) + 5);
    yValueLabel.setAttribute('text-anchor', 'end');
    yValueLabel.textContent = Math.round(value).toLocaleString();
    svg.appendChild(yValueLabel);
    
    // Add grid line
    const gridLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    gridLine.setAttribute('x1', margin.left);
    gridLine.setAttribute('y1', yScale(value));
    gridLine.setAttribute('x2', width - margin.right);
    gridLine.setAttribute('y2', yScale(value));
    gridLine.setAttribute('stroke', '#eee');
    gridLine.setAttribute('stroke-width', '1');
    svg.appendChild(gridLine);
  });
  
  // Add title
  const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  title.setAttribute('x', width / 2);
  title.setAttribute('y', margin.top / 2);
  title.setAttribute('text-anchor', 'middle');
  title.setAttribute('font-weight', 'bold');
  title.textContent = "XP Progress Over Time";
  svg.appendChild(title);
}

function createProjectResultsChart(progresses) {
  const svg = document.getElementById('projectChart');
  
  // Clear previous chart
  svg.innerHTML = '';
  
  // Filter only projects with grades (not null)
  const projectsWithGrades = progresses.filter(p => p.grade !== null);
  
  if (projectsWithGrades.length === 0) {
    svg.innerHTML = '<text x="400" y="150" text-anchor="middle">No project data available</text>';
    return;
  }
  
  // Count pass/fail projects
  const passed = projectsWithGrades.filter(p => p.grade >= 1).length;
  const failed = projectsWithGrades.filter(p => p.grade < 1).length;
  
  if (passed === 0 && failed === 0) {
    svg.innerHTML = '<text x="400" y="150" text-anchor="middle">No graded projects found</text>';
    return;
  }
  
  // Create pie chart
  const centerX = 400;
  const centerY = 150;
  const radius = 100;
  
  // Calculate angles
  const total = passed + failed;
  const passedAngle = (passed / total) * 360;
  const failedAngle = (failed / total) * 360;
  
  // Create pass slice
  if (passed > 0) {
    const passedSlice = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const startAngle = 0;
    const endAngle = passedAngle;
    
    const startX = centerX + radius * Math.cos(startAngle * Math.PI / 180);
    const startY = centerY + radius * Math.sin(startAngle * Math.PI / 180);
    const endX = centerX + radius * Math.cos(endAngle * Math.PI / 180);
    const endY = centerY + radius * Math.sin(endAngle * Math.PI / 180);
    
    const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;
    
    const pathData = `
      M ${centerX} ${centerY}
      L ${startX} ${startY}
      A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}
      Z
    `;
    
    passedSlice.setAttribute('d', pathData);
    passedSlice.setAttribute('fill', '#27ae60');
    svg.appendChild(passedSlice);
  }
  
  // Create fail slice
  if (failed > 0) {
    const failedSlice = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const startAngle = passedAngle;
    const endAngle = 360;
    
    const startX = centerX + radius * Math.cos(startAngle * Math.PI / 180);
    const startY = centerY + radius * Math.sin(startAngle * Math.PI / 180);
    const endX = centerX + radius * Math.cos(endAngle * Math.PI / 180);
    const endY = centerY + radius * Math.sin(endAngle * Math.PI / 180);
    
    const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;
    
    const pathData = `
      M ${centerX} ${centerY}
      L ${startX} ${startY}
      A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}
      Z
    `;
    
    failedSlice.setAttribute('d', pathData);
    failedSlice.setAttribute('fill', '#e74c3c');
    svg.appendChild(failedSlice);
  }
  
  // Add legend
  const legendY = centerY + radius + 50;
  
  // Passed legend
  const passedRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  passedRect.setAttribute('x', centerX - 100);
  passedRect.setAttribute('y', legendY);
  passedRect.setAttribute('width', 20);
  passedRect.setAttribute('height', 20);
  passedRect.setAttribute('fill', '#27ae60');
  svg.appendChild(passedRect);
  
  const passedText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  passedText.setAttribute('x', centerX - 70);
  passedText.setAttribute('y', legendY + 15);
  passedText.textContent = `PASS (${passed})`;
  svg.appendChild(passedText);
  
  // Failed legend
  const failedRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  failedRect.setAttribute('x', centerX + 50);
  failedRect.setAttribute('y', legendY);
  failedRect.setAttribute('width', 20);
  failedRect.setAttribute('height', 20);
  failedRect.setAttribute('fill', '#e74c3c');
  svg.appendChild(failedRect);
  
  const failedText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  failedText.setAttribute('x', centerX + 80);
  failedText.setAttribute('y', legendY + 15);
  failedText.textContent = `FAIL (${failed})`;
  svg.appendChild(failedText);
  
  // Add title
  const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  title.setAttribute('x', centerX);
  title.setAttribute('y', 30);
  title.setAttribute('text-anchor', 'middle');
  title.setAttribute('font-weight', 'bold');
  title.textContent = "Project Results: PASS/FAIL Ratio";
  svg.appendChild(title);
  
  // Add percentages
  const passPercent = Math.round((passed / total) * 100);
  const failPercent = Math.round((failed / total) * 100);
  
  const passPercentText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  passPercentText.setAttribute('x', centerX);
  passPercentText.setAttribute('y', centerY - 10);
  passPercentText.setAttribute('text-anchor', 'middle');
  passPercentText.setAttribute('font-weight', 'bold');
  passPercentText.setAttribute('fill', '#fff');
  passPercentText.textContent = `${passPercent}%`;
  if (passPercent > 15) svg.appendChild(passPercentText);
  
  const failPercentText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  failPercentText.setAttribute('x', centerX);
  failPercentText.setAttribute('y', centerY + 30);
  failPercentText.setAttribute('text-anchor', 'middle');
  failPercentText.setAttribute('font-weight', 'bold');
  failPercentText.setAttribute('fill', '#fff');
  failPercentText.textContent = `${failPercent}%`;
  if (failPercent > 15) svg.appendChild(failPercentText);
}