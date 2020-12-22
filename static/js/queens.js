
// Define SVG area dimensions
var svgWidth = 900;
var svgHeight = 600;

// Define the chart's margins as an object
var margin = {
  top: 60,
  right: 60,
  bottom: 60,
  left: 60
};

// Define dimensions of the chart area
var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

// Select body, append SVG area to it, and set its dimensions
var svg = d3.select("#queens");

svg.append("path")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append a group area, then set its margins
var chartGroup3 = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Configure a parseTime function which will return a new Date object from a string
var parseTime = d3.timeParse("%m/%d/%Y");


// Load data from miles-walked-this-month.csv
d3.csv("../data/boroughs-case-hosp-death.csv").then(function(boroughData) {

  // Print the milesData
  console.log(boroughData);

  boroughData.forEach(function(d) {
    d.DATE_OF_INTEREST = parseTime(d.DATE_OF_INTEREST);
    d.QN_CASE_COUNT = +d.QN_CASE_COUNT;
});

  var xScale = d3.scaleTime()
    .range([0, chartWidth])
    .domain(d3.extent(boroughData, d => d.DATE_OF_INTEREST));

  var yScale = d3.scaleLinear()
    .range([chartHeight, 0])
    .domain([0, d3.max(boroughData, d => d.QN_CASE_COUNT)]);

  var bottomAxis = d3.axisBottom(xScale);
  var leftAxis = d3.axisLeft(yScale);

  var drawLine = d3
    .line()
    .x(d => xScale(d.DATE_OF_INTEREST))
    .y(d => yScale(d.QN_CASE_COUNT));

  chartGroup3.append("path")
    .attr("d", drawLine(boroughData))
    .classed("line", true);

  chartGroup3.append("g")
    .classed("axis", true)
    .call(leftAxis);

  chartGroup3.append("g")
    .classed("axis", true)
    .attr("transform", "translate(0, " + chartHeight + ")")
    .call(bottomAxis);

    //Create the tooltip in chartGroup.
    
    var circlesGroup = chartGroup3.selectAll("circle")
    .data(boroughData)
    .enter()
    .append("circle")
    .attr("cx", d => xScale(d.DATE_OF_INTEREST))
    .attr("cy", d => yScale(d.QN_CASE_COUNT))
    .attr("r", "10")
    .attr("fill", "gold")
    .attr("stroke-width", "1")
    .attr("stroke", "white")
    .style("opacity", "0");
  
  //Date formatter
  var dateFormatter = d3.timeFormat("%b-%d");
  
  //Initialize Tooltip
  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([20, 90])
    .html(function(d) {
      return (`<strong>Confirmed Cases:</strong> ${d.QN_CASE_COUNT}<hr>Date: ${dateFormatter(d.DATE_OF_INTEREST)}`);
      
    });
  
  //Create the tooltip in chartGroup.
  chartGroup3.call(toolTip);
  
  //Create "mouseover" event listener to display tooltip
  circlesGroup.on("mouseover", function(d) {
    toolTip.show(d, this);
  })
  
  //Create "mouseout" event listener to hide tooltip
    .on("mouseout", function(d) {
      toolTip.hide(d);
    });

  
}).catch(function(error) {
  console.log(error);
});

