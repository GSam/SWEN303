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
var isNewZealand = {'Central Pulse':true, 'Queensland Firebirds':false, 'Northern Mystics':true, 'Waikato Bay of Plenty Magic':true, 'New South Wales Switfts':false, 'Canterbury Tactix':true, 'Melbourne Vixens':false, 'West Coast Fever':false, 'Adelaide Thunderbirds':false, 'Southern Steel':true}

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
					});
					console.log(allGames);
					console.log(allTeams);
				});

			});

		});

	});
});
