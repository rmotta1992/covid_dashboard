var width = parseInt(d3.select("#scatter").style("width"));

var height = width - width / 3.9;
var margin = 20;

var labelArea = 110;

var tPadBot = 40;
var tPadLeft = 40;

var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("class", "chart");

var circRadius = 10;


svg.append("g").attr("class", "xText");

var xText = d3.select(".xText");

function xTextRefresh() {
  xText.attr(
    "transform",
    "translate(" +
      ((width - labelArea) / 2 + labelArea) +
      ", " +
      (height - margin - tPadBot) +
      ")"
  );
}
xTextRefresh();

// 1. Deaths x
xText
  .append("text")
  .attr("y", -26)
  .attr("data-name", "Deaths")
  .attr("data-axis", "x")
  .attr("class", "aText active x")
  .text("Deaths");
// 2. hosps x
xText
  .append("text")
  .attr("y", 0)
  .attr("data-name", "Hospitalizaions")
  .attr("data-axis", "x")
  .attr("class", "aText inactive x")
  .text("Hospitalizaions");
// 3. Cases x
xText
  .append("text")
  .attr("y", 26)
  .attr("data-name", "Cases")
  .attr("data-axis", "x")
  .attr("class", "aText inactive x")
  .text("Cases");

// Y axis

var leftTextX = margin + tPadLeft;
var leftTextY = (height + labelArea) / 2 - labelArea;


svg.append("g").attr("class", "yText");


var yText = d3.select(".yText");


function yTextRefresh() {
  yText.attr(
    "transform",
    "translate(" + leftTextX + ", " + leftTextY + ")rotate(-90)"
  );
}
yTextRefresh();

// 1. Cases Y
yText
  .append("text")
  .attr("y", -26)
  .attr("data-name", "Cases")
  .attr("data-axis", "y")
  .attr("class", "aText active y")
  .text("Caes");

// 2. Hospital Y
yText
  .append("text")
  .attr("x", 0)
  .attr("data-name", "Hospitalizaions")
  .attr("data-axis", "y")
  .attr("class", "aText inactive y")
  .text("Hospitalizaions");

// 3. Deaths Y
yText
  .append("text")
  .attr("y", 26)
  .attr("data-name", "Deaths")
  .attr("data-axis", "y")
  .attr("class", "aText inactive y")
  .text("Deaths");



// Import CSV 
d3.csv("../data/correlation_data2.csv").then(function(correlationdata) {
  visualize(correlationdata);
  //console.log(correlationData);
});
    var i;
    for (i = correlationData.length -1; i>=0; i-= 1) {
      if (correlationData[i].Cases === 0 && correlationData[i].Deaths === 0) {
        correlationData.splice(i, 1);
      };
    }
    console.log(correlationData)


function visualize(theData) {
  
  var curX = "Deaths";
  var curY = "Cases";

  
  var xMin;
  var xMax;
  var yMin;
  var yMax;

  
  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.Boroughs}<br>Cases: ${d.Cases}<br>Hospitalized: ${d.Hospitalizaions}<br>Deaths: ${d.Deaths}`);
    });
  // Call the toolTip function.
  svg.call(toolTip);

  
  function xMinMax() {
    xMin = d3.min(theData, function(d) {
      return parseFloat(d[curX]) * 0.90;
    });

    xMax = d3.max(theData, function(d) {
      return parseFloat(d[curX]) * 1.10;
    });
  }

  function yMinMax() {
   yMin = d3.min(theData, function(d) {
      return parseFloat(d[curY]) * 0.90;
    });

    yMax = d3.max(theData, function(d) {
      return parseFloat(d[curY]) * 1.10;
    });
  }

  function labelChange(axis, clickedText) {
   d3
      .selectAll(".aText")
      .filter("." + axis)
      .filter(".active")
      .classed("active", false)
      .classed("inactive", true);


    clickedText.classed("inactive", false).classed("active", true);
  }

  
  xMinMax();
  yMinMax();

  
  var xScale = d3
    .scaleLinear()
    .domain([xMin, xMax])
    .range([margin + labelArea, width - margin]);
  var yScale = d3
    .scaleLinear()
    .domain([yMin, yMax])
    .range([height - margin - labelArea, margin]);

  
  var xAxis = d3.axisBottom(xScale);
  var yAxis = d3.axisLeft(yScale);

  
  function tickCount() {
    if (width <= 500) {
      xAxis.ticks(5);
      yAxis.ticks(5);
    }
    else {
      xAxis.ticks(10);
      yAxis.ticks(10);
    }
  }
  tickCount();

  
  svg
    .append("g")
    .call(xAxis)
    .attr("class", "xAxis")
    .attr("transform", "translate(0," + (height - margin - labelArea) + ")");
  svg
    .append("g")
    .call(yAxis)
    .attr("class", "yAxis")
    .attr("transform", "translate(" + (margin + labelArea) + ", 0)");

  
  var theCircles = svg.selectAll("g theCircles").data(theData).enter();

  
  theCircles
    .append("circle")
    .attr("cx", function(d) {
      return xScale(d[curX]);
    })
    .attr("cy", function(d) {
      return yScale(d[curY]);
    })
    .attr("r", circRadius)
    .attr("class", function(d) {
      return "boroughLabel " + d.Abbr;
    })
    
    .on("mouseover", function(d) {
      toolTip.show(d, this);
      d3.select(this).style("stroke", "#323232");
    })
    .on("mouseout", function(d) {
      toolTip.hide(d);
      d3.select(this).style("stroke", "#e3e3e3");
    });

  theCircles
    .append("text")
    .text(function(d) {
      return d.Abbr;
    })
    
    .attr("dx", function(d) {
      return xScale(d[curX]);
    })
    .attr("dy", function(d) {
     return yScale(d[curY]) + circRadius / 2.5;
    })
    .attr("font-size", circRadius)
    .attr("class", "boroughText")
    .on("mouseover", function(d) {
      toolTip.show(d);
      d3.select("." + d.Abbr).style("stroke", "#323232");
    })
    .on("mouseout", function(d) {
      toolTip.hide(d);
     d3.select("." + d.Abbr).style("stroke", "#e3e3e3");
    });

  
  d3.selectAll(".aText").on("click", function() {
    var self = d3.select(this);

    if (self.classed("inactive")) {
      var axis = self.attr("data-axis");
      var name = self.attr("data-name");

      if (axis === "x") {
        curX = name;

        xMinMax();

        xScale.domain([xMin, xMax]);

        svg.select(".xAxis").transition().duration(300).call(xAxis);

        d3.selectAll("circle").each(function() {
          d3
            .select(this)
            .transition()
            .attr("cx", function(d) {
              return xScale(d[curX]);
            })
            .duration(300);
        });

        d3.selectAll(".boroughText").each(function() {
          d3
            .select(this)
            .transition()
            .attr("dx", function(d) {
              return xScale(d[curX]);
            })
            .duration(300);
        });

        labelChange(axis, self);
      }
      else {
        curY = name;
        yMinMax();

       
        yScale.domain([yMin, yMax]);

        svg.select(".yAxis").transition().duration(300).call(yAxis);

        
        d3.selectAll("circle").each(function() {
          d3
            .select(this)
            .transition()
            .attr("cy", function(d) {
              return yScale(d[curY]);
            })
            .duration(300);
        });

        
        d3.selectAll(".boroughText").each(function() {
          
          d3
            .select(this)
            .transition()
            .attr("dy", function(d) {
              return yScale(d[curY]) + circRadius / 3;
            })
            .duration(300);
        });

        labelChange(axis, self);
      }
    }
  });

  d3.select(window).on("resize", resize);

  function resize() {
    width = parseInt(d3.select("#scatter").style("width"));
    height = width - width / 3.9;
    leftTextY = (height + labelArea) / 2 - labelArea;

    svg.attr("width", width).attr("height", height);

    
    xScale.range([margin + labelArea, width - margin]);
    yScale.range([height - margin - labelArea, margin]);

    svg
      .select(".xAxis")
      .call(xAxis)
      .attr("transform", "translate(0," + (height - margin - labelArea) + ")");

    svg.select(".yAxis").call(yAxis);

    tickCount();

    
    xTextRefresh();
    yTextRefresh();

    crGet();

    d3
      .selectAll("circle")
      .attr("cy", function(d) {
        return yScale(d[curY]);
      })
      .attr("cx", function(d) {
        return xScale(d[curX]);
      })
      .attr("r", function() {
        return circRadius;
      });

    d3
      .selectAll(".boroughText")
      .attr("dy", function(d) {
        return yScale(d[curY]) + circRadius / 3;
      })
      .attr("dx", function(d) {
        return xScale(d[curX]);
      })
      .attr("r", circRadius / 3);
  }
}
