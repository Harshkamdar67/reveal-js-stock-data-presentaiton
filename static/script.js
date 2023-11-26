 // Custom data for three imaginary stocks
 const stocks = {{ stock_data | tojson | safe }};

 // D3.js code for the visualization
 const width = 600;
 const height = 400;
 
     const x = d3.scaleUtc()
         .domain(d3.extent(stocks, d => d.Date))
         .range([40, width - 40])
         .clamp(true);
 
     const series = d3.groups(stocks, d => d.Symbol).map(([key, values]) => {
         const v = values[0].Close;
         return {key, values: values.map(({Date, Close}) => ({Date, value: Close / v}))};
     });
 
     const k = d3.max(series, ({values}) => d3.max(values, d => d.value) / d3.min(values, d => d.value));
     const y = d3.scaleLog()
         .domain([1 / k, k])
         .rangeRound([height - 30, 20]);
 
     const z = d3.scaleOrdinal(d3.schemeCategory10).domain(series.map(d => d.Symbol));
 
     const svg = d3.create("svg")
         .attr("width", width)
         .attr("height", height)
         .attr("viewBox", [0, 0, width, height]);
 
     svg.append("g")
         .attr("transform", `translate(0,${height - 30})`)
         .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0))
         .call(g => g.select(".domain").remove());
 
     svg.append("g")
         .attr("transform", "translate(40,0)")
         .call(d3.axisLeft(y)
             .ticks(null, x => +x.toFixed(6) + "×"))
         .call(g => g.selectAll(".tick line").clone()
             .attr("stroke-opacity", d => d === 1 ? null : 0.2)
             .attr("x2", width - 80))
         .call(g => g.select(".domain").remove());
 
     const rule = svg.append("g")
         .append("line")
         .attr("y1", height)
         .attr("y2", 0)
         .attr("stroke", "black");
 
     const serie = svg.append("g")
         .style("font", "bold 10px sans-serif")
         .selectAll("g")
         .data(series)
         .join("g");
 
     const line = d3.line()
         .x(d => x(d.Date))
         .y(d => y(d.value));
 
     serie.append("path")
         .attr("fill", "none")
         .attr("stroke-width", 1.5)
         .attr("stroke-linejoin", "round")
         .attr("stroke-linecap", "round")
         .attr("stroke", d => z(d.key))
         .attr("d", d => line(d.values));
 
     serie.append("text")
         .datum(d => ({key: d.key, value: d.values[d.values.length - 1].value}))
         .attr("fill", d => z(d.key))
         .attr("paint-order", "stroke")
         .attr("stroke", "white")
         .attr("stroke-width", 3)
         .attr("x", width - 40)
         .attr("y", d => y(d.value))
         .attr("dy", "0.35em")
         .text(d => d.key);
 
     function update(date) {
         date = d3.utcDay.round(date);
         rule.attr("transform", `translate(${x(date) + 0.5},0)`);
         serie.attr("transform", ({values}) => {
             const i = d3.bisector(d => d.Date).left(values, date, 0, values.length - 1);
             return `translate(0,${y(1) - y(values[i].value / values[0].value)})`;
         });
         svg.property("value", date).dispatch("input");
     }
 
     d3.transition()
         .ease(d3.easeCubicOut)
         .duration(1500)
         .tween("date", () => {
             const i = d3.interpolateDate(x.domain()[1], x.domain()[0]);
             return t => update(i(t));
         });
 
     svg.on("mousemove touchmove", function(event) {
         update(x.invert(d3.pointer(event, this)[0]));
         d3.event.preventDefault();
     });
 
     // Uncomment the line below if you want to remove the introductory transition.
     // update(x.domain()[0]);
 
     document.body.appendChild(svg.node());