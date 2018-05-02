/**
 * Author: Diénert Vieira
 * Em@il: dienert.vieira@dataprev.gov.br
 * Company: Dataprev
 * Creation Year: 2018
 */
(function () {
var paramOperator = Qva.Remote.indexOf('?') >= 0 ? '&' : '?';
var EXTENSION_PATH = Qva.Remote + paramOperator + "public=only&name=Extensions/d3_calendar/";

Qva.LoadCSS(EXTENSION_PATH + "css/chart2.css");

Qva.LoadScript(EXTENSION_PATH + "js/d3js/vendor/jquery-1.11.2.min.js", function() {
	Qva.LoadScript(EXTENSION_PATH + "js/d3js/d3.v4.min.js", function() {
		Qva.LoadScript(EXTENSION_PATH + "js/chart2.js", function() {
			D3JS_MASTER();
		});
	});
});


function D3JS_MASTER() {
	
	_this = this;
	
	_this.toNumber = function(value) {
		var reg = new RegExp(/^[0-9,\\.]*$/g);
		try {
			if(reg.test(value)) {
				return Number(value.replace(/,/ig,"."));
			} else {
				return value;
			}
		} catch(err) {
			return value;
		}
	}
	
	
	function objectfyDataArray(dataArray) {
		var objArray = [];
		for(let a=0;a<dataArray.length;a++) {
			var row = dataArray[a];
			//console.log("Colunas: "+row.length)
			var rowObj = {};
			//console.log(a+")"+row[0].text+'|'+row[1].text);//+'|'+row[3].text+'|'+row[4].text+'|'+row[5].text+'|'+row[6].text);
			rowObj.date = row[0].text == null || row[0].text == '-' ? 0 : _this.toNumber(row[0].text);
			rowObj.count = _this.toNumber(row[1].text);
			//rowObj.name = row[2].text;
			if(a > 100) break;
			//rowObj.percent = _this.toNumber(row[3].text);
			//rowObj.type = row[4].text;
			//rowObj.situacao = row[5].text;
			//rowObj.tooltipText1 = row[6].text;
			//rowObj.tooltipText2 = row[7].text;
			//console.log(rowObj.tooltipText1);
			//console.log(rowObj.tooltipText2);
			//rowObj.size = 0;
			objArray.push(rowObj);
		}
		return objArray;
	}
	
	/*
	_this.objectfyDataArray = function(dataArray) {
		var objArray = [];
		for(let a=0;a<dataArray.length;a++) {
			var row = dataArray[a];
			var rowObj = {};
			rowObj.parentid = row[0].text == null || row[0].text == '-' ? 0 : _this.toNumber(row[0].text);
			rowObj.id = _this.toNumber(row[1].text);
			rowObj.name = row[2].text;
			rowObj.percent = _this.toNumber(row[3].text);
			rowObj.type = row[4].text;
			rowObj.situacao = row[5].text;
			rowObj.tooltipText1 = row[6].text;
			rowObj.tooltipText2 = row[7].text;
			//console.log(rowObj.tooltipText1);
			//console.log(rowObj.tooltipText2);
			rowObj.size = 0;
			objArray.push(rowObj);
		}
		return objArray;
	}
	
	_this.unflatten = function( array, parent, tree ) {
		tree = typeof tree !== 'undefined' ? tree : [];
		parent = typeof parent !== 'undefined' ? parent : { id: 0 };
		
		var children = _.filter( array, function(child){ return child.parentid == parent.id; });
		
		if( !_.isEmpty( children )  ){
			if( parent.id == 0 ){
				tree = children;   
			}else{
				parent['_children'] = children
			}
			_.each( children, function( child ){ unflatten( array, child ) } );                    
		}
		
		return tree;
	}*/
	
	//var CURRENT_QV_DOCUMENT = Qv.GetCurrentDocument();
	
	Qv.AddExtension(
		"d3_calendar",
		function() {
			try {
				var canvasID = 'div'+this.Name.slice('Document.'.length, this.Name.length);
				
				//console.log(canvasID);

				var alreadyHasComp = $("#"+canvasID).length;
				
				//console.log($("#"+canvasID).length);
				
				//console.log("adasdasa");
				
				if(!alreadyHasComp) {
					var canvas = document.createElement("div");
					canvas.setAttribute("id",canvasID);
					canvas.setAttribute("class","grafico");
					this.Element.appendChild(canvas);
					//console.log("criada div: "+canvasID);
				} else {
					$("#"+canvasID).remove();
					var canvas = document.createElement("div");
					canvas.setAttribute("id",canvasID);
					this.Element.appendChild(canvas);
					//console.log("criado id de novo: "+canvasID);
				}

				$("#"+canvasID).css({
					"width": this.GetWidth()+"px",
					"height": this.GetHeight()+"px"
					//"border": "2px solid green"
				});
				
				//console.log('Quantidade de linhas de dados:'+this.Data.Rows.length);

				var data = objectfyDataArray(this.Data.Rows);

			///*
			var //width = 600,
				height = 136,
				width = this.GetWidth();
				//height = this.GetHeight();
				cellSize = 17;
			var formatPercent = d3.format(".1%");
			//console.log(this.Layout.Text0.text);
			var max = parseInt(this.Layout.Text0.text);
			var min = parseInt(this.Layout.Text1.text);
			//console.log('max:' +max+' min:'+min)
			var color = d3.scaleQuantize()
				//.domain([-0.05, 0.05])
				.domain([Math.log(min), Math.log(max)])
				//.range(["#a50026", "#d73027", "#f46d43", "#fdae61", "#fee08b", "#ffffbf", "#d9ef8b", "#d9ef8b", "#66bd63", "#1a9850", "#006837"]);
				//.range(["#006837","#1a9850", "#66bd63", "#d9ef8b", "#ffffbf", "#fee08b", "#fdae61", "#f46d43", "#d73027","#a50026"]);
				.range(["#006837", "#66bd63", "#d9ef8b", "#ffffbf", "#fee08b", "#fdae61", "#f46d43", "#d73027","#a50026"]);
			var svg = d3.select("#"+canvasID)
			  .selectAll("svg")
			  .data(d3.range(2016, 2018))
			  .enter().append("svg")
				.attr("width", width)
				.attr("height", height)
			  .append("g")
				.attr("transform", "translate(" + ((width - cellSize * 53) / 2) + "," + (height - cellSize * 7 - 1) + ")");
			svg.append("text")
				.attr("transform", "translate(-6," + cellSize * 3.5 + ")rotate(-90)")
				.attr("font-family", "sans-serif")
				.attr("font-size", 10)
				.attr("text-anchor", "middle")
				.text(function(d) { return d; });
			var rect = svg.append("g")
				.attr("fill", "none")
				.attr("stroke", "#ccc")
			  .selectAll("rect")
			  .data(function(d) { return d3.timeDays(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
			  .enter().append("rect")
				.attr("width", cellSize)
				.attr("height", cellSize)
				.attr("x", function(d) { return d3.timeWeek.count(d3.timeYear(d), d) * cellSize; })
				.attr("y", function(d) { return d.getDay() * cellSize; })
				//.datum(d3.timeFormat("%Y-%m-%d"));
				//.datum(d3.timeFormat("%Y/%m/%d"));
				.datum(d3.timeFormat("%d/%m/%y"));
			svg.append("g")
				.attr("fill", "none")
				.attr("stroke", "#000")
			  .selectAll("path")
			  .data(function(d) { return d3.timeMonths(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
			  .enter().append("path")
				.attr("d", pathMonth);
			//d3.csv(EXTENSION_PATH + 'data/dji.csv', function(error, csv) {
			
			//var file = false;
			var file = false;

			if(file) {
				d3.csv(EXTENSION_PATH + 'data/maria.csv', function(error, csv) {
					//console.log(csv);
					draw(csv);
				});
			} else {
				//d3.csvParse(toCsv(data), function(csv) {
					draw(data);
					//consoleconsole.log(data);
				
			}
			
			function draw(csv) {

				//if (error) throw error;
				var data = d3.nest()
					.key(function(d) { return d.date; })
					//.rollup(function(d) { return (d[0].Close - d[0].Open) / d[0].Open; })
					.rollup(function(d) { return d[0].count; })
					.object(csv);
				
				rect.filter(function(d) { return d in data; })
					.attr("fill", function(d) { return color(Math.log(data[d])); })
					.append("title")
					.text(function(d) { return d + ": " + data[d]; });
			};

			function pathMonth(t0) {
			  var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0),
				  d0 = t0.getDay(), w0 = d3.timeWeek.count(d3.timeYear(t0), t0),
				  d1 = t1.getDay(), w1 = d3.timeWeek.count(d3.timeYear(t1), t1);
			  return "M" + (w0 + 1) * cellSize + "," + d0 * cellSize
				  + "H" + w0 * cellSize + "V" + 7 * cellSize
				  + "H" + w1 * cellSize + "V" + (d1 + 1) * cellSize
				  + "H" + (w1 + 1) * cellSize + "V" + 0
				  + "H" + (w0 + 1) * cellSize + "Z";
			}

			//*/

				if(!alreadyHasComp) {
					//DTPTree.drawTree("#"+canvasID, EXTENSION_PATH, treeData[0]);
					//chart2(canvasID, this.GetWidth(), this.GetHeight());
				} else {
					//DTPTree.resizeSVG("#"+canvasID, this.GetWidth(), thisGetHeight());
					//console.log("elzi");
					//resizeSVG(canvasID, this.GetWidth(), this.GetHeight());
				}


			} catch(e) {
				console.error(e.stack);
			}
		},
		false
	);
}
})();