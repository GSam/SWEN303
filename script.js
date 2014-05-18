/*var w=960,h=500,
svg=d3.select("#chart")
.append("svg")
.attr("width",w)
.attr("height",h);
 
var text=svg
.append("text")
.text("hello world")
.attr("y",50);*/

var allGames = {};
var allTeams = {};
var allVenues = {};

var isNewZealand = {'Central Pulse':true, 'Queensland Firebirds':false, 'Northern Mystics':true, 'Waikato Bay of Plenty Magic':true, 'New South Wales Swifts':false, 'Canterbury Tactix':true, 'Melbourne Vixens':false, 'West Coast Fever':false, 'Adelaide Thunderbirds':false, 'Southern Steel':true}
var listTeams = ['Central Pulse', 'Queensland Firebirds', 'Northern Mystics', 'Waikato Bay of Plenty Magic', 'New South Wales Swifts', 'Canterbury Tactix', 'Melbourne Vixens', 'West Coast Fever', 'Adelaide Thunderbirds', 'Southern Steel']
var listYears = [2008, 2009, 2010, 2011, 2012, 2013];

var colors = ["Gold", "Silver", "#CD7F32", "SlateGrey"]

function TeamData (n) {
	this.wins = 0;
	this.losses = 0;
	this.draws = 0;
	this.name = n;
	this.points = 0;
}

function getAllTeamStats(tempYears) {
	// calculate wins-losses, draws, proportion win, and league points
	var data = [];
	for (var i = 0; i < listTeams.length; i++) {
		data.push(new TeamData(listTeams[i]));
	}
	/*
	for (var i = 0; i < listTeams.length; i++) {
		var temp = allTeams[listTeams[i]];
		for (var j = 0; j < listYears; j++) {
			var listG = temp[listYears[j]];
			listG.forEach(function(e) {
				if (listYears.indexOf(e.year) !== -1) {
					
				}
			});
		}
	}*/
	for (var i = 0; i < tempYears.length; i++) {
		var listG = allGames[tempYears[i]];
		listG.forEach(function(e) {
			if (e.Date.indexOf('BYES') === 0) return;

			var scoreHome = parseInt(e.Score.split('-')[0], 10);
			var scoreAway = parseInt(e.Score.split('-')[1], 10);

			if (scoreHome > scoreAway) {
				//console.log(e['Home Team']  + " " + e['Away Team']);
				//console.log(listTeams.indexOf(e['Home Team'])  + " " + listTeams.indexOf(e['Away Team']));
				data[listTeams.indexOf(e['Home Team'])].wins++;
				data[listTeams.indexOf(e['Home Team'])].points += 2;
				data[listTeams.indexOf(e['Away Team'])].losses++;
			} else if (scoreHome < scoreAway) {
				data[listTeams.indexOf(e['Away Team'])].wins++;
				data[listTeams.indexOf(e['Away Team'])].points += 2;
				data[listTeams.indexOf(e['Home Team'])].losses++;
			} else {
				// draw - only one such case
				console.log(e['Home Team']  + " " + e['Away Team']);
				console.log(listTeams.indexOf(e['Home Team'])  + " " + listTeams.indexOf(e['Away Team']));
				data[listTeams.indexOf(e['Home Team'])].draws++;
				data[listTeams.indexOf(e['Home Team'])].points++;
				data[listTeams.indexOf(e['Away Team'])].draws++;
				data[listTeams.indexOf(e['Away Team'])].points++;
			}
		});
	}
	console.log(data);
	return data;
}

function winCount(a, b) {
	return a.wins - b.wins;
}

function lossCount(a,b) {
	return a.losses - b.losses;
}

function pointCount(a,b) {
	return b.points - a.points;
}

function winRatio(a,b) {
	return b.wins/b.losses - a.wins/a.losses;
}

function graph1() {

	var margin = {top: 20, right: 30, bottom: 30, left: 180},
	width = 960 - margin.left - margin.right,
	height = 500 - margin.top - margin.bottom;

	var data1 = getAllTeamStats(listYears);
	data1.sort(winRatio);

	var data = data1.map(function(e) {return e.wins/e.losses;});
	console.log(data);
	console.log(data1);

	var x = d3.scale.linear()
	.domain([0, d3.max(data, function(e){return e;})])
	.range([0, width]);

	var y = d3.scale.ordinal()
	.domain(data1.map(function(e){return e.name;}))
	.rangeRoundBands([0, height], .1);
	thiss = y;

	var yAxis = d3.svg.axis()
	.scale(y)
	.orient("left")
	.ticks(10, "%");

	var chart = d3.select("#chart").append('svg:svg')
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom).append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var bar = chart.selectAll("g")
	.data(data)
	.enter().append("g")
	.attr("transform", function(d, i) { return "translate(10," + y(data1[i].name) + ")"; });

	chart.append("g")
	.attr("class", "y axis")
	.call(yAxis)
	.append("text")
	.attr("transform", "rotate(-90)")
	.attr("y", 6)
	.attr("dy", ".71em")
	.style("text-anchor", "end");
	//.text("Frequency");

	//var color = d3.scale.category10();
	bar.append("rect")
	.attr("width", function(d) {return x(d);})
	.attr("height", y.rangeBand());//.style('fill', function(d, i) {return color(i);});

	bar.append("text")
	.attr("x", function(d) { return x(d) - 3; })
	.attr("y", y.rangeBand() / 2)
	.attr("dy", ".35em")
	.text(function(d) { return Math.round(d*100)/100; });

	var radio = document.createElement('input');
	var radio1 = document.createElement('input');
	var radioGroup = document.createElement('form');
	radioGroup.appendChild(radio);
	radioGroup.appendChild(radio1);
	radio1.name = radio.name = 'test';
	radio.innerHTML = "Test1";
	radio1.innerHTML = "TEST2";
	radio.type = radio1.type = 'radio';
	document.querySelector('body').appendChild(radioGroup);

	d3.select('#sort_by').on('click', function(e) {
			
	
	});

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


	var w = 600,                        //width
	h = 600,                            //height
	r = 250,                            //radius
	color = d3.scale.category20c();     //builtin range of colors

	var data = [];
	/*data = [{"label":"one", "value":20}, {"label":"two", "value":50}, 		{"label":"three", "value":30}];*/

	for (var key in allVenues) {
		if (allVenues.hasOwnProperty(key)) {
			data.push({"label":key, "value": allVenues[key].length});	
		}
	}
	console.log(data);

	var vis = d3.select("#chart")
	.append("svg:svg")              //create the SVG element inside the <body>
	.data([data])                   //associate our data with the document
	.attr("width", w)           //set the width and height of our visualization (these will be attributes of the <svg> tag
		.attr("height", h)
		.append("svg:g")                //make a group to hold our pie chart
		.attr("transform", "translate(" + r + "," + r + ")")    //move the center of the pie chart from 0, 0 to radius, radius

		vis.append('svg:text').style('text-anchor', 'middle').attr('id', 'middletext');	

		var arc = d3.svg.arc()              //this will create <path> elements for us using arc data
		.outerRadius(r).innerRadius(r/2);

		var pie = d3.layout.pie()           //this will create arc data for us given a list of values
		.value(function(d) { return d.value; });    //we must tell it out to access the value of each element in our data array

		var arcs = vis.selectAll("g.slice")     //this selects all <g> elements with class slice (there aren't any yet)
		.data(pie)                          //associate the generated pie data (an array of arcs, each having startAngle, endAngle and value properties) 
		.enter()                            //this will create <g> elements for every "extra" data element that should be associated with a selection. The result is creating a <g> for every object in the data array
		.append("svg:g")                //create a group to hold each slice (we will have a <path> and a <text> element associated with each slice)
		.attr("class", "slice");    //allow us to style things in the slices (like text)

		arcs.append("svg:path")
		.attr("fill", function(d, i) { return color(i); } ) //set the color for each slice to be chosen from the color function defined above
		.attr("d", arc).style("stroke", "#fff")
		.on('mouseover', 
			function(e){
				console.log(e.data);
				d3.select('#middletext').text(JSON.stringify(e.data));
			})
			.on('click', display);;                                    //this creates the actual SVG path using the associated data (pie) with the arc drawing function

		arcs.append("svg:title")                                     //add a label to each slice
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

// Load all the csv files
// They are embedded one after another in callbacks because this is async code.
d3.csv('2008-Table1.csv', function(e){
	console.log(e);
	/*for (var i = 0; i < e.length; i++) {
		console.log(e[i].Score);
		}*/
		allGames['2008'] = e;
		e.forEach(function(i) {
			i.year = 2008;
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
				i.year = 2009;
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
					i.year = 2010;
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
						i.year = 2011;
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
							i.year = 2012;
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

						d3.csv('2013-Table1.csv', function(e) {
						
							allGames['2013'] = e;
							e.forEach(function(i) {
								i.year = 2013;
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
							
							delete allVenues[undefined];
							delete allVenues[''];

							console.log(allGames);
							console.log(allTeams);
							console.log(allVenues);

							// create graph 1
							graph1();
							graph1();
							d3.selectAll('svg').on('click', function(e){
								d3.selectAll('svg').remove();
								//switchTo('venue');
								forceDir();
							});

						});

					});

			});

		});

	});
});

function switchTo(mode) {
	// do some switching code
	if (mode === 'venue') {
		graph3();
	}
}

function rank(year) {
	var list = allGames[year];
	
	var e = list[list.length-1];
	//console.log(e);
	var ans = [];
	// finals
	var scoreHome = parseInt(e.Score.split('-')[0], 10);
	var scoreAway = parseInt(e.Score.split('-')[1], 10);
	if (scoreHome > scoreAway) {
		// home won
		ans.push(e['Home Team']);
		ans.push(e['Away Team']);
	} else {
		// away won 
		ans.push(e['Away Team']);
		ans.push(e['Home Team']);
	}

	// prelim-final - third place 
	e = list[list.length-2];
	//console.log(e);
	var scoreHome = parseInt(e.Score.split('-')[0], 10);
	var scoreAway = parseInt(e.Score.split('-')[1], 10);
	if (scoreHome > scoreAway) {
		// home won
		ans.push(e['Away Team']);
	} else {
		// away won 
		ans.push(e['Home Team']);
	}

	// minor semi-final - fourth place
	
	e = list[list.length-3];
	//console.log(e);
	var scoreHome = parseInt(e.Score.split('-')[0], 10);
	var scoreAway = parseInt(e.Score.split('-')[1], 10);
	if (scoreHome > scoreAway) {
		// home won
		ans.push(e['Away Team']);
	} else {
		// away won 
		ans.push(e['Home Team']);
	}

	return ans;
	
}

function display(e) {
	// calculate a ranking of the teams
	var home = "";
	var games = allVenues[e.data.label];
	console.log(teamRank(games));
	home = games[0]['Home Team'];
	console.log(home);
	teamRank(games).forEach(function(e) {
		var d = document.createElement('p');
		d.innerHTML = JSON.stringify(e);
		if (e.name === home) d.innerHTML += ' HOME';
		document.querySelector('body').appendChild(d);
	
	});

}

function teamRank(dat) {
	// calculate wins-losses, draws, proportion win, and league points
	var data = [];
	for (var i = 0; i < listTeams.length; i++) {
		data.push(new TeamData(listTeams[i]));
	}
	/*
	for (var i = 0; i < listTeams.length; i++) {
		var temp = allTeams[listTeams[i]];
		for (var j = 0; j < listYears; j++) {
			var listG = temp[listYears[j]];
			listG.forEach(function(e) {
				if (listYears.indexOf(e.year) !== -1) {
					
				}
			});
		}
	}*/
	dat.forEach(function(e) {
		if (e.Date.indexOf('BYES') === 0) return;

		var scoreHome = parseInt(e.Score.split('-')[0], 10);
		var scoreAway = parseInt(e.Score.split('-')[1], 10);

		if (scoreHome > scoreAway) {
			//console.log(e['Home Team']  + " " + e['Away Team']);
			//console.log(listTeams.indexOf(e['Home Team'])  + " " + listTeams.indexOf(e['Away Team']));
			data[listTeams.indexOf(e['Home Team'])].wins++;
			data[listTeams.indexOf(e['Home Team'])].points += 2;
			data[listTeams.indexOf(e['Away Team'])].losses++;
		} else if (scoreHome < scoreAway) {
			data[listTeams.indexOf(e['Away Team'])].wins++;
			data[listTeams.indexOf(e['Away Team'])].points += 2;
			data[listTeams.indexOf(e['Home Team'])].losses++;
		} else {
			// draw - only one such case
			//console.log(e['Home Team']  + " " + e['Away Team']);
			console.log(listTeams.indexOf(e['Home Team'])  + " " + listTeams.indexOf(e['Away Team']));
			data[listTeams.indexOf(e['Home Team'])].draws++;
			data[listTeams.indexOf(e['Home Team'])].points++;
			data[listTeams.indexOf(e['Away Team'])].draws++;
			data[listTeams.indexOf(e['Away Team'])].points++;
		}
	});

	return data;
}

function gameDiff(a,b) {
	if (a.Date.indexOf('BYES') === 0 || b.Date.indexOf('BYES') === 0) return;

	var scoreHome = parseInt(a.Score.split('-')[0], 10);
	var scoreAway = parseInt(a.Score.split('-')[1], 10);

	var scoreHome1 = parseInt(b.Score.split('-')[0], 10);
	var scoreAway1 = parseInt(b.Score.split('-')[1], 10);

	return Math.abs(scoreHome - scoreAway) - Math.abs(scoreHome1 - scoreAway1);
}

function closestGames(dat) {
	// calculate wins-losses, draws, proportion win, and league points
	dat.sort(gameDiff);
	return dat;
}

function rivalries(dat) {
	listTeams.sort();
	var rivalries = [];
	var dict = {};
	for (var i = 0; i < listTeams.length; i++) {
		for (var j = i + 1; j < listTeams.length; j++) {
			var name = listTeams[i] + ' - ' + listTeams[j];
			var d = new TeamData(name);
			rivalries.push(d);
			dict[name] = d;
		}
	}

	dat.forEach(function(e) {
		if (e.Date.indexOf('BYES') === 0) return;

		var n = [e['Home Team'], e['Away Team']]
		var s = n.sort().join(' - ');
	
		var data = dict[s];

		//home team first
		if (s.indexOf(e['Home Team']) === 0) {
			var scoreHome = parseInt(e.Score.split('-')[0], 10);
			var scoreAway = parseInt(e.Score.split('-')[1], 10);
		} else {
			var scoreHome = parseInt(e.Score.split('-')[1], 10);
			var scoreAway = parseInt(e.Score.split('-')[0], 10);
		}

		if (scoreHome > scoreAway) {
			data.wins++;
		} else if (scoreHome < scoreAway) {
			data.losses++;
		} else {
			data.draws++;
		}
		//data['ssss'] += scoreHome + " " + scoreAway;
	});

	rivalries.sort(rivalSort);
	//console.log(rivalries);
	return rivalries;
}

function rivalSort(a, b) {
	return Math.min((a.wins)/(a.wins+a.losses), (a.losses)/(a.wins+a.losses)) - Math.min((b.wins)/(b.wins+b.losses), (b.losses)/(b.wins+b.losses));
}

function forceDir() {
var width = 960,
    height = 500;

var color = d3.scale.category20();

var force = d3.layout.force()
    .charge(-1520)
    .linkDistance(50)
    .size([width, height]);

var svg = d3.select("#chart").append("svg")
    .attr("width", width)
    .attr("height", height);

	var c = [];
	listYears.forEach(function(e) {
		c = c.concat(allGames[e]);
	});

	var graph0 = rivalries(c);
	var graph1 = [];
	for (var i = 0; i < graph0.length; i++) {
		var e = graph0[i];	
	 	e.value = Math.min((e.wins)/(e.wins+e.losses), (e.losses)/(e.wins+e.losses));	
		if (e.value > 0.25) 
			graph1.push(e);
		e['source'] = listTeams.indexOf(e.name.split(' - ')[0]);
		e['target'] = listTeams.indexOf(e.name.split(' - ')[1]);
	
	}

	var graph = {};
	graph['nodes'] = listTeams.map(function(e){return {name:e}});
	graph['links'] = graph1;

//d3.json("miserables.json", function(error, graph) {
  force
      .nodes(graph.nodes)
      .links(graph.links)
      .start();

  var link = svg.selectAll(".link")
      .data(graph.links)
    .enter().append("line")
      .attr("class", "link")
      .style("stroke-width", function(d) { return Math.sqrt(d.value); })
	  .style("stroke","#999");

  var node = svg.selectAll(".node")
      .data(graph.nodes)
    .enter().append("circle")
      .attr("class", "node")
      .attr("r", 5)
      .style("fill", function(d) { return color(isNewZealand[d.name]); })
      .call(force.drag);

  node.append("title")
      .text(function(d) { return d.name; });

  force.on("tick", function() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
  });
	
/*  d3.select('body').on("keydown", function() {
var r = [10 / 2, -10 / 2, projection.rotate()[2]]; s = projection.rotate(r);console.log(projection.rotate(r)); 
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });

	force.start();
	
  });*/
}


