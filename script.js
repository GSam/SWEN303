var allGames = {};
var allTeams = {};
var allVenues = {};

var showYear = 'All';
var showFinal = 'Both';
var sTeam = 'Melbourne Vixens';
var teamCol = "None";
var sVenue = "";

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
	this.homeWin = 0;
	this.homeLoss = 0;
	this.awayWin = 0;
	this.awayLoss = 0;
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
			//console.log(showFinal);
			//console.log(e.Round);
			if (['15','16','17'].indexOf(e.Round) !== -1 && showFinal === 'Regular') return;
			if (['15','16','17'].indexOf(e.Round) === -1 && showFinal === 'Finals') return;

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
	if (!isNumber(b.wins/(b.wins + b.losses))) {
		return -1;
	} else if (!isNumber(a.wins/(a.wins + a.losses))) {
		return 1;
	}
	return b.wins/(b.wins + b.losses) - a.wins/(a.wins + a.losses);
}

function graph1() {

	var margin = {top: 20, right: 30, bottom: 30, left: 180},
	width = 960 - margin.left - margin.right,
	height = 500 - margin.top - margin.bottom;

	var data1 = getAllTeamStats((showYear === 'All') ? listYears : [+showYear]);
	data1.sort(winRatio);

	var data = data1.map(function(e) {return e.wins/(e.wins + e.losses);});
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
	.orient("left");

	var chart = d3.select("#chart").append('svg:svg')
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom).append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var bs = chart.append('g').attr("transform", function(d, i) { return "translate(10,0)"; });

	var sss = chart.append("g")
	.attr("class", "y axis")
	.call(yAxis);

	sss.append("text")
	.attr("transform", "rotate(-90)")
	.attr("y", 6)
	.attr("dy", ".71em")
	.style("text-anchor", "end");
	//.text("Frequency");

	//var color = d3.scale.category10();
	bs.selectAll('rect').data(data).enter().append("rect").attr('class', 'bar')
	.attr("width", function(d) {if (!isNumber(d)) return 0; return x(d);})
	.attr("height", y.rangeBand()).style('fill', function(d, i) {return (teamCol === 'None' ? 'steel blue' : (isNewZealand[data1[i].name] ? 'PowderBlue':'Tomato'));})
	.attr('y', function(d, i) {return y(data1[i].name);});

	bs.selectAll('text').data(data).enter().append("text")
	.attr("x", function(d) {if (!isNumber(d)) return 10;  return Math.max(x(d) - 6, 5); })
	.attr("dy", ".35em")
	.attr('y', function(d, i) {return y(data1[i].name) + y.rangeBand()/2;})
	.text(function(d) { return Math.round(d*100)/100; });

	function update() {
		var data1 = getAllTeamStats((showYear === 'All') ? listYears : [+showYear]);
		data1.sort(winRatio);

		var data = data1.map(function(e) {return e.wins/(e.wins + e.losses);});
		console.log(data);
		console.log(data1);
	
		console.log( d3.max(data, function(e){return e;}));
		y.domain(data1.map(function(e){return e.name;}))
		var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left");
		sss.call(yAxis);
		
		var x = d3.scale.linear()
		.domain([0, d3.max(data, function(e){return e;})])
		.range([0, width]);console.log(width);

		bs.selectAll('rect').data(data)
		.attr("width", function(d) {if (!isNumber(d)) return 0; test = x;console.log(x(d) + " " + d);return x(d);})
		.attr("height", y.rangeBand()).style('fill', function(d, i) {return (teamCol === 'None' ? 'steelblue' : (isNewZealand[data1[i].name] ? 'PowderBlue':'Tomato'));})

		.attr('y', function(d, i) {return y(data1[i].name);});

		bs.selectAll('text').data(data)
		.attr("x", function(d) {if (!isNumber(d)) return 10;  return Math.max(x(d) - 6, 5); })
		.attr("dy", ".35em")
		.attr('y', function(d, i) {return y(data1[i].name) + y.rangeBand()/2;})
		.text(function(d) { return Math.round(d*100)/100; });
	}

	d3.selectAll('.picker').on('change', function(e){update();});

	/*var radio = document.createElement('input');
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
			
	
	});*/
	otherhalf();

}


function otherhalf() {

	// second half
	var margin = {top: 10, right: 20, bottom: 100, left: 140},
	margin2 = {top: 430, right: 20, bottom: 20, left: 140},
	width = 1280 - margin.left - margin.right,
	height = 500 - margin.top - margin.bottom,
	height2 = 500 - margin2.top - margin2.bottom;

	var parseDate = d3.time.format("%b %Y").parse;

	var x = d3.fisheye.scale(d3.time.scale).range([0, width]).distortion(0),
	x2 = d3.time.scale().range([0, width]),
	y = d3.scale.ordinal().rangeRoundBands([height, 0], .1),
	y2 = d3.scale.ordinal().range([height2, 0]);

	var xAxis = d3.svg.axis().scale(x).orient("bottom"),
	xAxis2 = d3.svg.axis().scale(x2).orient("bottom"),
	yAxis = d3.svg.axis().scale(y).orient("left").tickSize(-width);

	var brush = d3.svg.brush()
	.x(x2)
	.on("brush", brushed);

	var area = d3.svg.line()
	.interpolate("monotone")
	.x(function(d) { return x(d.date); })
	//.y0(height)
	.y(function(d) { return y(d.price) + y.rangeBand()/2; });

	var area2 = d3.svg.line()
	.interpolate("monotone")
	.x(function(d) { return x2(d.date); })
	//.y0(height2)
	.y(function(d) { return y2(d.price); });

	var svg = d3.select("#matchview").append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom);

	svg.append("defs").append("clipPath")
	.attr("id", "clip")
	.append("rect")
	.attr("width", width)
	.attr("height", height);

	var focus = svg.append("g")
	.attr("class", "focus")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var context = svg.append("g")
	.attr("class", "context")
	.attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");
var data = [type({"date": "Apr 2008", "price":"Central Pulse"}),type({"date": "Mar 2008", "price":"New South Wales Swifts"}),type({"date": "Aug 2013", "price":"Queensland Firebirds"}) ];
console.log(data);
		x.domain(d3.extent(data.map(function(d) { return d.date; })));
		y.domain(listTeams);
		x2.domain(x.domain());
		y2.domain(y.domain());
		thisss = y

		focus.append('g')	//	focus.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis);

		context.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height2 + ")")
		.call(xAxis2);

		context.append("g")
		.attr("class", "x brush")
		.call(brush)
		.selectAll("rect")
		.attr("y", -6)
		.attr("height", height2 + 7);

		focus.append("g")
		.attr("class", "y axis")
		.call(yAxis);

		var games = [];
		listYears.forEach(function(e) {
			games = games.concat(allGames[e]);
		});	

		games = games.map(function(e) {var dat = new Date(e.year+ " "+ e.Date); if (dat == undefined) return; return [{"date":dat, "price":e['Home Team']},{"date":dat, "price":e['Away Team']}];});
		games = games.filter(function(e) {return e[0].price !== "" && e[1].price !== "";});
		console.log(games);
		// paths
		var ctx = context.selectAll('.dots').data(games).enter();
		
		ctx.append("path")
		.attr("class", "area")
		.attr("d", area2).style('stroke', 'Blue').style('stroke-width', '2').style('fill', 'none');

		ctx = focus.append('g').attr("clip-path", "url(#clip)")
.selectAll('.dots').data(games).enter();

		var ss = ctx.append('path')
		.attr("class", "area")
		.attr("d", area).style('stroke', 'Blue').style('stroke-width', '2').style('fill', 'none');

	var show = false;

		ctx.append('circle').attr('class', 'fir')
		.attr('cx', function(d,i) {return x(d[0].date);})
		.attr('cy', function(d,i) {return y(d[0].price) + y.rangeBand()/2;})
		.attr('r', 5).style('opacity',  show ? 0.4 : 0);

		ctx.append('circle').attr('class', 'sec')
		.attr('cx', function(d,i) {return x(d[0].date);})
		.attr('cy', function(d,i) {;return y(d[1].price) + y.rangeBand()/2;})
		.attr('r', 5).style('opacity', show ? 0.4 : 0);

	var zoom = d3.behavior.zoom().scaleExtent([5,20])
    .on("zoom", function(){
		x.distortion(d3.event.scale-5).focus(width/2);
		focus.selectAll(".area").attr("d", area);
		focus.select(".x.axis").call(xAxis);
		focus.selectAll('circle.fir')
		.attr('cy', function(d,i) {return y(d[0].price) + y.rangeBand()/2;})
		.attr('cx', function(d,i) {return x(d[0].date);})
		focus.selectAll('circle.sec')
		.attr('cy', function(d,i) {return y(d[1].price) + y.rangeBand()/2;})
		.attr('cx', function(d,i) {return x(d[0].date);})
    
    });
	svg.on('click', function(e) {show = !show; svg.selectAll('circle').style('opacity', show ? 0.4 : 0);});

	svg.call(zoom);

	function brushed() {
		x.domain(brush.empty() ? x2.domain() : brush.extent());
		focus.selectAll(".area").attr("d", area);
		focus.select(".x.axis").call(xAxis);
		focus.selectAll('circle.fir')
		.attr('cy', function(d,i) {return y(d[0].price) + y.rangeBand()/2;})
		.attr('cx', function(d,i) {return x(d[0].date);})
		focus.selectAll('circle.sec')
		.attr('cy', function(d,i) {return y(d[1].price) + y.rangeBand()/2;})
		.attr('cx', function(d,i) {return x(d[0].date);})
	}

	function type(d) {
		d.date = parseDate(d.date);
		return d;
	}

}


function isNumber(n){
    return typeof n == 'number' && !isNaN(n - n);
}
function graph2() {
	// define dimensions of graph
	var m = [40, 40, 40, 40]; // margins
	var w = 500 - m[1] - m[3]; // width
	var h = 400 - m[0] - m[2]; // height

	var yearly = [];
	var NZhomeWin = [];
	var NZawayWin = [];
	var AUhomeWin = [];
	var AUawayWin = [];

	for(var i = 0; i < listYears.length; i++) {
		var NZ = new TeamData('NZ');
		var AU = new TeamData('AU');
		if (showFinal === 'Finals') {
			var tem = teamRank(allGames[listYears[i]].slice(-4));
		} else if (showFinal === 'Regular') {
			var tem = teamRank(allGames[listYears[i]].slice(0,-4));
		} else {
			var tem = teamRank(allGames[listYears[i]]);
		}  
		tem.forEach(function(e) {
			if (isNewZealand[e.name]) {
				NZ.homeWin += e.homeWin;
				NZ.awayWin += e.awayWin;
				NZ.homeLoss += e.homeLoss;
				NZ.awayLoss += e.awayLoss;
			} else {
				AU.homeWin += e.homeWin;
				AU.awayWin += e.awayWin;
				AU.homeLoss += e.homeLoss;
				AU.awayLoss += e.awayLoss;
			}
			e.year = listYears[i];
		});
		console.log(NZ);
		console.log(AU);
		NZhomeWin.push(NZ.homeWin / (NZ.homeWin + NZ.homeLoss));
		NZawayWin.push(NZ.awayWin / (NZ.awayWin + NZ.awayLoss));
		AUhomeWin.push(AU.homeWin / (AU.homeWin + AU.homeLoss));
		AUawayWin.push(AU.awayWin / (AU.awayWin + AU.awayLoss));

		yearly.push(tem);
	}
	console.log(NZhomeWin);
	console.log(NZawayWin);
	console.log(AUhomeWin);
	console.log(AUawayWin);
	console.log(yearly);
	// X scale will fit all values from data[] within pixels 0-w
	var x = d3.scale.ordinal().domain(listYears).rangeRoundBands([0, w], 0);
	// Y scale will fit values from 0-10 within pixels h-0 (Note the inverted domain for the y-scale: bigger is up!)
	var y = d3.scale.linear().domain([0, 1]).range([h, 0]);
	// automatically determining max range can work something like this
	// var y = d3.scale.linear().domain([0, d3.max(data)]).range([h, 0]);

	// create a line function that can convert data[] into x and y points
	var line = d3.svg.line()
	// assign the X function to plot our line as we wish
	.x(function(d,i) { 
		return x(i+2008); 
	})
	.y(function(d) { 
		return y(d); 
	})

	// Add an SVG element with the desired dimensions and margin.
	var graph = d3.select("#chart").append("svg:svg")
	.attr("width", w + m[1] + m[3])
	.attr("height", h + m[0] + m[2])
	.append("svg:g")
	.attr("transform", "translate(" + m[3] + "," + m[0] + ")");

	// create yAxis
	var xAxis = d3.svg.axis().scale(x).tickSize(-5);
	// Add the x-axis.
	graph.append("svg:g")
	.attr("class", "x axis")
	.attr("transform", "translate(" + -x.rangeBand()/2 +"," + (h+3) + ")")
	.call(xAxis);


	// create left yAxis
	var yAxisLeft = d3.svg.axis().scale(y).ticks(6).orient("left").tickSize(-w + x.rangeBand()/2).tickSubdivide(true);
	// Add the y-axis to the left
	graph.append("svg:g")
	.attr("class", "y axis")
	.attr("transform", "translate(0,0)")
	.call(yAxisLeft);
NZhomeWin = NZhomeWin.map(function(e) {if (!isNumber(e)) return -0.05; return e;} );
NZawayWin = NZawayWin.map(function(e) {if (!isNumber(e)) return -0.05; return e;} );
AUhomeWin =AUhomeWin.map(function(e) {if (!isNumber(e)) return -0.05; return e;} ); 
AUawayWin =AUawayWin.map(function(e) {if (!isNumber(e)) return -0.05; return e;} ); 
	// Add the line by appending an svg:path element with the data line we created above
	// do this AFTER the axes above so that the line is above the tick-lines
//	graph.append("svg:path").attr("d", line(data)).style("stroke","steelblue").style("stroke-width","1").style("fill", "none");
	graph.append("svg:path").attr("d", line(NZhomeWin)).style("stroke","Blue").style("stroke-width","2").style("fill", "none");
	graph.append("svg:path").attr("d", line(NZawayWin)).style("stroke","PowderBlue").style("stroke-width","2").style("fill", "none");
	graph.append("svg:path").attr("d", line(AUhomeWin)).style("stroke","Red").style("stroke-width","2").style("fill", "none");
	graph.append("svg:path").attr("d", line(AUawayWin)).style("stroke","LightSalmon").style("stroke-width","2").style("fill", "none");


  graph.append("text")
      .attr("transform", function(d) { return "translate(" + x(2013) + "," + (y(NZhomeWin[NZhomeWin.length-1]) - 4) + ")"; })
      .attr("x", 3)
      .attr("dy", ".35em")
	  .style('text-anchor', 'start')
      .text(function(d) { return "NZ home wins"; });
  graph.append("text")
      //.attr("transform", function(d) { return "translate("+ (!isNumber(y(NZawayWin[NZawayWin.length-1])) ? x(2012) : x(2013)) + "," + (!isNumber(y(NZawayWin[NZawayWin.length-1])) ? y(NZawayWin[NZawayWin.length-2]) - 10 :  y(NZawayWin[NZawayWin.length-1])) + ")"; })
	  .attr('transform', function(d) {return "translate(" + x(2013) + "," +(y(NZawayWin[AUawayWin.length-1]) + 4) + ")";}) 
      .attr("x", 3)
      .attr("dy", ".35em")
	  .style('text-anchor', 'start')
      .text(function(d) { return "NZ away wins"; });
  graph.append("text")
      .attr("transform", function(d) { return "translate(" + x(2013) + "," + (y(AUawayWin[AUawayWin.length-1]) + 4) + ")"; })
      .attr("x", 3)
      .attr("dy", ".35em")
	  .style('text-anchor', 'start')
      .text(function(d) { return "AUS away wins"; });
  graph.append("text")
      .attr("transform", function(d) { return "translate(" + x(2013) + "," + (y(AUhomeWin[AUhomeWin.length-1])) + ")"; })
      .attr("x", 3)
      .attr("dy", ".35em")
	  .style('text-anchor', 'start')
      .text(function(d) { return "AUS home wins"; });
	  
	  var tree = {"name":"teams", "children":[]};
	  for (var i = 0; i < listTeams.length; i++) {
		  var e = listTeams[i];
		  var t = [];
		  yearly.forEach(function(e, index) {
			  var s = e[i];
			  var x = ((s.homeWin / (s.homeWin + s.homeLoss) ) / (s.awayWin / (s.awayWin + s.awayLoss)));
			  var xx = (isNumber(x) ? x : 0.01)
			  if (!isNaN(x) && !isFinite(x)) {
				  console.log(listTeams[i] + " " + yearly[index]);
			  }
			  /*if (xx == 0.01) {
				  console.log(s.homeWin / (s.homeWin + s.homeLoss));
				  console.log(s.awayWin / (s.awayWin + s.awayLoss));
				  console.log(listTeams[i]);
				  }*/
				  t.push({"name": listTeams[i], "data": s, "size": xx});
		  });
		  tree.children.push({"name":e, "children":t});

	  }
	  console.log(tree);

	  var diameter = 480,
	  format = d3.format(",.2f"),
	  color = d3.scale.category20c();

	  var bubble = d3.layout.pack()
	  .sort(null)
	  .size([diameter, diameter])
	  .padding(1.5);

	  var svg = d3.select("#chart").append("svg")
	  .attr("width", diameter)
	  .attr("height", diameter)
	  .attr("class", "bubble");

	  svg.append('title').text('Ratio of Home Wins to Away Wins');

	  var node = svg.append('g').attr('class', 'node');

/*	  node.selectAll('title').data(bubble.nodes(classes(tree)).filter(function(d) { return !d.children; })).enter().append("title")
	  .text(function(d) { console.log((d.value <= 0.01 ? 'Insufficient data':format(d.value))); return d.className + " (" + d.data.year+ "): " + (d.value <= 0.01 ? 'Insufficient data':format(d.value))});*/

	  node.selectAll('circle').data(bubble.nodes(classes(tree)).filter(function(d) { return !d.children; })).enter().append("circle")
	  .attr("r", 0)
	  .style("fill", function(d) { return (teamCol === 'None' ? color(d.packageName) : (isNewZealand[d.packageName] ? 'PowderBlue':'Tomato'));}).on('mouseover', function(e){ console.log(e); }).on('click', function(e) {sTeam = e.packageName; switchTo('team');}).attr('transform', function(d){return 'translate(' +  d.x + "," + d.y + ")";}).append('svg:title').text(function(d) { console.log((d.value <= 0.01 ? 'Insufficient data':format(d.value))); return d.className + " (" + d.data.year+ "): " + (d.value <= 0.01 ? 'Insufficient data':format(d.value))});

	  node.selectAll('text').data(bubble.nodes(classes(tree)).filter(function(d) { return !d.children; })).enter().append("text")
	  .attr("dy", ".3em")
	  .style("text-anchor", "middle")
	  .style("font", "10px sans-serif").attr('transform', function(d){return 'translate(' +  d.x + "," + d.y + ")";})
	  .text(function(d) { return d.className.substring(0, d.r / 3); }).on('click', function(e) {sTeam = e.packageName; switchTo('team');}).style('cursor', 'default').append('svg:title').text(function(d) { console.log((d.value <= 0.01 ? 'Insufficient data':format(d.value))); return d.className + " (" + d.data.year+ "): " + (d.value <= 0.01 ? 'Insufficient data':format(d.value))});

	  // Returns a flattened hierarchy containing all leaf nodes under the root.
	  function classes(root) {
		  var classes = [];

		  function recurse(name, node) {
			  if (node.children) node.children.forEach(function(child) { recurse(node.name, child); });
			  else classes.push({packageName: name, className: node.name, value: node.size, data:node.data});
		  }

		  recurse(null, root);
		  return {children: classes};
	  }

	  d3.select(self.frameElement).style("height", diameter + "px");


	 function update1() {
		 svg.selectAll('circle').transition().delay(function(){return Math.random() * 300 + 100})
		 .attr("r", function(d){
			 if (showYear !== 'All' && d.data.year != showYear) return 0;
			 return d.r;}
		 );
	 }

	 function update2() {
		 var yearly = [];
		 var NZhomeWin = [];
		 var NZawayWin = [];
		 var AUhomeWin = [];
		 var AUawayWin = [];

		 for(var i = 0; i < listYears.length; i++) {
		 	 if (showFinal === 'Finals') {
				 var tem = teamRank(allGames[listYears[i]].slice(-4));
			 } else if (showFinal === 'Regular') {
				 var tem = teamRank(allGames[listYears[i]].slice(0,-4));
			 } else {
				 var tem = teamRank(allGames[listYears[i]]);
			 }  
			 tem.forEach(function(e) {
				 e.year = listYears[i];
			 });
			 yearly.push(tem);
		 }

		 var tree = {"name":"teams", "children":[]};
		 for (var i = 0; i < listTeams.length; i++) {
			 var e = listTeams[i];
			 var t = [];
			 yearly.forEach(function(e, index) {
				 var s = e[i];
				 var x = ((s.homeWin / (s.homeWin + s.homeLoss) ) / (s.awayWin / (s.awayWin + s.awayLoss)));
				 var xx = (isNumber(x) ? x : 0.01)
				 t.push({"name": listTeams[i], "data": s, "size": xx});
			 });
			 tree.children.push({"name":e, "children":t});

		 }
	  node.selectAll('circle').data(bubble.nodes(classes(tree)).filter(function(d) { return !d.children; }))
	  .attr("r", 0)
	  .style("fill", function(d) { return (teamCol === 'None' ? color(d.packageName) : (isNewZealand[d.packageName] ? 'PowderBlue':'Tomato'));}).on('mouseover', function(e){ console.log(e); }).on('click', function(e) {sTeam = e.packageName; switchTo('team');}).attr('transform', function(d){return 'translate(' +  d.x + "," + d.y + ")";}).append('svg:title').text(function(d) { console.log((d.value <= 0.01 ? 'Insufficient data':format(d.value))); return d.className + " (" + d.data.year+ "): " + (d.value <= 0.01 ? 'Insufficient data':format(d.value))});

	  node.selectAll('text').data(bubble.nodes(classes(tree)).filter(function(d) { return !d.children; }))
	  .attr("dy", ".3em")
	  .style("text-anchor", "middle")
	  .style("font", "10px sans-serif").attr('transform', function(d){return 'translate(' +  d.x + "," + d.y + ")";})
	  .text(function(d) { return d.className.substring(0, d.r / 3); }).on('click', function(e) {sTeam = e.packageName; switchTo('team');}).style('cursor', 'default').append('svg:title').text(function(d) { console.log((d.value <= 0.01 ? 'Insufficient data':format(d.value))); return d.className + " (" + d.data.year+ "): " + (d.value <= 0.01 ? 'Insufficient data':format(d.value))});
	 
	 	update1(); // make a better transition
	 }

	 function update3() {
		 node.selectAll('circle')//.style('stroke', function(e) { return (teamCol === 'None' ? 'none' : (isNewZealand[e.packageName] ? 'blue':'red'));});
 .style("fill", function(d) {  return (teamCol === 'None' ? color(d.packageName) : (isNewZealand[d.packageName] ? 'PowderBlue':'Tomato')) ; })
	 }

	 update1();

	 d3.selectAll('#selectYear').on('change', function(e){update1();});
	 d3.selectAll('#selectReg').on('change', function(e) {update2();});
	 d3.selectAll('#selectCol').on('change', function(e) {update3();});
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
			var temp = allVenues[key].filter(
				function(e) { 
					if (showFinal === 'Finals') return e.Round >= 15; if (showFinal === 'Regular') return e.Round < 15; return true;
				}
			);	

			temp = temp.filter(function(e) { if (showYear === 'All') return true; return e.year === +showYear;});
			data.push({"label":key, "value": temp.length}); 
		}
	}
	console.log(data);

	var vis = d3.select("#chart")
	.append("svg:svg")              //create the SVG element inside the <body>
	.data([data])                   //associate our data with the document
	.attr("width", w)           //set the width and height of our visualization (these will be attributes of the <svg> tag
		.attr("height", h)
		.append("svg:g")                //make a group to hold our pie chart
		.attr("transform", "translate(" + (r+20) + "," + (r+20) + ")")    //move the center of the pie chart from 0, 0 to radius, radius

		vis.append('svg:text').style('text-anchor', 'middle').attr('id', 'middletext');	
		vis.append('svg:text').style('text-anchor', 'middle').attr('id', 'middlevalue').attr('y', '1em').style('font', '24px sans-serif');

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
		.attr("fill", function(d, i) { if (teamCol ==='None') return color(i);return isNewZealand[allVenues[d.data.label][0]['Home Team']] ? "PowderBlue": "Tomato";} ) //set the color for each slice to be chosen from the color function defined above
		.attr("d", arc).style("stroke", "#fff")
		.on('mouseover', 
			function(e){
				console.log(e.data);
				d3.select('#middletext').text(e.data.label);
				d3.select('#middlevalue').text(e.data.value);
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

		function update () {
			switchTo('venue');	

			/*for (var key in allVenues) {
				if (allVenues.hasOwnProperty(key)) {
					var temp = allVenues[key].filter(
						function(e) { 
							if (showFinal === 'Finals') return e.Round >= 15; if (showFinal === 'Regular') return e.Round < 15; return true;
						}
					);	

					temp = temp.filter(function(e) { if (showYear === 'All') return true; return e.year === +showYear;});
					data.push({"label":key, "value": temp.length}); 
				}
			}
			console.log(data);
			vis.data([data]);
			pie.value(function(d){return d.value;});
			arcs.data(pie).attr("d", arc);*/
			}

		d3.selectAll('.picker').on('change', function(e){update();});

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

			team = allTeams[i['Away Team']];
			if (team == undefined) {
				allTeams[i['Away Team']] = [i];
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

				team = allTeams[i['Away Team']];
				if (team == undefined) {
					allTeams[i['Away Team']] = [i];
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

					team = allTeams[i['Away Team']];
					if (team == undefined) {
						allTeams[i['Away Team']] = [i];
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

						team = allTeams[i['Away Team']];
						if (team == undefined) {
							allTeams[i['Away Team']] = [i];
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

							team = allTeams[i['Away Team']];
							if (team == undefined) {
								allTeams[i['Away Team']] = [i];
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

								team = allTeams[i['Away Team']];
								if (team == undefined) {
									allTeams[i['Away Team']] = [i];
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
							var div = d3.select('.horizontal').append('div');

							var select = div.append('select').attr('id', 'selectYear').attr('class', 'picker');

							select.node().addEventListener('change', function(e) {showYear = this.value;});

							select.selectAll('option')
							.data(['All'].concat(listYears))
							.enter().append('option')
							.attr('value', function(d) {return d;})
							.text(function(d) {return d;});


							select = div.append('select').attr('id', 'selectReg').attr('class', 'picker');

							select.node().addEventListener('change', function(e) {showFinal = this.value;});

							select.selectAll('option')
							.data(['Both', 'Regular', 'Finals'])
							.enter().append('option')
							.attr('value', function(d) {return d;})
							.text(function(d) {return d;});

							select = div.append('select').attr('id', 'selectCol').attr('class', 'picker');

							select.node().addEventListener('change', function(e) {teamCol = this.value;});

							select.selectAll('option')
							.data(['None','Distinguish Country'])
							.enter().append('option')
							.attr('value', function(d) {return d;})
							.text(function(d) {return d;});


							// create graph 1
							graph1();
							//graph1();
							/*d3.selectAll('svg').on('click', function(e){
								d3.selectAll('svg').remove();
								//switchTo('venue');
								//switchTo('team');
								//forceDir();
								graph2();
							});*/

						});

					});

			});

		});

	});
});

function switchTo(mode) {
	// do some switching code
	d3.selectAll('svg').remove();
	if (mode === 'venue') {
		graph3();
	} else if (mode === 'team') {
		graph6();
		graph5('Central Pulse');
	} else if (mode === 'home') {
		graph2();	
	} else if (mode === 'rival') {
		forceDir();	
	} else if (mode === 'overall') {
		graph1();	
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

			data[listTeams.indexOf(e['Home Team'])].homeWin++;
			data[listTeams.indexOf(e['Away Team'])].awayLoss++;
		} else if (scoreHome < scoreAway) {
			data[listTeams.indexOf(e['Away Team'])].wins++;
			data[listTeams.indexOf(e['Away Team'])].points += 2;
			data[listTeams.indexOf(e['Home Team'])].losses++;

			data[listTeams.indexOf(e['Away Team'])].awayWin++;
			data[listTeams.indexOf(e['Home Team'])].homeLoss++;
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
	return rivalries;
}

function rivalSort(a, b) {
	return Math.min((a.wins)/(a.wins+a.losses), (a.losses)/(a.wins+a.losses)) - Math.min((b.wins)/(b.wins+b.losses), (b.losses)/(b.wins+b.losses));
}

var percent = 0.25;

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
		if (e.value > percent) 
			graph1.push(e);
		e['source'] = listTeams.indexOf(e.name.split(' - ')[0]);
		e['target'] = listTeams.indexOf(e.name.split(' - ')[1]);

	}

	/*	svg.append('svg:rect')
	.attr('x', 10)
	.attr('y', 20)
	.attr('width', 30)
	.attr('height', 20)
	.style('fill', color(true))
	.append('svg:text')
	.attr('x', 40)
	.text('New Zealand');

	svg.append('svg:rect')
	.attr('x', 10)
	.attr('y', 50)
	.attr('width', 30)
	.attr('height', 20)
	.style('fill', color(false));

	svg.append('svg:text')
	.attr('x', 60)
	.attr('y', 35)
	.style('text-anchor', 'start')
	.text('New Zealand');

	svg.append('svg:text')
	.attr('x', 60)
	.attr('y', 65)
	.style('text-anchor', 'start')
	.text('Australia'); */
	
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

	var start = null;
	var end = null;
	var oldEnd = null;

  var node = svg.selectAll(".force-node")
      .data(graph.nodes)
    .enter().append("circle")
      .attr("class", "force-node")
      .attr("r", 7)
      .style("fill", function(d) { return (isNewZealand[d.name]) ? 'SteelBlue': 'LightSalmon'; })
      .call(force.drag)
	  .on('click', function(d) {
		var c = d3.select(this);
		if (start === null) {
			start = d.name;
			c.classed({'selected':true});
			return;
		}

		if (d.name === start) {
			start = null;
			c.classed({'selected':false});
			if (oldEnd !== null) oldEnd.classed({'selected':false});
			return;
		}

		if (d.name === end) {
			end = null;
			c.classed({'selected':false});
			return;
		}

		if (oldEnd !== null) {
			console.log(oldEnd);
			oldEnd.classed({'selected':false});
		}

		end = d.name;
		oldEnd = c;
		c.classed({'selected':true});

		
		console.log(start + " - " + end);
	  
	  });
  node.append("title")
      .text(function(d) { return d.name; });



	var y = d3.scale.ordinal()
	.domain(graph1.map(function(e){return e.name;}).slice(0,10))
	.rangeRoundBands([height/2, height], .1);

	var x = d3.scale.ordinal()
	.domain(graph1.map(function(e){return e.name;}).slice(0,10))
	.rangeRoundBands([20, 100]);

	svg.selectAll('.rivalBars')
	.data(graph1.slice(0,10))
	.enter().append('svg:line')
	.attr('x1', 0)
	.attr('y1', function(d) {return y(d.name);})
	.attr('x2', function(d) {return x(d.name);})
	.attr('y2', function(d) {return y(d.name);}).style('stroke', 'black');

	var zoom = 1;
	function zoomed(ddd) {
		if (d3.event.scale > zoom) {
			console.log("IN");
		} else if (d3.event.scale < zoom) {
			console.log("OUT");	
		}
		var isZooming = d3.event.scale > zoom;
		if (zoom === d3.event.scale) return;
		zoom = d3.event.scale;
		console.log("scale  " + d3.event.scale);
		percent = Math.max(0, Math.min(0.53, percent + (isZooming ? 0.02 : -0.02)));
		if (percent === 0 || percent === 0.53) return;
		force.stop();
		force.gravity( (percent <= 0.25 ? 0.1 : force.gravity() + 0.05));
		graph1 = [];
		console.log(percent);
		for (var i = 0; i < graph0.length; i++) {
			var e = graph0[i];
			if (e.value > percent) 
				graph1.push(e);
		}
		console.log(graph1.length);
		link = svg.selectAll(".link")
		.data(graph1);
		link.enter().append("line")
		.attr("class", "link")
		.style("stroke-width", function(d) { return 1; })
		.style("stroke","#999");

		svg.selectAll(".link")
		.data(graph1).exit().remove();

		// make sure nodes are on top
		svg.selectAll('.link,.force-node').sort(function(a,b) {return a.source === undefined;});
	
		force.links(graph1);
		force.start();
	}

	var zoom = d3.behavior.zoom()
    .on("zoom", zoomed);


  force.on("tick", function() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
  });
	svg.call(zoom);
		svg.on('drag', function(){});
svg.on('dblclick.zoom', null);

	
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

function readd(a) {
	d3.select('#chart').append(function(){return a.node();})
}

function graph5(a) {
	var w = 200,                        //width
	h = 500,                            //height
	r = 250,                            //radius
	color = d3.scale.category20c();     //builtin range of colors

	var data = [];
	/*data = [{"label":"one", "value":20}, {"label":"two", "value":50}, 		{"label":"three", "value":30}];*/

	var teamGames = allTeams[a];
	
	var dict = {};
	teamGames.forEach(function(e) {
		var venue = dict[e.Venue];
		if (venue == undefined) {
			venue = [e];
			dict[e.Venue] = venue;
		} else {
			venue.push(e);
		}
	});
	console.log(dict);

	for (var key in dict) {
		if (allVenues.hasOwnProperty(key)) {
			var t =teamRank(dict[key]).filter(function(e){return a == e.name;})[0];
			t.venue = key;
			data.push(t);
		}
	}

	console.log(data);

	data.sort(function(a,b) {
		var x = b.wins / (b.wins + b.losses) - a.wins / (a.wins + a.losses);
		if (b.wins === 0 && a.wins === 0) {
			return a.losses - b.losses;
		}
		return x;
	});

console.log(data.slice(0,5));
console.log(data.slice(-5).reverse());

var vis = d3.select('#chart')
	.append('svg:svg')
	.attr("width", w)
	.attr('height', h).append('svg:g');

	vis.append('text').text('Best 5 Venues').attr('x', 0).attr('y',45).style('text-anchor', 'start');
	var bars = vis.selectAll('.winbars')
		.data(data.slice(0,5))
		.enter()
	var b = bars.append('svg:rect')
		.attr('x', 0)
		.attr('y', function(d,i) {return 30 * i + 50;})
		.attr('height', 20)
		.attr('width',0).style('fill','green').style('opacity', function(d) { return d.homeWin !== 0 || d.homeLoss !== 0 ? "1": "0.5";});
	b.transition()
	.delay(200)
		.attr('width', function(d) {return 150 * (d.wins / (d.wins + d.losses));});

	var b = bars.append('svg:rect')
		.attr('x', 150)
		.attr('y', function(d,i) {return 30 * i + 50;})
		.attr('height', 20)
		.attr('width',0).style('fill','red').style('opacity', function(d) { return d.homeWin !== 0 || d.homeLoss !== 0 ? "1": "0.5";});
	b.transition()
	.delay(200)
		.attr('width', function(d) {return 150 * (d.losses / (d.wins + d.losses));})
		.attr('x', function(d) {return 150 * (d.wins / (d.wins + d.losses));});



var vis = d3.select('#chart')
	.append('svg:svg')
	.attr("width", w)
	.attr('height', h).append('svg:g');

	vis.append('text').text('Worst 5 Venues').attr('x', 0).attr('y',45).style('text-anchor', 'start');
	var bars = vis.selectAll('.winbars')
		.data(data.slice(-5).reverse())
		.enter()
	var b = bars.append('svg:rect')
		.attr('x', 0)
		.attr('y', function(d,i) {return 30 * i + 50;})
		.attr('height', 20)
		.attr('width',0).style('fill','green').style('opacity', function(d) { return d.homeWin !== 0 || d.homeLoss !== 0 ? "1": "0.5";});
	b.transition()
	.delay(200)
		.attr('width', function(d) {return 150 * (d.wins / (d.wins + d.losses));});

	var b = bars.append('svg:rect')
		.attr('x', 150)
		.attr('y', function(d,i) {return 30 * i + 50;})
		.attr('height', 20)
		.attr('width',0).style('fill','red').style('opacity', function(d) { return d.homeWin !== 0 || d.homeLoss !== 0 ? "1": "0.5";});
	b.transition()
	.delay(200)
		.attr('width', function(d) {return 150 * (d.losses / (d.wins + d.losses));})
		.attr('x', function(d) {return 150 * (d.wins / (d.wins + d.losses));});

var vis = d3.select('#chart')
	.append('svg:svg')
	.attr("width", w)
	.attr('height', h).append('svg:g');

	vis.append('text').text('Home Venues').attr('x', 0).attr('y',45).style('text-anchor', 'start');
	var bars = vis.selectAll('.winbars')
		.data(data.filter(function(e) {return e.homeWin !== 0 || e.homeLoss !== 0;}))
		.enter()
	var b = bars.append('svg:rect')
		.attr('x', 0)
		.attr('y', function(d,i) {return 30 * i + 50;})
		.attr('height', 20)
		.attr('width',0).style('fill','green');
	b.transition()
	.delay(200)
		.attr('width', function(d) {return 150 * (d.wins / (d.wins + d.losses));});

	var b = bars.append('svg:rect')
		.attr('x', 150)
		.attr('y', function(d,i) {return 30 * i + 50;})
		.attr('height', 20)
		.attr('width',0).style('fill','red');
	b.transition()
	.delay(200)
		.attr('width', function(d) {return 150 * (d.losses / (d.wins + d.losses));})
		.attr('x', function(d) {return 150 * (d.wins / (d.wins + d.losses));});

		//.ease('elastic')

/*listYears.forEach(function(e){
	var data = 
	var vis = d3.select("#chart")
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
		.attr("d", arc).style("stroke", "#fff");
		});*/

}

var sYear = 2008;

function graph6() {
	// define dimensions of graph
	var m = [40, 40, 60, 40]; // margins
	var w = 900 - m[1] - m[3]; // width
	var h = 500 - m[0] - m[2]; // height

	var color = d3.scale.category20();

	// X scale will fit all values from data[] within pixels 0-w
	var x = d3.scale.linear().domain([1,17]).range([0, w]);
	// Y scale will fit values from 0-10 within pixels h-0 (Note the inverted domain for the y-scale: bigger is up!)
	var y = d3.scale.linear().domain([10, 1]).range([h, 0]);
	// automatically determining max range can work something like this
	// var y = d3.scale.linear().domain([0, d3.max(data)]).range([h, 0]);

	// create a line function that can convert data[] into x and y points
	var line = d3.svg.line()
	// assign the X function to plot our line as we wish
	.x(function(d,i) { 
		return x(i+1); 
	})
	.y(function(d) { 
		return y(d); 
	})

	// Add an SVG element with the desired dimensions and margin.
	var graph = d3.select("#chart").append("svg:svg")
	.attr("width", w + m[1] + m[3])
	.attr("height", h + m[0] + m[2])
	.append("svg:g")
	.attr("transform", "translate(" + m[3] + "," + m[0] + ")");

	// create yAxis
	var xAxis = d3.svg.axis().scale(x).ticks(17).tickSize(-15);
	// Add the x-axis.
	graph.append("svg:g").append("svg:g").attr('class', 'focus').append('svg:g')
	.attr("class", "x axis")
	.attr("transform", "translate(" + 0 +"," + (h + 15) + ")")
	.call(xAxis).append("text")
    .attr("transform", "translate("+ w/2 + ")")
    .attr("y", 25)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Round").style('font-weight', 'bold');

	graph.append('rect').attr('x', x(14.5)).attr('y',0)
	.attr('width', 2.5*w/16).attr('height', h)
	.style('fill', 'yellow').style('opacity', '0.5')
	.on('mouseover', function(e) {var s = d3.select(this); s.style('fill', 'gold');} )
	.on('mouseout', function(e) {var s = d3.select(this); s.style('fill', 'yellow'); /*graph.selectAll('.temp').remove();*/});
	graph.append('svg:g').append('svg:text').attr('class','temp').text('FINALS').style('font-weight', 'bold').attr('x',x(16.0)).attr('y', y(9.5));

	// create left yAxis
	var yAxisLeft = d3.svg.axis().scale(y).orient("left").tickSize(-w).tickSubdivide(true);
	// Add the y-axis to the left
	var context = graph.append("svg:g").attr('class', 'focus').append('svg:g')
	.attr("class", "y axis")
	.attr("transform", "translate(0,0)")
	.call(yAxisLeft)
	.append("text")
    .attr("transform", "rotate(-90)")
	.attr('y', -30)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Rank").style('font-weight', 'bold');

	function update() {
		// tabulate round data
		var yearGames = allGames[sYear];
		console.log(sYear);
		var index = 0;
		var games = [];
		var data = [];
		for (var i = 1; i < 15; i++) {
			// while you haven't got to the next round yet
			while (yearGames[index].Round <= i) {
				games.push(yearGames[index]);
				index++;
			}
			//console.log(i);
			//console.log(index);
			data.push(teamRank(games).sort(function(a,b){ return b.points - a.points;}));
		}
		console.log(data);

		var rData = data.map(function(e) { 
			for (var i = 0; i < e.length; i++) {
				if (e[i].name === sTeam) {
					return i+1;
				}
			}
		});
		var r = rank(sYear).indexOf(sTeam) + 1;
		console.log(r);
		if (r !== -1) {
			// if they ranked
			var rr = rData[rData.length - 1];
			if (rr <= 2) {
				if (r === 3) {rData.push(2); rData.push(3);} else {
				var rrr = yearGames[index];
				var sss = teamRank([rrr]).filter(function(e) {return e.name === sTeam;})[0];
				if (sss.points > 0) {
					rData.push(1);
					rData.push(1);
				} else {
					rData.push(2);
					rData.push(2);
				}
				rData.push(r);
				}
			} else {
				if (r === 4) {rData.push(4);}
				if (r === 3) {rData.push(3); rData.push(3);}
				if (r === 2) {rData.push(3); rData.push(2); rData.push(2);}
				if (r === 1) {rData.push(3); rData.push(2); rData.push(1);}
			}
		}	
		console.log(rData);
		var ctx = graph.selectAll('.dots').data([rData]);

		ctx.enter().append('g').attr('class', 'line');

		ctx.selectAll('path').data(function(d) {return [d];}).enter().append("path")
		.attr("class", "area")
		//.attr("d", line)
		.style('stroke', function(d) {return color(sTeam + "" + sYear);}).style('stroke-width', '2').style('fill', 'none')
  .transition()
    .duration(2000)
    .attrTween('d', function(data) {
			var interpolate = d3.scale.quantile()
			.domain([0,1])
			.range(d3.range(1, 18));
			return function(t) {
				return line(data.slice(0, interpolate(t)));
			};
		});

		ctx.on('contextmenu', function(data, index) {console.log(this);d3.event.preventDefault();d3.select(this).remove();});

		var circ = ctx.selectAll('circle').data(rData)
		.enter().append('circle').transition().delay(200)
		.attr('cx', function (d, i) { return x(i+1); })
		.attr('cy', function (d) { return y(d); })
		.attr('r', 3);
		console.log(rData);
	}

	update();

	var select = d3.select('#chart').append('div').append('select').on('change', function(e){sTeam = this.value;});

	select.selectAll('option')
	.data(listTeams).enter()
	.append('option')
	.attr('value', function(e){ 
		return e;})
		.text(function(d){return d;});

	var select = d3.select('#chart').append('div').append('select').on('change', function(e){sYear = this.value;});

	select.selectAll('option')
	.data(listYears).enter()
	.append('option')
	.attr('value', function(e){ 
		return e;})
		.text(function(d){return d;});

	var select = d3.select('#chart').append('div').append('input').attr('type', 'button').attr('value', 'Add line').on('click', function(e){update();});


}
