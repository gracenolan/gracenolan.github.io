
var width = 800,
    height = 500,
    root;

var force = d3.layout.force()
    .size([width, height])
    .on("tick", tick);

var svg = d3.select("div#example").append("svg")
    .attr("id", "graph")
    .attr("viewBox", "0 0 " + width + " " + height )
    .attr("preserveAspectRatio", "xMidYMid meet");
    // .attr("width", width)
    // .attr("height", height)

var link = svg.selectAll(".link"),
    node = svg.selectAll(".node").append("g"); 

    // I want to make the node object a group.
    // This will have a circle and icon

// function updateWindow(){
//     width = w.innerWidth || e.clientWidth || g.clientWidth;
//     height = w.innerHeight|| e.clientHeight|| g.clientHeight;
//
//     svg.attr("width", width).attr("height", height);
// }
// window.onresize = updateWindow;

d3.json("/flare.json", function(json) {
  root = json;
  update();
});

function update() {
  var nodes = flatten(root),
      links = d3.layout.tree().links(nodes);

  // Restart the force layout.
  force
      .nodes(nodes)
      .links(links)
      .linkDistance(150)
      .friction(0.4)
      .charge(-1500)
      .start();

  // Update the links…
  link = link.data(links, function(d) { return d.target.id; });

  // Exit any old links.
  link.exit().remove();

  // Enter any new links.
  link.enter().insert("line", ".node")
      .attr("class", "link")
      .attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

  // Update the nodes…
  node = node.data(nodes, function(d) { return d.id; }).style("fill", color);

  // Exit any old nodes.
  node.exit().remove();

  // Enter any new nodes.
  var nodeEnter = node.enter().append("g")
      .attr("class", "node")
      .on("mouseover", function(d) { d3.select(this).style("opacity", "0.9").select('.hover').style("visibility", "visible"); })
      .on("mouseout", function(d) {  d3.select(this).style("opacity", "1").select('.hover').style("visibility", "hidden"); })
      .on("click", click)
      .call(force.drag);
  
  nodeEnter.append("circle") // append icon instead?
      .attr("r", function(d) { return Math.sqrt(d.size) / 9 || 7; }) // 
            
  nodeEnter.append("text")
  .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('font-family', 'FontAwesome')
      .attr('font-size', function(d) { return Math.sqrt(d.size) / 8 || 6.5;})
      .text(function(d) { return d.icon})
      .style('fill', '#fff');
    //.attr("dy", ".35em"
    //.text(function(d) { return d.name; });

       nodeEnter.append("text")
      .attr('class','hover')
      .attr('baseline-shift','200%')
      .text(function(d) { return d.name})
      .style("visibility","hidden");
      
    
    node.select("circle")
        .style("fill", function(d) { return d.color; })

   
}

function tick() {
  link.attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

      node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
}

//UNUSED FUNCTION
// Color leaf nodes orange, and packages white or blue.
function color(d) {
  //return d._children ? "#3182bd" : d.children ? "#c6dbef" : "#fd8d3c";
}

// Toggle children on click.
function click(d) {
  if (!d3.event.defaultPrevented) {
      window.location.href = d.url;
  }
}

// Returns a list of all nodes under the root.
function flatten(root) {
  var nodes = [], i = 0;

  function recurse(node) {
    if (node.children) node.children.forEach(recurse);
    if (!node.id) node.id = ++i;
    nodes.push(node);
  }

  recurse(root);
  return nodes;
}


