console.log('7.1');

//First, append <svg> element and implement the margin convention
var m = {t:50,r:200,b:50,l:200};
var outerWidth = document.getElementById('canvas').clientWidth,
    outerHeight = document.getElementById('canvas').clientHeight;
var w = outerWidth - m.l - m.r,
    h = outerHeight - m.t - m.b;

var plot = d3.select('.canvas')
    .append('svg')
    .attr('width',outerWidth)
    .attr('height',outerHeight)
    .append('g')
    .attr('transform','translate(' + m.l + ',' + m.t + ')');

var scaleX, scaleY;

//Step 1: importing multiple datasets
d3.queue()
    .defer(d3.csv,'../data/olympic_medal_count_1900.csv',parse)
    .defer(d3.csv,'../data/olympic_medal_count_1960.csv',parse)
    .defer(d3.csv,'../data/olympic_medal_count_2012.csv',parse)
    .await(function(err,rows1900,rows1960,rows2012){
        //Draw axis
       
         scaleX = d3.scaleLinear()
            .domain([0,4])
            .range([0,w]);

         scaleY =d3.scaleLinear()
            .domain([0,120])
            .range([h,0]);

        var axisY = d3.axisLeft()
            .scale(scaleY)
            .tickSize(-w-200);

        plot.append('g')
            .attr('class','axis axis-y')
            .attr('transform','translate(-100,0)')
            .call(axisY);

        //Step 2: implement the code to switch between three datasets
        d3.select('#year-1900').on('click', function(){
            draw(rows1900);
        });
        d3.select('#year-1960').on('click', function(){
            draw(rows1960);
        });
        d3.select('#year-2012').on('click', function(){
            draw(rows2012);
        });

    });

//Step 3: implement the enter / exit / update pattern
function draw(rows){
    var top5 = rows.sort(function(a,b){
        return b.count - a.count;
    }).slice(0,5);

    console.log(top5);

//update
var update = plot.selectAll(".country")
             .data(top5,function(d){
                return d.country
             });

//enter
var enter = update.enter()
            .append("g")
            .attr("class","country")
            .attr("transform",function(d,i){
                return "translate(" + scaleX(i) + ",0)"
            });

// creat barchart

enter.append("rect")
     .attr("width",40);
//     .attr("x",0)
//     .attr("y",function(d){return scaleY(d.count)})
//     .attr("height",function(d){return h -scaleY(d.count)});


enter.append("text")
     .text(function(d){return d.country})
     .attr("text-anchor","middle");


var updateNew = update.merge(enter);

updateNew.select("rect")
          .attr("x",0)
          .transition()
          .duration(700)
          .attr("y",function(d){return scaleY(d.count)})
          .attr("height",function(d){return h -scaleY(d.count)});
       
updateNew.select("text")
          .attr("y",function(d){return scaleY(d.count)});
          


update.exit().remove();



}

function parse(d){
    return {
        country: d.Country,
        count: +d.count
    }
}
