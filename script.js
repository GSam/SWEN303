var w=960,h=500,
svg=d3.select("#chart")
.append("svg")
.attr("width",w)
.attr("height",h);
 
var text=svg
.append("text")
.text("hello world")
.attr("y",50);

d3.csv('2008-Table1.csv', function(e){
	console.log(e);
	for (var i = 0; i < e.length; i++) {
		console.log(e[i].Score);
	}
	d3.csv('2009-Table1.csv', function(e){
		d3.csv('2010-Table1.csv', function(e){
			d3.csv('2011-Table1.csv', function(e){
				d3.csv('2012-Table1.csv', function(e){



				});

			});

		});

	});
});
