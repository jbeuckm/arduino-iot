angular.module('arduino-iot')
    .directive('logsGraph', function(){


        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'js/templates/logs-graph-directive.html',
            link: function (scope, element, attrs) {

                var margin = {top: 20, right: 80, bottom: 30, left: 50},
                    width = 960 - margin.left - margin.right,
                    height = 500 - margin.top - margin.bottom;

                var parseDate = d3.time.format("%Y%m%d").parse;

                var x = d3.time.scale()
                    .range([0, width]);

                var y = d3.scale.linear()
                    .range([height, 0]);

                var color = d3.scale.category10();

                var xAxis = d3.svg.axis()
                    .scale(x)
                    .orient("bottom");

                var yAxis = d3.svg.axis()
                    .scale(y)
                    .orient("left");

                var line = d3.svg.line()
                    .interpolate("basis")
                    .x(function(d) { return x(d.date); })
                    .y(function(d) { return y(d.temperature); });

//                var svg = d3.select("body").append("svg")

                console.log(element.children()[1])

                var svg = d3.select(element.children()[1])
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                d3.json("data/sample_logs.json", function(error, data) {
                    if (error) throw error;

                    data = data.map(function(d) {
//                        d.date = parseDate(d.created_at);
                        return {
                            date: new Date(d.created_at),
                            'temp (C)': parseInt(d.temperature),
                            'humidity (%)': parseInt(d.humidity),
                            light: parseInt(d.analog0) / 102.3
                        };
                    });

                    color.domain(d3.keys(data[0]).filter(function(key) { return key !== "date"; }));

                    console.log(data);

                    var cities = color.domain().map(function(name) {
                        return {
                            name: name,
                            values: data.map(function(d) {
                                return {date: d.date, temperature: parseInt( d[name]) };
                            })
                        };
                    });

                    x.domain(d3.extent(data, function(d) { return d.date; }));

                    y.domain([
                        d3.min(cities, function(c) { return d3.min(c.values, function(v) { return v.temperature; }); }),
                        d3.max(cities, function(c) { return d3.max(c.values, function(v) { return v.temperature; }); })
                    ]);

                    svg.append("g")
                        .attr("class", "x axis")
                        .attr("transform", "translate(0," + height + ")")
                        .call(xAxis);

                    svg.append("g")
                        .attr("class", "y axis")
                        .call(yAxis);

                    var city = svg.selectAll(".city")
                        .data(cities)
                        .enter().append("g")
                        .attr("class", "city");

                    city.append("path")
                        .attr("class", "line")
                        .attr("d", function(d) { return line(d.values); })
                        .style("stroke", function(d) { return color(d.name); });

                    city.append("text")
                        .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
                        .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.temperature) + ")"; })
                        .attr("x", 3)
                        .attr("dy", ".35em")
                        .text(function(d) { return d.name; });
                });


            }

        };

    });
