// https://d3js.org/d3.v3.min.js

var pre_data = d3.csv.parse(d3.select("pre#data").text());

var margin = {
    top: 20,
    right: 120,
    bottom: 20,
    left: 120
},
width = 1000 - margin.right - margin.left,
    height = 500 - margin.top - margin.bottom;

var canvas = d3.select("body").append("svg")
    .attr("width", 2000)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var tree = d3.layout.tree()
    .size([height, width]);

var diagonal = d3.svg.diagonal()
    .projection(function (d) {
    return [d.y, d.x];
});

var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);


    var flare_data = {};
    var nested_data = d3.nest()
        .key(function (d) {
        return d['Machine'];
    })
        .key(function (d) {
        return d['Name'];
    })
        .entries(pre_data);
    flare_data.key = "Flare";
    flare_data.values = nested_data;
    flare_data = reSortFlare(flare_data);
    var nodes = tree.nodes(flare_data);



    var link = canvas.selectAll(".link")
        .data(tree.links(nodes))
        .enter().append("path")
        .attr("class", "link")
        .attr("d", diagonal);

    var node = canvas.selectAll(".node")
        .data(nodes)
        .enter()
        .append("g")
        .attr("class", "node")
        .attr("transform", function (d) {
        return "translate(" + d.y + "," + d.x + ")";
    });

    node.append("circle")
        .attr("r", 7)
        .on("mouseover", function (d) {
        div.transition()
            .duration(200)
            .style("opacity", .9);
        div.html(
            "Name: " + d.name + "<br/>" +
            "URL Template: " + d['URL Template'] + "<br/>" +
            "Page Start: " + d['Page Start'] + "<br/>" +
            "Page Size: " + d['Page Size'] + "<br/>" +
            "Max Pages: " + d['Max Pages'] + "<br/>" +
            "xPath:&nbsp" + d['xPath'] + "<br/>" +
            "RegEx: " + d['RegEx'] + "<br/>" +
            "eCommerce: " + d['eCommerce'] + "<br/>" +
            "Search Interval: " + d['Search Interval'] + "<br/>" +
            "Additional Variable: " + d['Additional Variable'] + "<br/>" +
            "Variable Value: " + d['Variable Value'] + "<br/>")
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 28) + "px");
    })
        .on("click", function (d) {
        div.transition()
            .duration(500)
            .style("opacity", 0);
    });

    node.append("text")
        .attr("dx", function (d) {
        return d.children ? -15 : 15;
    })
        .attr("dy", 3)
        .style("text-anchor", function (d) {
        return d.children ? "end" : "start";
    })
        .text(function (d) {
        return d.children ? d.name : d['Name'];
    });


function reSortFlare(d) {
    for (var key in d) {
        if (key == "key") {
            d.name = d.key;
            delete d.key;
        }
        if (key == "values") {
            d.children = [];
            for (var item in d.values) {
                d.children.push(reSortFlare(d.values[item]));
            }
            delete d.values;
        }
    }
    return d;
}