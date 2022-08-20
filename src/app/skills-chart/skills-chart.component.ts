import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import * as _ from 'underscore';

@Component({
  selector: 'app-skills-chart',
  templateUrl: './skills-chart.component.html',
  styleUrls: ['./skills-chart.component.scss']
})
export class SkillsChartComponent implements OnInit {

  private data = [
    [
      //Grecia
      { axis: "Liderazgo", value: 0.2 },
      { axis: "Arq. Software", value: 0.2 },
      { axis: "Ciencia de Datos", value: 0.2 },
      { axis: "UI/UX", value: 0.1 },
      { axis: "Frontend", value: 0.8 },
      { axis: "Backend", value: 0.5 }
    ]
  ];
  curveTypes = [
    "curveBasis",
    "curveBasisClosed",
    "curveBasisOpen",
    "curveBundle",
    "curveCardinal",
    "curveCardinalClosed",
    "curveCardinalOpen",
    "curveCatmullRom",
    "curveCatmullRomClosed",
    "curveCatmullRomOpen",
    "curveLinear",
    "curveLinearClosed",
    "curveMonotoneX",
    "curveMonotoneY",
    "curveNatural",
    "curveStep",
    "curveStepAfter",
    "curveStepBefore",
  ];
  svg: any;
  axesDomain = this.data[0].map((d: any) => d.axis);
  axesLength =  this.data[0].length;
  formatPercent: any = d3.format(',.0%');
  wrapWidth = 60;
  axisLabelFactor = 1.12;
  axisCircles = 5;
  margin = 50;
  width = 420;
  height = 400;
  radius = (this.height-(this.margin*2)) / 2;
  dotRadius = 4;
  maxValue =  d3.max(_.flatten(this.data).map((d: any) => d.value));
  angleSlice = Math.PI * 2 / this.axesLength;
  rScale = d3.scaleLinear()
    .domain([0, this.maxValue])
    .range([0, this.radius]);
  radarLine = d3.lineRadial()
    .curve(d3["curveCardinalClosed"])
    .radius((d: any) => this.rScale(d))
    .angle((d: any, i) => i * this.angleSlice);
  color = d3.scaleOrdinal()
  .range(["#EDC951","#CC333F","#00A0B0"]);

  constructor() { }

  ngOnInit(): void {
    this.createRadarChart();
  }

  device = (d: any) => ["Grecia"][d];

  private createRadarChart(): void {
    this.svg = d3.select("div#radar-chart")
      .append("svg")
      .attr("viewBox", `0 0 ${this.width} ${this.height}`);
  
    const containerWidth = this.width-(this.margin*2);
    const containerHeight = this.height-(this.margin*2);
    const container = this.svg.append('g')
      .attr("width", containerWidth)
      .attr("height", containerHeight)
      .attr('transform', `translate(${(this.width/2)}, ${(this.height/2)})`);
    
    var axisGrid = container.append("g")
      .attr("class", "axisWrapper");
    
    axisGrid.selectAll(".levels")
      .data(d3.range(1,(this.axisCircles+1)).reverse())
      .enter()
       .append("circle")
       .attr("class", "gridCircle")
       .attr("r", (d: any, i: any) => this.radius/this.axisCircles*d)
       .style("fill", "#CDCDCD")
       .style("stroke", "#CDCDCD")
       .style("fill-opacity", 0.1);
    
    axisGrid.selectAll(".axisLabel")
      .data(d3.range(1,(this.axisCircles+1)).reverse())
      .enter()
        .append('text')
        .attr('class', 'axisLabel')
        .attr('x', 4)
        .attr('y', (d: any) => (-d * this.radius) / this.axisCircles)
        .attr('dy', '0.4em')
        .style('font-size', '8px')
        .style('fill', '#737373')
        .text((d: any) =>
          this.formatPercent(this.maxValue * d / this.axisCircles));

    const axis = axisGrid.selectAll(".axis")
      .data(this.axesDomain)
      .enter()
        .append("g")
        .attr("class", "axis");


    axis.append("line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", (d: any, i: any) =>
        this.rScale(this.maxValue*1.1) * Math.cos(this.angleSlice*i - Math.PI/2))
      .attr("y2", (d: any, i: any) =>
        this.rScale(this.maxValue*1.1) * Math.sin(this.angleSlice*i - Math.PI/2))
      .attr("class", "line")
      .style("stroke", "white")
      .style("stroke-width", "2px");

    axis.append("text")
      .attr("class", "legend")
      .style("font-size", "11px")
      .attr("text-anchor", "middle")
      .attr("font-family", "Roboto")
      .attr("dy", "0.35em")
      .attr("x", (d: any, i: any) =>
        this.rScale(this.maxValue * this.axisLabelFactor) * Math.cos(this.angleSlice*i - Math.PI/2))
      .attr("y", (d: any, i: any) =>
        this.rScale(this.maxValue * this.axisLabelFactor) * Math.sin(this.angleSlice*i - Math.PI/2))
      .text((d: any) => d);
    
    const plots = container.append('g')
      .selectAll('g')
      .data(this.data)
      .join('g')
        .attr("data-name", (d: any, i: any) => this.device(i))
        .attr("fill", "none")
        .attr("stroke", "steelblue");

    plots.append('path')
      .attr("d", (d: any) => this.radarLine(d.map((v: any) => v.value)))
      .attr("fill", (d: any, i: any) => this.color(i))
      .attr("fill-opacity", 0.1)
      .attr("stroke", (d: any, i: any) => this.color(i))
      .attr("stroke-width", 2);

    plots.selectAll("circle")
      .data((d: any) => d)
      .join("circle")
        .attr("r", this.dotRadius)
        .attr("cx", (d: any,i: any) =>
          this.rScale(d.value) * Math.cos(this.angleSlice*i - Math.PI/2))
        .attr("cy", (d: any,i: any) =>
          this.rScale(d.value) * Math.sin(this.angleSlice*i - Math.PI/2))
        .style("fill-opacity", 0.8);

    /*const blobCircleWrapper = container.append('g')
      .selectAll('.radarCircleWrapper')
      .data(this.data)
      .join('g')
        .attr('class', 'radarCircleWrapper')

    blobCircleWrapper.selectAll('.radarInvisibleCircle')
      .data((d: any) => d)
      .join('circle')
        .attr('class', 'radarInvisibleCircle')
        .attr('r', this.dotRadius * 1.5)
        .attr('cx', (d: any,i: any) =>
          this.rScale(d.value) * Math.cos(this.angleSlice * i - Math.PI / 2) )
        .attr('cy', (d: any,i: any) =>
          this.rScale(d.value) * Math.sin(this.angleSlice * i - Math.PI / 2) )
        .style('fill', 'none')
        .style('pointer-events', 'all')
        .on('mouseover', ((event: any,d: any,i: any) => {
          let newX = parseFloat(d3.select(event).attr('cx')) - 10;
          let newY = parseFloat(d3.select(event).attr('cy')) - 10;
          tooltip
            .attr('x', newX)
            .attr('y', newY)
            .text(this.formatPercent(d.value))
            .transition()
            .duration(200)
            .style('opacity', 1)
          }))
        .on('mouseout', () => {
          tooltip
            .transition()
            .duration(200)
            .style('opacity', 0)
          })
    
    const tooltip = container.append('text')
      .attr('class', 'tooltip')
      .style('opacity', 0)*/
    }

}
