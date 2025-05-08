export function createProjectResultsChart(progresses) {
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
    if (passed > 0 && failed === 0) {
  const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  circle.setAttribute('cx', centerX);
  circle.setAttribute('cy', centerY);
  circle.setAttribute('r', radius);
  circle.setAttribute('fill', '#27ae60');
  svg.appendChild(circle);

  // Add percentage text
  const percentText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  percentText.setAttribute('x', centerX);
  percentText.setAttribute('y', centerY + 5);
  percentText.setAttribute('text-anchor', 'middle');
  percentText.setAttribute('font-weight', 'bold');
  percentText.setAttribute('fill', '#fff');
  percentText.textContent = '100%';
  svg.appendChild(percentText);

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
      
 
  return; // Skip rest of pie logic
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