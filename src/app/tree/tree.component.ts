import { Component, OnInit, Input } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss']
})
export class TreeComponent implements OnInit {

  @Input() data: any = {};
  svg: any;
  margin = ({top: 10, right: 120, bottom: 10, left: 40});
  width: number = 900;
  dy: number = 900 / 6;
  dx: number = 10;
  tree = d3.tree().nodeSize([this.dx, this.dy]);
  diagonal = d3.linkHorizontal().x((d: any) => d.y).y((d: any) => d.x);

  constructor() { }

  ngOnInit(): void {
    console.log(this.data);
    this.createTree();
  }

  createTree() {
    const root: any = d3.hierarchy(this.data);

    root.x0 = this.dy / 2;
    root.y0 = 0;
    root.descendants().forEach((d: any, i: any) => {
      d.id = i;
      d._children = d.children;
      if (d.depth && d.data.name.length !== 7) d.children = null;
    });

    this.svg = d3.select("div#tree-chart")
      .append("svg")
      .attr("viewBox", [-this.margin.left, -this.margin.top, this.width, this.dx])
      .style("font", "10px sans-serif")
      .style("user-select", "none");
      

    //this.svg = d3.create("svg")
  }

}
