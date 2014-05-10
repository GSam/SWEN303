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
					graph1();

				});

			});

		});

	});
});
