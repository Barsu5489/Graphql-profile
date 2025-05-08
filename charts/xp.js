export function createXPChart(transactions) {
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
      svg.innerHTML = '<text x="500" y="190" text-anchor="middle">No XP data available</text>';
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
    yLabel.setAttribute('x', -10);
    yLabel.setAttribute('y', margin.top + 60);
    yLabel.setAttribute('text-anchor', 'middle');
    yLabel.setAttribute('transform', `rotate(-90, 20, ${margin.top + 30})`);
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