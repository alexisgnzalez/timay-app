import { Component, OnInit, Input, OnChanges, SimpleChanges, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';
import * as _ from 'underscore';

@Component({
  selector: 'app-skills-chart',
  templateUrl: './skills-chart.component.html',
  styleUrls: ['./skills-chart.component.scss']
})
export class SkillsChartComponent implements OnInit, OnChanges, AfterViewInit {

  @Input() data: Array<any> = [];
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
  axesDomain: any;
  axesLength: any;
  formatPercent: any = d3.format(',.0%');
  wrapWidth = 60;
  axisLabelFactor = 1.12;
  axisCircles = 5;
  margin = 50;
  width = 420;
  height = 400;
  radius = (this.height-(this.margin*2)) / 2;
  dotRadius = 4;
  maxValue: any;
  angleSlice: any;
  rScale: any;
  radarLine: any;
  color = d3.scaleOrdinal()
  .range(["#EDC951","#CC333F","#00A0B0"]);
  viewLoaded: boolean = false;

  axisGrid: any;
  axis: any;
  plots: any;


  constructor() { }

  ngOnInit(): void {
    this.axesDomain = this.data[0].map((d: any) => d.axis);
    this.axesLength =  this.data[0].length;
    this.maxValue = d3.max(_.flatten(this.data).map((d: any) => d.value));
    this.angleSlice = Math.PI * 2 / this.axesLength;
    this.rScale = d3.scaleLinear()
      .domain([0, this.maxValue])
      .range([0, this.radius]);
    this.radarLine = d3.lineRadial()
      .curve(d3["curveCatmullRomClosed"])
      .radius((d: any) => this.rScale(d))
      .angle((d: any, i) => i * this.angleSlice);
    this.createRadarChart();
  }

  ngOnChanges(changes: SimpleChanges) {

    if (this.viewLoaded) {
      console.log("es muy rapido: ", changes['data'].currentValue);
      this.axesDomain = changes['data'].currentValue[0].map((d: any) => d.axis);
      this.axis.select('text')
        .data(this.axesDomain)
        .transition()
        .duration(2000)
        .text((d: any) => d);
      
      this.plots.select('path')
        .data(this.data)
        .attr("d", (d: any) => this.radarLine(d.map((v: any) => v.value)))
    }
  }

  ngAfterViewInit() {
    this.viewLoaded = true;
  }

  device = (d: any) => ["Grecia"][d];

  createRadarChart(): void {
    this.svg = d3.select("div#radar-chart")
      .append("svg")
      .attr("viewBox", `0 0 ${this.width} ${this.height}`);
  
    const containerWidth = this.width-(this.margin*2);
    const containerHeight = this.height-(this.margin*2);
    const container = this.svg.append('g')
      .attr("width", containerWidth)
      .attr("height", containerHeight)
      .attr('transform', `translate(${(this.width/2)}, ${(this.height/2)})`);
    
    this.axisGrid = container.append("g")
      .attr("class", "axisWrapper");
    
    this.axisGrid.selectAll(".levels")
      .data(d3.range(1,(this.axisCircles+1)).reverse())
      .enter()
       .append("circle")
       .attr("class", "gridCircle")
       .attr("r", (d: any, i: any) => this.radius/this.axisCircles*d)
       .style("fill", "#CDCDCD")
       .style("stroke", "#CDCDCD")
       .style("fill-opacity", 0.1);
    
    this.axisGrid.selectAll(".axisLabel")
      .data(d3.range(1,(this.axisCircles+1)).reverse())
      .join('text')
        .attr('class', 'axisLabel')
        .attr('x', 4)
        .attr('y', (d: any) => (-d * this.radius) / this.axisCircles)
        .attr('dy', '0.4em')
        .style('font-size', '8px')
        .style('fill', '#585858')
        .text((d: any) =>
          this.formatPercent(this.maxValue * d / this.axisCircles));

    this.axis = this.axisGrid.selectAll(".axis")
      .data(this.axesDomain)
      .enter()
        .append("g")
        .attr("class", "axis");

    this.axis.append("line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", (d: any, i: any) =>
        this.rScale(this.maxValue*1.1) * Math.cos(this.angleSlice*i - Math.PI/2))
      .attr("y2", (d: any, i: any) =>
        this.rScale(this.maxValue*1.1) * Math.sin(this.angleSlice*i - Math.PI/2))
      .attr("class", "line")
      .style("stroke", "white")
      .style("stroke-width", "2px");

    this.axis.append("text")
      .attr("class", "legend")
      .style("font-size", "11px")
      .style('fill', '#585858')
      .attr("text-anchor", "middle")
      .attr("font-family", "Roboto")
      .attr("dy", "0.35em")
      .attr("x", (d: any, i: any) =>
        this.rScale(this.maxValue * this.axisLabelFactor) * Math.cos(this.angleSlice*i - Math.PI/2))
      .attr("y", (d: any, i: any) =>
        this.rScale(this.maxValue * this.axisLabelFactor) * Math.sin(this.angleSlice*i - Math.PI/2))
      .text((d: any) => d);
    
    this.plots = container.append('g')
      .selectAll('g')
      .data(this.data)
      .join('g')
        .attr("data-name", (d: any, i: any) => this.device(i))
        .attr("fill", "steelblue")
        .attr("fill-opacity", 0.3)
        .attr("stroke", "steelblue");

    this.plots.append('path')
      .attr("d", (d: any) => this.radarLine(d.map((v: any) => v.value)))
      .attr("fill", (d: any, i: any) => this.color(i))
      .attr("fill-opacity", 0.3)
      .attr("stroke", (d: any, i: any) => this.color(i))
      .attr("stroke-width", 2)
      .attr('class', 'radarArea2')
      .on('mouseover', function(d: any) {
        //Dim all blobs
        d3.selectAll('.radarArea2')
          .transition()
          .duration(350)
          .style('fill-opacity', 0.7)
      })
      .on('mouseout', () => {
        //Bring back all blobs
        d3.selectAll('.radarArea2')
          .transition()
          .duration(350)
          .style('fill-opacity', 0.3)
      });

    this.plots.selectAll("circle")
      .data((d: any) => d)
      .join("circle")
        .attr("r", this.dotRadius)
        .attr("cx", (d: any,i: any) =>
          this.rScale(d.value) * Math.cos(this.angleSlice*i - Math.PI/2))
        .attr("cy", (d: any,i: any) =>
          this.rScale(d.value) * Math.sin(this.angleSlice*i - Math.PI/2))
        .style("fill-opacity", 0.8);
  }
}
