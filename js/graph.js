        function makeGraphs(hasAxis, data_in, old_max, old_min){
            function startGraphic(w,h,margin,svg) {

              //Small functoin that allows to set defaults for values easily
              function defaultFor(arg, val) { return typeof arg !== 'undefined' ? arg : val; }

              w = defaultFor(w,500)
              h = defaultFor(h,200)
              margin = defaultFor(margin,{ top: 0, right: 0, bottom: 0, left: 0 })

              h = h - margin.top - margin.bottom
              w = w - margin.left - margin.right

              svg = defaultFor(svg,d3.select("#chart").append("svg").attr("width", w).attr("height", h))

              return {'svg':svg,'margin':margin,'w':w,'h':h}

             }

            start=startGraphic(800,100,{ top: 20, right: 0, bottom: 0, left: 100 });

            var svg = start['svg'];
            var margin = start['margin'];
            var h = start['h'];
            var w = start['w'];

            //load data from external JSON file
            // d3.json("data/gender_pay_2013.json", function (gender_pay) {

            //d3.json(data_in, function (event_show) {
            
            //Process data
            data_in.forEach(function(d) { d.time = new Date(Date.parse(d.time)); });
            
            var xMin = d3.min(data_in, function(d){ return Math.min(d.time); });
            var xMax = d3.max(data_in, function(d){ return Math.max(d.time); });
            if (old_max !== false){
                if (old_min < xMin){
                    xMin = old_min}
                if (old_max > xMax){
                    xMax = old_max}
            }
            console.log(data_in)
            var timeFormat = d3.time.format("%I:%M %p %m/%d");

            // padding
            var padding = 80;

            //Create scales for X and Y axes
            var xScale = d3.time.scale()
                .domain([xMin, xMax])
                .range([margin.left, w - margin.right]);


            var yScale = d3.scale.linear()
                     .domain([0, 2500])
                     .range([h - margin.top, margin.bottom]);
 //set up commas formatting for numbers
            var commasFormatter = d3.format(",.0f")
           //add axes
            var xAxis = d3.svg.axis()
                  .scale(xScale)
                  .orient("bottom")
                  .ticks(5)
                  .tickFormat(timeFormat);
                  //.tickFormat(function(d) { return "$" + commasFormatter(d); }); //format as $, with commas for thousands
            var emptyAxis = d3.svg.axis()
                  .scale(xScale)
                  .orient("bottom")
                  .tickFormat("")
                  .ticks(5)
                  .tickSize(10000,0)

            var yAxis = d3.svg.axis()
                  .scale(yScale)
                  .orient("left")
                  .ticks(5);
                  //.tickFormat(function(d) { return "$" + commasFormatter(d); }); //format as $, with commas for thousands

            function make_x_axis() {
                  return d3.svg.axis()
                      .scale(xScale)
                       .orient("bottom")
                       .ticks(5)
              }

              svg.append("g")
                .attr("class", "grid")
                .attr("transform", "translate(0," + h + ")")
                .call(make_x_axis()
                    .tickSize(-h, 0, 0)
                    .tickFormat("")
                );

            if (hasAxis){
            svg.append("g")
                .attr("class", "axis")
                .attr("transform", "translate(0," + (h - margin.top) + ")")
                .call(xAxis)
              } else {
                svg.append("g")
                .attr("class", "axis")
                .attr("transform", "translate(0," + (h - margin.top) + ")")
                .call(emptyAxis);
              }
            //     .append("text")
            //         .attr("class", "label")
            //         .attr("text-anchor", "end")
            //         .attr("x", w-3*margin.right)
            //         .attr("y", margin.bottom/2)
            //         .style('format','bold')
            //         .text("Men's median weekly salary");


            // svg.append("g")
            //     .attr("class", "axis")
            //     .attr("transform", "translate(" + margin.left + ",0)")
            //     .call(yAxis)

                // .append("text")
                //     .attr("class", "label")
                //     .attr("text-anchor", "end")
                //     .attr("transform", "rotate(-90)")
                //     .attr("x", -2*margin.top)
                //     .attr("y", -15-margin.bottom/2)
                //     .text("Women's median weekly salary");

// add equal pay line
    svg.append("line")
        .attr("x1", xScale(xMin))
        .attr("x2", xScale(xMax))
        .attr("y1", yScale(1250))
        .attr("y2", yScale(1250))
        .style("stroke", "gray")
        .style("stroke-dasharray", ("2, 2"))
        .style("stroke-width", 0.75);

    // add equal pay label
    // svg.append("text")
    //     .attr("class", "label")
    //     .attr("transform", "rotate(-45)")
    //     .attr("x", xScale(5))
    //     .attr("y", 4.2*h/5)
    //     .text("Equal pay");




            //add a tooltip div to the web page
            var tooltip = d3.select("#chart").append("div")
                .attr("class", "tooltip");

             //use d3 built-in categorical color scheme
            var color = d3.scale.category10();

            //add circles, with a tooltip
            // svg.selectAll("circle")
            //     .data(gender_pay)
            //     .enter()
            //     .append("circle")
            //     .attr("class", "circle")
            //     //apply color scheme to fill the circles according to occupation type
            //     .attr("opacity", 0.5)
            //     .attr("fill", function(d, i) { return d.color = color(d.type); })

            //     .attr("cx", function (d) { return xScale(d.m_salary); })
            //     .attr("cy", function (d) { return yScale(d.w_salary); })
            //     .attr("r", function(d) {
            //                     return d.w_salary == null ? 0 :
            //                     d.m_salary == null ? 0 :
            //                     5;
            //                 })
            //     .on("mouseover", function(d) {
            //         tooltip.html(d.occupation)
            //             .style("visibility", "visible")
            //             .style("left", (d3.event.pageX + 10) + "px")
            //             .style("top", (d3.event.pageY + 10) + "px");
            //     })
            //     .on("mouseout", function(d) {
            //     tooltip.style("visibility", "hidden")
            //     })



     //add circles
            //data_in['event'] = data_in['event'].map(Number)
            //data_in['time'] = data_in['time'].map(Number)
            //parse = d3.time.format("%d-%m-%Y-%H-%M").parse
                svg.selectAll("circle")
                    .data(data_in) //filter to display just data for 2012 .filter(function (d) { return (d.year==2015); })
                    .enter()
                    .append("circle")
                    .attr("class", "circle")
                    .attr("cx", function (d) { return xScale(d.time); })
                    .attr("cy", function (d) { return yScale(d.event);})  //yScale(d.event)
                    .attr("r", 5) //removed function to handle nulls, as they are no longer present
                    .attr("fill", function(d) { return d.color = color(d.event); })
                    .attr("opacity", 0.5)
                    .on("mouseover", function(d) {
                        tooltip.html(d.activity)
                            .style("visibility", "visible")
                            .style("left", (d3.event.pageX + 10) + "px")
                               .style("top", (d3.event.pageY + 10) + "px");
                       })
                      .on("mouseout", function(d) {
                      tooltip.style("visibility", "hidden")
                       })


     //transition between views when buttons are clicked
                // d3.select("#y2012").on("click", function() {
                //     svg.selectAll("circle")
                //         .data(gender_pay.filter(function (d) { return (d.year==2012); }))
                //         .transition()
                //         .duration(1000)
                //         .attr("cx", function (d) { return xScale(d.m_salary); })
                //         .attr("cy", function (d) { return yScale(d.w_salary); })
                //         .attr("r", 5)
                // });


                // d3.select("#y2013").on("click", function() {
                //     svg.selectAll("circle")
                //         .data(gender_pay.filter(function (d) { return (d.year==2013); }))
                //         .transition()
                //         .duration(1000)
                //         .attr("cx", function (d) { return xScale(d.m_salary); })
                //         .attr("cy", function (d) { return yScale(d.w_salary); })
                //         .attr("r", 5)
                // });


                 // svg.append("text")
                 //    .attr("id", "yLabel")
                 //    .attr("text-anchor", "start")
                 //    .attr("x", h/2.8)
                 //    .attr("y", w/6)
                 //    .text("2012")


                 //transition between views when buttons are clicked
                    // d3.select("#y2012").on("click", function() {
                    //     svg.selectAll("circle")
                    //         .data(gender_pay.filter(function (d) { return (d.year==2012); }))
                    //         .transition()
                    //         .duration(1000)
                    //         .attr("cx", function (d) { return xScale(d.m_salary); })
                    //         .attr("cy", function (d) { return yScale(d.w_salary); })
                    //         .attr("r", 5)
                    //     //change the year label
                    //     svg.select("#yLabel")
                    //         .text("2012")
                    // });


                    // d3.select("#y2013").on("click", function() {
                    //     svg.selectAll("circle")
                    //         .data(gender_pay.filter(function (d) { return (d.year==2013); }))
                    //         .transition()
                    //         .duration(1000)
                    //         .attr("cx", function (d) { return xScale(d.m_salary); })
                    //         .attr("cy", function (d) { return yScale(d.w_salary); })
                    //         .attr("r", 5)
                    //     //change the year label
                    //     svg.select("#yLabel")
                    //         .text("2013")
                    // });

  //});
                return [xMax, xMin]
};
