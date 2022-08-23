import { Component, OnInit, Input, OnChanges, SimpleChanges, } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss']
})
export class TreeComponent implements OnInit {

  @Input() data: any = {};
  svg: any;
  width: number = 900;
  height: number = 320;

  constructor() { }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    this.svg = undefined;
    this.createTree();
  }

  tree(data: any): any {
    const root: any = d3.hierarchy(data);
    root.dx = 20;
    root.dy = this.width / (root.height + 1);
    let layout: any = d3.tree();
    return layout.nodeSize([root.dx, root.dy])(root);
  }

  createTree() {
    const root = this.tree(this.data);
    this.svg = d3.select("div#tree-chart")
      .append("svg")
      .attr("viewBox", `0 0 ${this.width} ${this.height}`)
      .style("background", "white")
      .style("font", "14px sans-serif")
      .style("fill", '#585858');

    const g = this.svg.append("g")
      .attr("width", this.width)
      .attr("height", this.height)
      .attr('transform', `translate(90, ${(this.height/2)})`);

    const link = g.append("g")
      .attr("fill", "none")
      .attr("stroke", "#90a7b0")
      .attr("stroke-opacity", 0.8)
      .attr("stroke-width", 3)
    .selectAll("path")
      .data(root.links())
      .enter().append("path")
        .attr("d", (d: any) => `
          M${d.target.y},${d.target.x}
          C${d.source.y + root.dy / 2},${d.target.x}
           ${d.source.y + root.dy / 2},${d.source.x}
           ${d.source.y},${d.source.x}
        `);

    const node = g.append("g")
        .attr("stroke-linejoin", "round")
        .attr("stroke-width", 3)
      .selectAll("g")
      .data(root.descendants().reverse())
      .enter().append("g")
        .attr("transform", (d: any)=> `translate(${d.y},${d.x})`);

    node.append("circle")
        .attr("fill", "#90a7b0")
        .attr("r", 6);

    node.append("text")
        .attr("dy", "0.31em")
        .attr("x", (d: any) => d.children ? -8 : 8)
        .text((d: any) => d.data.name)
      .filter((d: any) => d.children)
        .attr("text-anchor", "end")
      .clone(true).lower()
        .attr("stroke", "white");
  }
}
