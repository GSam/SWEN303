var w=960,h=500,
svg=d3.select("#chart")
.append("svg")
.attr("width",w)
.attr("height",h);
 
var text=svg
.append("text")
.text("hello world")
.attr("y",50);

var allGames = {};
var allTeams = {};
var allVenues = {};

var isNewZealand = {'Central Pulse':true, 'Queensland Firebirds':false, 'Northern Mystics':true, 'Waikato Bay of Plenty Magic':true, 'New South Wales Switfts':false, 'Canterbury Tactix':true, 'Melbourne Vixens':false, 'West Coast Fever':false, 'Adelaide Thunderbirds':false, 'Southern Steel':true}
var listTeams = ['Central Pulse', 'Queensland Firebirds', 'Northern Mystics', 'Waikato Bay of Plenty Magic', 'New South Wales Switfts', 'Canterbury Tactix', 'Melbourne Vixens', 'West Coast Fever', 'Adelaide Thunderbirds', 'Southern Steel']
var listYears = [2008, 2009, 2010, 2011, 2012];

function graph1() {

	var margin = {top: 20, right: 30, bottom: 30, left: 180},
	width = 960 - margin.left - margin.right,
	height = 500 - margin.top - margin.bottom;

	var barHeight = 20;

	var x = d3.scale.linear()
	.domain([0, 10])
	.range([0, width]);

	var y = d3.scale.ordinal()
	.domain(listTeams)
	.rangeRoundBands([0, height], .1);
	thiss = y;
	var yAxis = d3.svg.axis()
	.scale(y)
	.orient("left")
	.ticks(10, "%");

	var chart = d3.select("#chart").append('svg')
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom).append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var bar = chart.selectAll("g")
	.data([1,2,3,4,5,6,7,8])
	.enter().append("g")
	.attr("transform", function(d, i) { return "translate(10," + y(listTeams[i]) + ")"; });

	chart.append("g")
	.attr("class", "y axis")
	.call(yAxis)
	.append("text")
	.attr("transform", "rotate(-90)")
	.attr("y", 6)
	.attr("dy", ".71em")
	.style("text-anchor", "end");
	//.text("Frequency");

	bar.append("rect")
	.attr("width", function(d) {return x(d);})
	.attr("height", y.rangeBand());

	bar.append("text")
	.attr("x", function(d) { return x(d) - 3; })
	.attr("y", y.rangeBand() / 2)
	.attr("dy", ".35em")
	.text(function(d) { return d; });

}

function graph2() {
	// define dimensions of graph
	var m = [80, 80, 80, 80]; // margins
	var w = 800 - m[1] - m[3]; // width
	var h = 400 - m[0] - m[2]; // height

	// create a simple data array that we'll plot with a line (this array represents only the Y values, X will just be the index location)
	var data = [3, 6, 2, 7, 5, 2, 0, 3, 8, 9, 2, 5, 9, 3, 6, 3, 6, 2, 7, 5, 2, 1, 3, 8, 9, 2, 5, 9, 2, 7];

	// X scale will fit all values from data[] within pixels 0-w
	var x = d3.scale.linear().domain([0, data.length]).range([0, w]);
	// Y scale will fit values from 0-10 within pixels h-0 (Note the inverted domain for the y-scale: bigger is up!)
	var y = d3.scale.linear().domain([0, 10]).range([h, 0]);
	// automatically determining max range can work something like this
	// var y = d3.scale.linear().domain([0, d3.max(data)]).range([h, 0]);

	// create a line function that can convert data[] into x and y points
	var line = d3.svg.line()
	// assign the X function to plot our line as we wish
	.x(function(d,i) { 
		// verbose logging to show what's actually being done
		console.log('Plotting X value for data point: ' + d + ' using index: ' + i + ' to be at: ' + x(i) + ' using our xScale.');
		// return the X coordinate where we want to plot this datapoint
		return x(i); 
	})
	.y(function(d) { 
		// verbose logging to show what's actually being done
		console.log('Plotting Y value for data point: ' + d + ' to be at: ' + y(d) + " using our yScale.");
		// return the Y coordinate where we want to plot this datapoint
		return y(d); 
	})

	// Add an SVG element with the desired dimensions and margin.
	var graph = d3.select("#chart").append("svg:svg")
	.attr("width", w + m[1] + m[3])
	.attr("height", h + m[0] + m[2])
	.append("svg:g")
	.attr("transform", "translate(" + m[3] + "," + m[0] + ")");

	// create yAxis
	var xAxis = d3.svg.axis().scale(x).tickSize(-h).tickSubdivide(true);
	// Add the x-axis.
	graph.append("svg:g")
	.attr("class", "x axis")
	.attr("transform", "translate(0," + h + ")")
	.call(xAxis);


	// create left yAxis
	var yAxisLeft = d3.svg.axis().scale(y).ticks(4).orient("left");
	// Add the y-axis to the left
	graph.append("svg:g")
	.attr("class", "y axis")
	.attr("transform", "translate(-25,0)")
	.call(yAxisLeft);

	// Add the line by appending an svg:path element with the data line we created above
	// do this AFTER the axes above so that the line is above the tick-lines
	graph.append("svg:path").attr("d", line(data)).style("stroke","steelblue").style("stroke-width","1").style("fill", "none");


}

function graph3() {


	var w = 300,                        //width
	h = 300,                            //height
	r = 100,                            //radius
	color = d3.scale.category20c();     //builtin range of colors

	data = [{"label":"one", "value":20}, 
		{"label":"two", "value":50}, 
	{"label":"three", "value":30}];

	var vis = d3.select("body")
	.append("svg:svg")              //create the SVG element inside the <body>
	.data([data])                   //associate our data with the document
	.attr("width", w)           //set the width and height of our visualization (these will be attributes of the <svg> tag
		.attr("height", h)
		.append("svg:g")                //make a group to hold our pie chart
		.attr("transform", "translate(" + r + "," + r + ")")    //move the center of the pie chart from 0, 0 to radius, radius

		var arc = d3.svg.arc()              //this will create <path> elements for us using arc data
		.outerRadius(r);

		var pie = d3.layout.pie()           //this will create arc data for us given a list of values
		.value(function(d) { return d.value; });    //we must tell it out to access the value of each element in our data array

		var arcs = vis.selectAll("g.slice")     //this selects all <g> elements with class slice (there aren't any yet)
		.data(pie)                          //associate the generated pie data (an array of arcs, each having startAngle, endAngle and value properties) 
		.enter()                            //this will create <g> elements for every "extra" data element that should be associated with a selection. The result is creating a <g> for every object in the data array
		.append("svg:g")                //create a group to hold each slice (we will have a <path> and a <text> element associated with each slice)
		.attr("class", "slice");    //allow us to style things in the slices (like text)

		arcs.append("svg:path")
		.attr("fill", function(d, i) { return color(i); } ) //set the color for each slice to be chosen from the color function defined above
		.attr("d", arc).style("stroke", "#fff");                                    //this creates the actual SVG path using the associated data (pie) with the arc drawing function

		arcs.append("svg:text")                                     //add a label to each slice
		.attr("transform", function(d) {                    //set the label's origin to the center of the arc
			//we have to make sure to set these before calling arc.centroid
			d.innerRadius = 0;
			d.outerRadius = r;
			return "translate(" + arc.centroid(d) + ")";        //this gives us a pair of coordinates like [50, 50]
		})
		.attr("text-anchor", "middle")                          //center the text on it's origin
		.text(function(d, i) { return data[i].label; });        //get the label from our original data array

}

function graph4() {
	var data = [
		{ "name" : "Level 2: A", "parent":"Top Level" },
		{ "name" : "Top Level", "parent":"null" },
		{ "name" : "Son of A", "parent":"Level 2: A" },
		{ "name" : "Daughter of A", "parent":"Level 2: A" },
		{ "name" : "Level 2: B", "parent":"Top Level" }
	];

	// *********** Convert flat data into a nice tree ***************
	// create a name: node map
	var dataMap = data.reduce(function(map, node) {
		map[node.name] = node;
		return map;
	}, {});

	// create the tree array
	var treeData = [];
	data.forEach(function(node) {
		// add to parent
		var parent = dataMap[node.parent];
		if (parent) {
			// create child array if it doesn't exist
			(parent.children || (parent.children = []))
			// add node to child array
			.push(node);
		} else {
			// parent is null or missing
			treeData.push(node);
		}
	});

	// ************** Generate the tree diagram	 *****************
	var margin = {top: 20, right: 120, bottom: 20, left: 120},
	width = 960 - margin.right - margin.left,
	height = 500 - margin.top - margin.bottom;

	var i = 0;

	var tree = d3.layout.tree()
	.size([height, width]);

	var diagonal = d3.svg.diagonal()
	.projection(function(d) { return [d.y, d.x]; });

	var svg = d3.select("body").append("svg")
	.attr("width", width + margin.right + margin.left)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	root = treeData[0];

	update(root);

	function update(source) {

		// Compute the new tree layout.
		var nodes = tree.nodes(root).reverse(),
		links = tree.links(nodes);

		// Normalize for fixed-depth.
		nodes.forEach(function(d) { d.y = d.depth * 180; });

		// Declare the nodes…
		var node = svg.selectAll("g.node")
		.data(nodes, function(d) { return d.id || (d.id = ++i); });

		// Enter the nodes.
		var nodeEnter = node.enter().append("g")
		.attr("class", "node")
		.attr("transform", function(d) { 
			return "translate(" + d.y + "," + d.x + ")"; });

			nodeEnter.append("circle")
			.attr("r", 10)
			.style("fill", "#f0f");

			nodeEnter.append("text")
			.attr("x", function(d) { 
				return d.children || d._children ? -13 : 13; })
				.attr("dy", ".35em")
				.attr("text-anchor", function(d) { 
					return d.children || d._children ? "end" : "start"; })
					.text(function(d) { return d.name; })
					.style("fill-opacity", 1);

					// Declare the links…
					var link = svg.selectAll("path.link")
					.data(links, function(d) { return d.target.id; });

					// Enter the links.
					link.enter().insert("path", "g")
					.attr("class", "link")
					.attr("d", diagonal).style("fill", "none").style("stroke", "#ccc");

	}
}

d3.csv('2008-Table1.csv', function(e){
	console.log(e);
	/*for (var i = 0; i < e.length; i++) {
		console.log(e[i].Score);
		}*/
		allGames['2008'] = e;
		e.forEach(function(i) {
			var team = allTeams[i['Home Team']];
			if (team == undefined) {
				allTeams[i['Home Team']] = [i];
			} else {
				team.push(i);
			}

			var venue = allVenues[i['Venue']];
			if (venue == undefined) {
				allVenues[i['Venue']] = [i];
			} else {
				venue.push(i);
			}
		});
		d3.csv('2009-Table1.csv', function(e){
			allGames['2009'] = e;
			e.forEach(function(i) {
				var team = allTeams[i['Home Team']];
				if (team == undefined) {
					allTeams[i['Home Team']] = [i];
				} else {
					team.push(i);
				}

				var venue = allVenues[i['Venue']];
				if (venue == undefined) {
					allVenues[i['Venue']] = [i];
				} else {
					venue.push(i);
				}
			});
			d3.csv('2010-Table1.csv', function(e){
				allGames['2010'] = e;
				e.forEach(function(i) {
					var team = allTeams[i['Home Team']];
					if (team == undefined) {
						allTeams[i['Home Team']] = [i];
					} else {
						team.push(i);
					}

					var venue = allVenues[i['Venue']];
					if (venue == undefined) {
						allVenues[i['Venue']] = [i];
					} else {
						venue.push(i);
					}
				});
				d3.csv('2011-Table1.csv', function(e){
					allGames['2011'] = e;
					e.forEach(function(i) {
						var team = allTeams[i['Home Team']];
						if (team == undefined) {
							allTeams[i['Home Team']] = [i];
						} else {
							team.push(i);
						}

						var venue = allVenues[i['Venue']];
						if (venue == undefined) {
							allVenues[i['Venue']] = [i];
						} else {
							venue.push(i);
						}
					});
					d3.csv('2012-Table1.csv', function(e){
						allGames['2012'] = e;
						e.forEach(function(i) {
							var team = allTeams[i['Home Team']];
							if (team == undefined) {
								allTeams[i['Home Team']] = [i];
							} else {
								team.push(i);
							}

							var venue = allVenues[i['Venue']];
							if (venue == undefined) {
								allVenues[i['Venue']] = [i];
							} else {
								venue.push(i);
							}
					});
					console.log(allGames);
					console.log(allTeams);
					console.log(allVenues);

					// create graph 1
					graph4();

				});

			});

		});

	});
});
