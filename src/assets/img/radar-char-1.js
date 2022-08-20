// https://observablehq.com/@alexis/radar-chart-playground/3@285
function _1(md){return(
md`# radar chart playground`
)}

function _2(md){return(
md`references:  
https://observablehq.com/@rayraegah/radar-chart  
https://www.visualcinnamon.com/2015/10/different-look-d3-radar-chart/`
)}

function _chartBasic(d3,height,width,data,margin)
{
  const svg = d3.create('svg')
    .attr('height', height)
    .attr('width', width)
    .style('font-family', 'sans-serif')
    .style('font-size', 12)
  
  const config = {
    maxValue: 0.5, //What is the value that the biggest circle will represent
    levels: 5, //How many levels or inner circles should there be drawn
    roundStrokes: true, //If true the area and stroke will follow a round path (cardinal-closed
    strokeWidth: 2, //The width of the stroke around each blob
    opacityCircles: 0.1, //The opacity of the circles of each blob
    labelFactor: 1.15, //How much farther than the radius of the outer circle should the labels be placed
    wrapWidth: 60, //The number of pixels after which a label needs to be given a new line
    opacityArea: 0.35, //The opacity of the area of the blob
    dotRadius: 4 //The size of the colored circles of each blog
  }
  
  const c = d3.scaleOrdinal()
    .range(['#32CD96', '#FF5800', '#628DFF'])
  
  //If supplied maxValue is smaller than the actual one, replace by the max in the data
  const maxValue = Math.max(
    config.maxValue,
    d3.max(data, i => d3.max(i.map(o => o.value)))
  )
  
  const allAxis = data[0].map((i,j) => i.axis), //Names of each axis
        total = allAxis.length, // number of different axis
        radius = Math.min(width / 2 - margin.left / 2 - margin.right / 2, height / 2 - margin.top / 2 - margin.bottom / 2), // radius of the outermost circle 
        format = d3.format('~%'), // percentage formatting
        angleSlice = (Math.PI * 2) / total // width in radians of each slice

  const r = d3.scaleLinear()
    .domain([0, maxValue])
    .range([0, radius])
  
  const g = svg.append('g')
    .attr('transform', `translate(${width / 2},${height / 2})`)
  
  ////Filter for outside glow
  const filter = g.append('defs')
      .append('filter')
      .attr('id', 'glow'),
    feGaussianBlur = filter.append('feGaussianBlur')
      .attr('stdDeviation', '2.5')
      .attr('result', 'coloredBlur'),
    feMerge = filter.append('feMerge'),
    feMergeNode_1 = feMerge.append('feMergeNode').attr('in', 'coloredBlur'),
    feMergeNode_2 = feMerge.append('feMergeNode').attr('in', 'SourceGraphic')
  
  //// Draw the Circular grid
  const axisGrid = g.append('g')
    .attr('class', 'axisWrapper')
  
  //Draw background circles
  axisGrid.selectAll('.levels')
    .data(d3.range(1, config.levels + 1).reverse())
    .join('circle')
      .attr('class', 'gridCircle')
      .attr('r', (d,i) => (radius / config.levels) * d)
      .style('fill', '#CDCDCD')
      .style('stroke', '#CDCDCD')
      .style('fill-opacity', config.opacityCircles)
      .style('filter', 'url(#glow)')
  
  //Text indicating at what % each level is
  axisGrid.selectAll('.axisLabel')
    .data(d3.range(1, config.levels + 1).reverse())
    .join('text')
      .attr('class', 'axisLabel')
      .attr('x', 4)
      .attr('y', d => (-d * radius) / config.levels)
      .attr('dy', '0.4em')
      .style('font-size', '10px')
      .attr('fill', '#737373')
      .text(d => format((maxValue * d) / config.levels))
  
 //// Draw axes
  const axis = axisGrid.selectAll('.axis')
    .data(allAxis)
    .join('g')
      .attr('class', 'axis')
  
  axis.append('line')
    .attr('x1', 0)
    .attr('y1', 0)
    .attr('x2', (d,i) => r(maxValue * 1.1) * Math.cos(angleSlice * i - Math.PI / 2) )
    .attr('y2', (d,i) => r(maxValue * 1.1) * Math.sin(angleSlice * i - Math.PI / 2) )
    .attr('class', 'line')
    .style('stroke', 'white')
    .style('stroke-width', '2px')
  
  axis.append('text')
    .attr('class', 'legend')
    .attr('font-size', '11px')
    .attr('text-anchor', 'middle')
    .attr('dy', '0.35em')
    .attr('x', (d,i) => r(maxValue * config.labelFactor) * Math.cos(angleSlice * i - Math.PI / 2) )
    .attr('y', (d,i) => r(maxValue * config.labelFactor) * Math.sin(angleSlice * i - Math.PI / 2) )
    .text(d => d)
  
  //// Draw radar chart blobs
  const radarLine = d3.lineRadial()
    .curve(d3.curveBasisClosed)
    .radius(d => r(d.value))
    .angle((d,i) => i * angleSlice)
  
  if(config.roundStrokes){
    radarLine.curve(d3.curveCardinalClosed)
  }
  
  const blobWrapper = g.selectAll('.radarWrapper')
    .data(data)
    .join('g')
      .attr('class', 'radarWrapper')
  
  //Append backgrounds
  blobWrapper.append('path')
    .attr('class', 'radarArea')
    .attr('d', d => radarLine(d))
    .style('fill', (d,i) => c(i))
    .style('fill-opacity', config.opacityArea)
    .on('mouseover', function(d,i) {
      //Dim all blobs
      d3.selectAll('.radarArea')
        .transition()
        .duration(200)
        .style('fill-opacity', 0.1)
      //Bring back the hovered over blob
      d3.select(this)
        .transition()
        .duration(200)
        .style('fill-opacity', 0.7)
      })
    .on('mouseout', () => {
      //Bring back all blobs
      d3.selectAll('.radarArea')
        .transition()
        .duration(200)
        .style('fill-opacity', config.opacityArea)
      })
  
  //Create outlines
  blobWrapper.append('path')
    .attr('class', 'radarStroke')
    .attr('d', d => radarLine(d))
    .style('stroke-width', config.strokeWidth + 'px')
    .style('stroke', (d,i) => c(i))
    .style('fill', 'none')
    .style('filter', 'url(#glow)')
  
  //Append dots
  blobWrapper.selectAll('.radarCircle')
    .data(d => d)
    .join('circle')
      .attr('class', 'radarCircle')
      .attr('r', config.dotRadius)
      .attr('cx', (d,i) => r(d.value) * Math.cos(angleSlice * i - Math.PI / 2) )
      .attr('cy', (d,i) => r(d.value) * Math.sin(angleSlice * i - Math.PI / 2) )
      .style('fill', '#737373')
      .style('fill-opacity', 0.8)
  
  //// Append invisible circles for tooltip
  const blobCircleWrapper = g.selectAll('.radarCircleWrapper')
    .data(data)
    .join('g')
      .attr('class', 'radarCircleWrapper')
  
  //Append a set of invisible circles on top for the mouseover pop-up
  blobCircleWrapper.selectAll('.radarInvisibleCircle')
    .data(d => d)
    .join('circle')
      .attr('class', 'radarInvisibleCircle')
      .attr('r', config.dotRadius * 1.5)
      .attr('cx', (d,i) => r(d.value) * Math.cos(angleSlice * i - Math.PI / 2) )
      .attr('cy', (d,i) => r(d.value) * Math.sin(angleSlice * i - Math.PI / 2) )
      .style('fill', 'none')
      .style('pointer-events', 'all')
      .on('mouseover', function(event,d,i){
        var newX = parseFloat(d3.select(this).attr('cx')) - 10
        var newY = parseFloat(d3.select(this).attr('cy')) - 10
        
        tooltip
          .attr('x', newX)
          .attr('y', newY)
          .text(format(d.value))
          .transition()
          .duration(200)
          .style('opacity', 1)
        })
      .on('mouseout', () => {
        tooltip
          .transition()
          .duration(200)
          .style('opacity', 0)
        })
  
  const tooltip = g.append('text')
    .attr('class', 'tooltip')
    .style('opacity', 0)
  
  return svg.node()
}


function _chartClean(d3,height,width,data,margin)
{
  const svg = d3.create('svg')
    .attr('height', height)
    .attr('width', width)
    .style('font-family', 'sans-serif')
    .style('font-size', 12)
  
  const config = {
    maxValue: 0.5, //What is the value that the biggest circle will represent
    levels: 5, //How many levels or inner circles should there be drawn
    roundStrokes: false, //If true the area and stroke will follow a round path (cardinal-closed
    strokeWidth: 2, //The width of the stroke around each blob
    opacityCircles: 0.1, //The opacity of the circles of each blob
    labelFactor: 1.15, //How much farther than the radius of the outer circle should the labels be placed
    wrapWidth: 60, //The number of pixels after which a label needs to be given a new line
    opacityArea: 0.0, //The opacity of the area of the blob
    dotRadius: 4 //The size of the colored circles of each blog
  }
  
  const c = d3.scaleOrdinal()
    .range(['#EDC951', '#CC333F', '#00A0B0'])
  
  //If supplied maxValue is smaller than the actual one, replace by the max in the data
  const maxValue = Math.max(
    config.maxValue,
    d3.max(data, i => d3.max(i.map(o => o.value)))
  )
  
  const allAxis = data[0].map((i,j) => i.axis), //Names of each axis
        total = allAxis.length, // number of different axis
        radius = Math.min(width / 2 - margin.left / 2 - margin.right / 2, height / 2 - margin.top / 2 - margin.bottom / 2), // radius of the outermost circle 
        format = d3.format('~%'), // percentage formatting
        angleSlice = (Math.PI * 2) / total // width in radians of each slice

  const r = d3.scaleLinear()
    .domain([0, maxValue])
    .range([0, radius])
  
  const g = svg.append('g')
    .attr('transform', `translate(${width / 2},${height / 2})`)
  
  //// Draw the Circular grid
  const axisGrid = g.append('g')
    .attr('class', 'axisWrapper')
  
  //Draw background circles
  axisGrid.selectAll('.levels')
    .data(d3.range(1, config.levels + 1).reverse())
    .join('circle')
      .attr('class', 'gridCircle')
      .attr('r', (d,i) => (radius / config.levels) * d)
      .style('fill', 'none')
      .style('stroke', '#CDCDCD')
      .style('fill-opacity', config.opacityCircles)
  
  //Text indicating at what % each level is
  axisGrid.selectAll('.axisLabel')
    .data(d3.range(1, config.levels + 1).reverse())
    .join('text')
      .attr('class', 'axisLabel')
      .attr('x', 4)
      .attr('y', d => (-d * radius) / config.levels)
      .attr('dy', '0.4em')
      .style('font-size', '10px')
      .style('fill', '#737373')
      .text(d => format((maxValue * d) / config.levels))
  
 //// Draw axes
  const axis = axisGrid.selectAll('.axis')
    .data(allAxis)
    .join('g')
      .attr('class', 'axis')
  
  axis.append('line')
    .attr('x1', 0)
    .attr('y1', 0)
    .attr('x2', (d,i) => r(maxValue * 1.03) * Math.cos(angleSlice * i - Math.PI / 2) )
    .attr('y2', (d,i) => r(maxValue * 1.03) * Math.sin(angleSlice * i - Math.PI / 2) )
    .attr('class', 'line')
    .style('stroke', '#CDCDCD')
    .style('stroke-width', '1px')
  
  axis.append('text')
    .attr('class', 'legend')
    .attr('font-size', '11px')
    .attr('text-anchor', 'middle')
    .attr('dy', '0.35em')
    .attr('x', (d,i) => r(maxValue * config.labelFactor) * Math.cos(angleSlice * i - Math.PI / 2) )
    .attr('y', (d,i) => r(maxValue * config.labelFactor) * Math.sin(angleSlice * i - Math.PI / 2) )
    .text(d => d)
  
  //// Draw radar chart blobs
  const radarLine = d3.lineRadial()
    .curve(d3.curveLinearClosed)
    .radius(d => r(d.value))
    .angle((d,i) => i * angleSlice)
  
  if(config.roundStrokes){
    radarLine.curve(d3.curveCatmullRomClosed.alpha(1))
  }
  
  const blobWrapper = g.selectAll('.radarWrapper2')
    .data(data)
    .join('g')
      .attr('class', 'radarWrapper2')
  
  //Append backgrounds
  blobWrapper.append('path')
    .attr('class', 'radarArea2')
    .attr('d', d => radarLine(d))
    .style('fill', (d,i) => c(i))
    .style('fill-opacity', config.opacityArea)
    .on('mouseover', function(d) {
      //Dim all blobs
      d3.selectAll('.radarArea2')
        .transition()
        .duration(200)
        .style('fill-opacity', Math.min(0.1, config.opacityArea))
      //Bring back the hovered over blob
      d3.select(this)
        .transition()
        .duration(200)
        .style('fill-opacity', Math.max(0.7, config.opacityArea))
      })
    .on('mouseout', () => {
      //Bring back all blobs
      d3.selectAll('.radarArea2')
        .transition()
        .duration(200)
        .style('fill-opacity', config.opacityArea)
      })
  
  //Create outlines
  blobWrapper.append('path')
    .attr('class', 'radarStroke')
    .attr('d', d => radarLine(d))
    .style('stroke-width', config.strokeWidth + 'px')
    .style('stroke', (d,i) => c(i))
    .style('fill', 'none')
  
  //Append dots
  blobWrapper.selectAll('.radarCircle')
    .data(d => d)
    .join('circle')
      .attr('class', 'radarCircle')
      .attr('r', config.dotRadius)
      .attr('cx', (d,i) => r(d.value) * Math.cos(angleSlice * i - Math.PI / 2) )
      .attr('cy', (d,i) => r(d.value) * Math.sin(angleSlice * i - Math.PI / 2) )
      .style('fill', '#737373')
      .style('fill-opacity', 0.8)
  
  //// Append invisible circles for tooltip
  const blobCircleWrapper = g.selectAll('.radarCircleWrapper')
    .data(data)
    .join('g')
      .attr('class', 'radarCircleWrapper')
  
  //Append a set of invisible circles on top for the mouseover pop-up
  blobCircleWrapper.selectAll('.radarInvisibleCircle')
    .data(d => d)
    .join('circle')
      .attr('class', 'radarInvisibleCircle')
      .attr('r', config.dotRadius * 1.5)
      .attr('cx', (d,i) => r(d.value) * Math.cos(angleSlice * i - Math.PI / 2) )
      .attr('cy', (d,i) => r(d.value) * Math.sin(angleSlice * i - Math.PI / 2) )
      .style('fill', 'none')
      .style('pointer-events', 'all')
      .on('mouseover', function(event,d,i){
        var newX = parseFloat(d3.select(this).attr('cx')) - 10
        var newY = parseFloat(d3.select(this).attr('cy')) - 10
        
        tooltip
          .attr('x', newX)
          .attr('y', newY)
          .text(format(d.value))
          .transition()
          .duration(200)
          .style('opacity', 1)
        })
      .on('mouseout', () => {
        tooltip
          .transition()
          .duration(200)
          .style('opacity', 0)
        })
  
  const tooltip = g.append('text')
    .attr('class', 'tooltip')
    .style('opacity', 0)
  
  return svg.node()
}


function _chartWatercolor(d3,height,width,data,margin)
{
  const svg = d3.create('svg')
    .attr('height', height)
    .attr('width', width)
    .style('font-family', 'sans-serif')
    .style('font-size', 12)
  
  const config = {
    maxValue: 0.5, //What is the value that the biggest circle will represent
    levels: 5, //How many levels or inner circles should there be drawn
    roundStrokes: true, //If true the area and stroke will follow a round path (cardinal-closed
    strokeWidth: 2, //The width of the stroke around each blob
    opacityCircles: 0.1, //The opacity of the circles of each blob
    labelFactor: 1.15, //How much farther than the radius of the outer circle should the labels be placed
    wrapWidth: 60, //The number of pixels after which a label needs to be given a new line
    opacityArea: 0.1, //The opacity of the area of the blob
    dotRadius: 4 //The size of the colored circles of each blog
  }
  
  const defs = svg.append('defs')
   
  // pencil filter
  const pencilFilter = defs.append('filter')
    .attr('id', 'pencilTexture2')
    .attr('width','5000%')
    .attr('height','5000%')
    .attr('x','-2000%')
    .attr('y','-2000%')
    .attr('filterUnits','objectBoundingBox')
  pencilFilter.append('feGaussianBlur') // glow of original line
    .attr('stdDeviation', '1.1')
    .attr('result', 'coloredBlur')
  pencilFilter.append('feTurbulence')
    .attr('type','fractalNoise')
    .attr('baseFrequency', .02)
    .attr('numOctaves', 5)
    .attr('stitchTiles', 'stitch')
    .attr('result', 't1')
  pencilFilter.append('feColorMatrix')
    .attr('type','matrix')
    .attr('values','0 0 0 0 0, 0 0 0 0 0, 0 0 0 0 0, 0 0 0 -1.4 1.3')
    .attr('result','t2')
  pencilFilter.append('feComposite')
    .attr('operator','in')
    .attr('in','SourceGraphic')
    .attr('in2','t2')
    .attr('result','SourceTextured')
  pencilFilter.append('feTurbulence')
    .attr('type','fractalNoise')
    .attr('baseFrequency', .05)
    .attr('numOctaves', 5)
    .attr('seed', '1')
    .attr('result', 'f1')
  pencilFilter.append('feDisplacementMap')
    .attr('xChannelSelector','R')
    .attr('yChannelSelector', 'G')
    .attr('scale', 20)
    .attr('in', 'SourceTextured')
    .attr('in2', 'f1')
    .attr('result', 'f4')
  pencilFilter.append('feTurbulence')
    .attr('type','fractalNoise')
    .attr('baseFrequency', .05)
    .attr('numOctaves', 5)
    .attr('seed', '10')
    .attr('result', 'f2')
  pencilFilter.append('feDisplacementMap')
    .attr('xChannelSelector','R')
    .attr('yChannelSelector', 'G')
    .attr('scale', 20)
    .attr('in', 'SourceTextured')
    .attr('in2', 'f2')
    .attr('result', 'f5')
  pencilFilter.append('feTurbulence')
    .attr('type','fractalNoise')
    .attr('baseFrequency', 1)
    .attr('numOctaves', 5)
    .attr('seed', '100')
    .attr('result', 'f3')
  pencilFilter.append('feDisplacementMap')
    .attr('xChannelSelector','R')
    .attr('yChannelSelector', 'G')
    .attr('scale', 20)
    .attr('in', 'SourceTextured')
    .attr('in2', 'f3')
    .attr('result', 'f6')
  pencilFilter.append('feBlend')
    .attr('mode','multiply')
    .attr('in', 'f5')
    .attr('in2', 'f4')
    .attr('result', 'out1')
  pencilFilter.append('feBlend')
    .attr('mode','multiply')
    .attr('in', 'out1')
    .attr('in2', 'f6')
    .attr('result', 'out2')
  // ---
  
  const c = d3.scaleOrdinal()
    .range(['#EDC951', '#CC333F', '#00A0B0'])
  
  //If supplied maxValue is smaller than the actual one, replace by the max in the data
  const maxValue = Math.max(
    config.maxValue,
    d3.max(data, i => d3.max(i.map(o => o.value)))
  )
  
  const allAxis = data[0].map((i,j) => i.axis), //Names of each axis
        total = allAxis.length, // number of different axis
        radius = Math.min(width / 2 - margin.left / 2 - margin.right / 2, height / 2 - margin.top / 2 - margin.bottom / 2), // radius of the outermost circle 
        format = d3.format('~%'), // percentage formatting
        angleSlice = (Math.PI * 2) / total // width in radians of each slice

  const r = d3.scaleLinear()
    .domain([0, maxValue])
    .range([0, radius])
  
  const g = svg.append('g')
    .attr('transform', `translate(${width / 2},${height / 2})`)
  
  //// Draw the Circular grid
  const axisGrid = g.append('g')
    .attr('class', 'axisWrapper')
  
  //Draw background circles
  axisGrid.selectAll('.levels')
    .data(d3.range(1, config.levels + 1).reverse())
    .join('circle')
      .attr('class', 'gridCircle')
      .attr('r', (d,i) => (radius / config.levels) * d)
      .style('fill', '#CDCDCD')
      .style('stroke', '#CDCDCD')
      .style('fill-opacity', config.opacityCircles)
  
  //Text indicating at what % each level is
  axisGrid.selectAll('.axisLabel')
    .data(d3.range(1, config.levels + 1).reverse())
    .join('text')
      .attr('class', 'axisLabel')
      .attr('x', 4)
      .attr('y', d => (-d * radius) / config.levels)
      .attr('dy', '0.4em')
      .style('font-size', '10px')
      .style('fill', '#737373')
      .text(d => format((maxValue * d) / config.levels))
  
 //// Draw axes
  const axis = axisGrid.selectAll('.axis')
    .data(allAxis)
    .join('g')
      .attr('class', 'axis')
  
  axis.append('line')
    .attr('x1', 0)
    .attr('y1', 0)
    .attr('x2', (d,i) => r(maxValue * 1.03) * Math.cos(angleSlice * i - Math.PI / 2) )
    .attr('y2', (d,i) => r(maxValue * 1.03) * Math.sin(angleSlice * i - Math.PI / 2) )
    .attr('class', 'line')
    .style('stroke', '#CDCDCD')
    .style('stroke-width', '1px')
  
  axis.append('text')
    .attr('class', 'legend')
    .attr('font-size', '11px')
    .attr('text-anchor', 'middle')
    .attr('dy', '0.35em')
    .attr('x', (d,i) => r(maxValue * config.labelFactor) * Math.cos(angleSlice * i - Math.PI / 2) )
    .attr('y', (d,i) => r(maxValue * config.labelFactor) * Math.sin(angleSlice * i - Math.PI / 2) )
    .text(d => d)
  
  //// Draw radar chart blobs
  const radarLine = d3.lineRadial()
    .curve(d3.curveLinearClosed)
    .radius(d => r(d.value))
    .angle((d,i) => i * angleSlice)
  
  if(config.roundStrokes){
    radarLine.curve(d3.curveCatmullRomClosed.alpha(1))
  }
  
  const blobWrapper = g.selectAll('.radarWrapper2')
    .data(data)
    .join('g')
      .attr('class', 'radarWrapper2')
  
  //Append backgrounds
  blobWrapper.append('path')
    .attr('class', 'radarArea2')
    .attr('d', d => radarLine(d))
    .style('fill', (d,i) => c(i))
    .style('fill-opacity', config.opacityArea)
    .attr('filter', 'url(#pencilTexture2)')
    .on('mouseover', function(d) {
      //Dim all blobs
      d3.selectAll('.radarArea2')
        .transition()
        .duration(200)
        .style('fill-opacity', Math.min(0.1, config.opacityArea))
      //Bring back the hovered over blob
      d3.select(this)
        .transition()
        .duration(200)
        .style('fill-opacity', Math.max(0.7, config.opacityArea))
      })
    .on('mouseout', () => {
      //Bring back all blobs
      d3.selectAll('.radarArea2')
        .transition()
        .duration(200)
        .style('fill-opacity', config.opacityArea)
      })
  
  //Create outlines
  blobWrapper.append('path')
    .attr('class', 'radarStroke')
    .attr('d', d => radarLine(d))
    .style('stroke-width', config.strokeWidth + 'px')
    .style('stroke', (d,i) => c(i))
    .style('fill', 'none')
    .attr('filter', 'url(#pencilTexture2)')
  
  //Append dots
  blobWrapper.selectAll('.radarCircle')
    .data(d => d)
    .join('circle')
      .attr('class', 'radarCircle')
      .attr('r', config.dotRadius)
      .attr('cx', (d,i) => r(d.value) * Math.cos(angleSlice * i - Math.PI / 2) )
      .attr('cy', (d,i) => r(d.value) * Math.sin(angleSlice * i - Math.PI / 2) )
      .style('fill', '#737373')
      .style('fill-opacity', 0.8)
  
  //// Append invisible circles for tooltip
  const blobCircleWrapper = g.selectAll('.radarCircleWrapper')
    .data(data)
    .join('g')
      .attr('class', 'radarCircleWrapper')
  
  //Append a set of invisible circles on top for the mouseover pop-up
  blobCircleWrapper.selectAll('.radarInvisibleCircle')
    .data(d => d)
    .join('circle')
      .attr('class', 'radarInvisibleCircle')
      .attr('r', config.dotRadius * 1.5)
      .attr('cx', (d,i) => r(d.value) * Math.cos(angleSlice * i - Math.PI / 2) )
      .attr('cy', (d,i) => r(d.value) * Math.sin(angleSlice * i - Math.PI / 2) )
      .style('fill', 'none')
      .style('pointer-events', 'all')
      .on('mouseover', function(event,d,i){
        var newX = parseFloat(d3.select(this).attr('cx')) - 10
        var newY = parseFloat(d3.select(this).attr('cy')) - 10
        
        tooltip
          .attr('x', newX)
          .attr('y', newY)
          .text(format(d.value))
          .transition()
          .duration(200)
          .style('opacity', 1)
        })
      .on('mouseout', () => {
        tooltip
          .transition()
          .duration(200)
          .style('opacity', 0)
        })
  
  const tooltip = g.append('text')
    .attr('class', 'tooltip')
    .style('opacity', 0)
  
  return svg.node()
}


function _chartPencil(d3,height,width,data,margin)
{
  const svg = d3.create('svg')
    .attr('height', height)
    .attr('width', width)
    .style('font-family', 'sans-serif')
    .style('font-size', 12)
  
  const config = {
    maxValue: 0.5, //What is the value that the biggest circle will represent
    levels: 5, //How many levels or inner circles should there be drawn
    roundStrokes: true, //If true the area and stroke will follow a round path (cardinal-closed
    strokeWidth: 2, //The width of the stroke around each blob
    opacityCircles: 0.1, //The opacity of the circles of each blob
    labelFactor: 1.15, //How much farther than the radius of the outer circle should the labels be placed
    wrapWidth: 60, //The number of pixels after which a label needs to be given a new line
    opacityArea: 0.1, //The opacity of the area of the blob
    dotRadius: 4 //The size of the colored circles of each blog
  }
  
  const defs = svg.append('defs')
  
  // pencil filter
  const pencilFilter = defs.append('filter')
    .attr('id', 'pencilTextureClean')
    .attr('width','140%')
    .attr('height','140%')
    .attr('x','-20%')
    .attr('y','-20%')
    .attr('filterUnits','objectBoundingBox')
  pencilFilter.append('feTurbulence')
    .attr('type','fractalNoise')
    .attr('baseFrequency', 2)
    .attr('numOctaves', 5)
    .attr('stitchTiles', 'stitch')
    .attr('result', 't1')
  pencilFilter.append('feColorMatrix')
    .attr('type','matrix')
    .attr('values','0 0 0 0 0, 0 0 0 0 0, 0 0 0 0 0, 0 0 0 -1.5 1.5')
    .attr('result','t2')
  pencilFilter.append('feComposite')
    .attr('operator','in')
    .attr('in','SourceGraphic')
    .attr('in2','t2')
    .attr('result','SourceTextured')
  pencilFilter.append('feTurbulence')
    .attr('type','fractalNoise')
    .attr('baseFrequency', .03)
    .attr('numOctaves', 5)
    .attr('seed', '1')
    .attr('result', 'f1')
  pencilFilter.append('feDisplacementMap')
    .attr('xChannelSelector','R')
    .attr('yChannelSelector', 'G')
    .attr('scale', 5)
    .attr('in', 'SourceTextured')
    .attr('in2', 'f1')
    .attr('result', 'f4')
  pencilFilter.append('feTurbulence')
    .attr('type','fractalNoise')
    .attr('baseFrequency', .03)
    .attr('numOctaves', 5)
    .attr('seed', '10')
    .attr('result', 'f2')
  pencilFilter.append('feDisplacementMap')
    .attr('xChannelSelector','R')
    .attr('yChannelSelector', 'G')
    .attr('scale', 5)
    .attr('in', 'SourceTextured')
    .attr('in2', 'f2')
    .attr('result', 'f5')
  pencilFilter.append('feTurbulence')
    .attr('type','fractalNoise')
    .attr('baseFrequency', .03)
    .attr('numOctaves', 5)
    .attr('seed', '100')
    .attr('result', 'f3')
  pencilFilter.append('feDisplacementMap')
    .attr('xChannelSelector','R')
    .attr('yChannelSelector', 'G')
    .attr('scale', 3)
    .attr('in', 'SourceTextured')
    .attr('in2', 'f3')
    .attr('result', 'f6')
  pencilFilter.append('feBlend')
    .attr('mode','multiply')
    .attr('in', 'f5')
    .attr('in2', 'f4')
    .attr('result', 'out1')
  pencilFilter.append('feBlend')
    .attr('mode','multiply')
    .attr('in', 'out1')
    .attr('in2', 'f6')
    .attr('result', 'out2')
  // ---
  
  const c = d3.scaleOrdinal()
    .range(['#EDC951', '#CC333F', '#00A0B0'])
  
  // hatching pattern (gradient)
  defs
    .selectAll('pattern')
    .data(data)
    .join('pattern')
      .attr('width',4)
      .attr('height',4)
      .attr('patternUnits','userSpaceOnUse')
      .attr('id', (d,i) => 'hatchingPencil-' + i)
      .append('path')
      .attr('d',"M-1,1 l2,-2 M0,4 l4,-4  M3,5 l2,-2")
      .style('stroke', (d,i) => c(i))
      .style('stroke-width', 1)
  // ---
  
  //If supplied maxValue is smaller than the actual one, replace by the max in the data
  const maxValue = Math.max(
    config.maxValue,
    d3.max(data, i => d3.max(i.map(o => o.value)))
  )
  
  const allAxis = data[0].map((i,j) => i.axis), //Names of each axis
        total = allAxis.length, // number of different axis
        radius = Math.min(width / 2 - margin.left / 2 - margin.right / 2, height / 2 - margin.top / 2 - margin.bottom / 2), // radius of the outermost circle 
        format = d3.format('~%'), // percentage formatting
        angleSlice = (Math.PI * 2) / total // width in radians of each slice

  const r = d3.scaleLinear()
    .domain([0, maxValue])
    .range([0, radius])
  
  const g = svg.append('g')
    .attr('transform', `translate(${width / 2},${height / 2})`)
  
  //// Draw the Circular grid
  const axisGrid = g.append('g')
    .attr('class', 'axisWrapper')
  
  //Draw background circles
  axisGrid.selectAll('.levels')
    .data(d3.range(1, config.levels + 1).reverse())
    .join('circle')
      .attr('class', 'gridCircle')
      .attr('r', (d,i) => (radius / config.levels) * d)
      .style('fill', '#CDCDCD')
      .style('stroke', '#CDCDCD')
      .style('fill-opacity', config.opacityCircles)
      .attr('filter', 'url(#pencilTextureClean)')
  
  //Text indicating at what % each level is
  axisGrid.selectAll('.axisLabel')
    .data(d3.range(1, config.levels + 1).reverse())
    .join('text')
      .attr('class', 'axisLabel')
      .attr('x', 4)
      .attr('y', d => (-d * radius) / config.levels)
      .attr('dy', '0.4em')
      .style('font-size', '10px')
      .style('fill', '#737373')
      .text(d => format((maxValue * d) / config.levels))
  
 //// Draw axes
  const axis = axisGrid.selectAll('.axis')
    .data(allAxis)
    .join('g')
      .attr('class', 'axis')
  
  axis.append('line')
    .attr('x1', 0)
    .attr('y1', 0)
    .attr('x2', (d,i) => r(maxValue * 1.03) * Math.cos(angleSlice * i - Math.PI / 2) )
    .attr('y2', (d,i) => r(maxValue * 1.03) * Math.sin(angleSlice * i - Math.PI / 2) )
    .attr('class', 'line')
    .style('stroke', '#CDCDCD')
    .style('stroke-width', '1px')
    .attr('filter', 'url(#pencilTextureClean)')
  
  axis.append('text')
    .attr('class', 'legend')
    .attr('font-size', '11px')
    .attr('text-anchor', 'middle')
    .attr('dy', '0.35em')
    .attr('x', (d,i) => r(maxValue * config.labelFactor) * Math.cos(angleSlice * i - Math.PI / 2) )
    .attr('y', (d,i) => r(maxValue * config.labelFactor) * Math.sin(angleSlice * i - Math.PI / 2) )
    .text(d => d)
  
  //// Draw radar chart blobs
  const radarLine = d3.lineRadial()
    .curve(d3.curveLinearClosed)
    .radius(d => r(d.value))
    .angle((d,i) => i * angleSlice)
  
  if(config.roundStrokes){
    radarLine.curve(d3.curveCatmullRomClosed.alpha(1))
  }
  
  const blobWrapper = g.selectAll('.radarWrapper2')
    .data(data)
    .join('g')
      .attr('class', 'radarWrapper2')
  
  //Append backgrounds
  blobWrapper.append('path')
    .attr('class', 'radarArea2')
    .attr('d', d => radarLine(d))
    .attr('fill', (d,i) => 'url(#hatchingPencil-'+ i +')')
    .style('fill-opacity', config.opacityArea)
    .attr('filter', 'url(#pencilTextureClean)')
    .on('mouseover', function(d) {
      //Dim all blobs
      d3.selectAll('.radarArea2')
        .transition()
        .duration(200)
        .style('fill-opacity', Math.min(0.1, config.opacityArea))
      //Bring back the hovered over blob
      d3.select(this)
        .transition()
        .duration(200)
        .style('fill-opacity', Math.max(0.7, config.opacityArea))
      })
    .on('mouseout', () => {
      //Bring back all blobs
      d3.selectAll('.radarArea2')
        .transition()
        .duration(200)
        .style('fill-opacity', config.opacityArea)
      })
  
  //Create outlines
  blobWrapper.append('path')
    .attr('class', 'radarStroke')
    .attr('d', d => radarLine(d))
    .style('stroke-width', config.strokeWidth + 'px')
    .style('stroke', (d,i) => c(i))
    .style('fill', 'none')
    .attr('filter', 'url(#pencilTextureClean)')
  
  //Append dots
  blobWrapper.selectAll('.radarCircle')
    .data(d => d)
    .join('circle')
      .attr('class', 'radarCircle')
      .attr('r', config.dotRadius)
      .attr('cx', (d,i) => r(d.value) * Math.cos(angleSlice * i - Math.PI / 2) )
      .attr('cy', (d,i) => r(d.value) * Math.sin(angleSlice * i - Math.PI / 2) )
      .style('fill', '#737373')
      .style('fill-opacity', 0.8)
      .attr('filter', 'url(#pencilTextureClean)')
  
  //// Append invisible circles for tooltip
  const blobCircleWrapper = g.selectAll('.radarCircleWrapper')
    .data(data)
    .join('g')
      .attr('class', 'radarCircleWrapper')
  
  //Append a set of invisible circles on top for the mouseover pop-up
  blobCircleWrapper.selectAll('.radarInvisibleCircle')
    .data(d => d)
    .join('circle')
      .attr('class', 'radarInvisibleCircle')
      .attr('r', config.dotRadius * 1.5)
      .attr('cx', (d,i) => r(d.value) * Math.cos(angleSlice * i - Math.PI / 2) )
      .attr('cy', (d,i) => r(d.value) * Math.sin(angleSlice * i - Math.PI / 2) )
      .style('fill', 'none')
      .style('pointer-events', 'all')
      .on('mouseover', function(event,d,i){
        var newX = parseFloat(d3.select(this).attr('cx')) - 10
        var newY = parseFloat(d3.select(this).attr('cy')) - 10
        
        tooltip
          .attr('x', newX)
          .attr('y', newY)
          .text(format(d.value))
          .transition()
          .duration(200)
          .style('opacity', 1)
        })
      .on('mouseout', () => {
        tooltip
          .transition()
          .duration(200)
          .style('opacity', 0)
        })
  
  const tooltip = g.append('text')
    .attr('class', 'tooltip')
    .style('opacity', 0)
  
  return svg.node()
}


function _chartInnerGlow(d3,height,width,data,margin)
{
  const svg = d3.create('svg')
    .attr('height', height)
    .attr('width', width)
    .style('font-family', 'sans-serif')
    .style('font-size', 12)
  
  const config = {
    maxValue: 0.5, //What is the value that the biggest circle will represent
    levels: 5, //How many levels or inner circles should there be drawn
    roundStrokes: true, //If true the area and stroke will follow a round path (cardinal-closed
    strokeWidth: 8, //The width of the stroke around each blob
    opacityCircles: 0.1, //The opacity of the circles of each blob
    labelFactor: 1.15, //How much farther than the radius of the outer circle should the labels be placed
    wrapWidth: 60, //The number of pixels after which a label needs to be given a new line
    opacityArea: 0.0, //The opacity of the area of the blob
    dotRadius: 4 //The size of the colored circles of each blog
  }
  
  const c = d3.scaleOrdinal()
    .range(['#EDC951', '#CC333F', '#00A0B0'])
  
  //If supplied maxValue is smaller than the actual one, replace by the max in the data
  const maxValue = Math.max(
    config.maxValue,
    d3.max(data, i => d3.max(i.map(o => o.value)))
  )
  
  const allAxis = data[0].map((i,j) => i.axis), //Names of each axis
        total = allAxis.length, // number of different axis
        radius = Math.min(width / 2 - margin.left / 2 - margin.right / 2, height / 2 - margin.top / 2 - margin.bottom / 2), // radius of the outermost circle 
        format = d3.format('~%'), // percentage formatting
        angleSlice = (Math.PI * 2) / total // width in radians of each slice

  const r = d3.scaleLinear()
    .domain([0, maxValue])
    .range([0, radius])
  
  const g = svg.append('g')
    .attr('transform', `translate(${width / 2},${height / 2})`)
  
  //// Draw the Circular grid
  const axisGrid = g.append('g')
    .attr('class', 'axisWrapper')
  
  //Draw background circles
  axisGrid.selectAll('.levels')
    .data(d3.range(1, config.levels + 1).reverse())
    .join('circle')
      .attr('class', 'gridCircle')
      .attr('r', (d,i) => (radius / config.levels) * d)
      .style('fill', 'none')
      .style('stroke', '#CDCDCD')
      .style('fill-opacity', config.opacityCircles)
  
  //Text indicating at what % each level is
  axisGrid.selectAll('.axisLabel')
    .data(d3.range(1, config.levels + 1).reverse())
    .join('text')
      .attr('class', 'axisLabel')
      .attr('x', 4)
      .attr('y', d => (-d * radius) / config.levels)
      .attr('dy', '0.4em')
      .style('font-size', '10px')
      .style('fill', '#737373')
      .text(d => format((maxValue * d) / config.levels))
  
 //// Draw axes
  const axis = axisGrid.selectAll('.axis')
    .data(allAxis)
    .join('g')
      .attr('class', 'axis')
  
  axis.append('line')
    .attr('x1', 0)
    .attr('y1', 0)
    .attr('x2', (d,i) => r(maxValue * 1.03) * Math.cos(angleSlice * i - Math.PI / 2) )
    .attr('y2', (d,i) => r(maxValue * 1.03) * Math.sin(angleSlice * i - Math.PI / 2) )
    .attr('class', 'line')
    .style('stroke', '#CDCDCD')
    .style('stroke-width', '1px')
  
  axis.append('text')
    .attr('class', 'legend')
    .attr('font-size', '11px')
    .attr('text-anchor', 'middle')
    .attr('dy', '0.35em')
    .attr('x', (d,i) => r(maxValue * config.labelFactor) * Math.cos(angleSlice * i - Math.PI / 2) )
    .attr('y', (d,i) => r(maxValue * config.labelFactor) * Math.sin(angleSlice * i - Math.PI / 2) )
    .text(d => d)
  
  //// Draw radar chart blobs
  const radarLine = d3.lineRadial()
    .curve(d3.curveLinearClosed)
    .radius(d => r(d.value))
    .angle((d,i) => i * angleSlice)
  
  if(config.roundStrokes){
    radarLine.curve(d3.curveCatmullRomClosed.alpha(1))
  }
  
  // inner glow effect
  const inverseArea = d3.areaRadial()
    .curve(d3.curveCatmullRomClosed.alpha(1))
    .innerRadius(d => r(d.value))
    .outerRadius(0)
    .angle((d,i) => i * angleSlice)
  
  const defs = svg.append("defs")

  const filter = defs.append("filter")
    .attr("id", 'blur2')
  
  filter.append("feGaussianBlur")
    .attr("stdDeviation", 15)
    .attr("result","blur2")
  
  const feMerge = filter.append("feMerge")
	feMerge.append("feMergeNode").attr("in","blur")
	feMerge.append("feMergeNode").attr("in","SourceGraphic")

  defs
    .selectAll('clipPath')
    .data(data)
    .join('clipPath')
      .attr('id',  (d,i) => 'clipPath-' + i)
    .append("path")
      .attr("d", d => inverseArea(d))
  // ---
  
  const blobWrapper = g.selectAll('.radarWrapper2')
    .data(data)
    .join('g')
      .attr('class', 'radarWrapper2')
  
  //Append backgrounds
  blobWrapper.append('path')
    .attr('class', 'radarArea2')
    .attr('d', d => radarLine(d))
    .attr('fill', (d,i) => c(i))
    .style('fill-opacity', config.opacityArea)
    .on('mouseover', function(d) {
      //Dim all blobs
      d3.selectAll('.radarArea2')
        .transition()
        .duration(200)
        .style('fill-opacity', Math.min(0.1, config.opacityArea))
      //Bring back the hovered over blob
      d3.select(this)
        .transition()
        .duration(200)
        .style('fill-opacity', Math.max(0.7, config.opacityArea))
      })
    .on('mouseout', () => {
      //Bring back all blobs
      d3.selectAll('.radarArea2')
        .transition()
        .duration(200)
        .style('fill-opacity', config.opacityArea)
      })
  
  //Create outlines
  blobWrapper.append('path')
    .attr('class', 'radarStroke')
    .attr('d', d => radarLine(d))
    .style('stroke-width', config.strokeWidth + 'px')
    .style('stroke', (d,i) => c(i))
    .style('fill', 'none')
    .attr("filter", 'url(#blur2)')
    .attr("clip-path", (d,i) => 'url(#clipPath-'+ i +')')
  
  //Append dots
  blobWrapper.selectAll('.radarCircle')
    .data(d => d)
    .join('circle')
      .attr('class', 'radarCircle')
      .attr('r', config.dotRadius)
      .attr('cx', (d,i) => r(d.value) * Math.cos(angleSlice * i - Math.PI / 2) )
      .attr('cy', (d,i) => r(d.value) * Math.sin(angleSlice * i - Math.PI / 2) )
      .style('fill', '#737373')
      .style('fill-opacity', 0.8)
  
  //// Append invisible circles for tooltip
  const blobCircleWrapper = g.selectAll('.radarCircleWrapper')
    .data(data)
    .join('g')
      .attr('class', 'radarCircleWrapper')
  
  //Append a set of invisible circles on top for the mouseover pop-up
  blobCircleWrapper.selectAll('.radarInvisibleCircle')
    .data(d => d)
    .join('circle')
      .attr('class', 'radarInvisibleCircle')
      .attr('r', config.dotRadius * 1.5)
      .attr('cx', (d,i) => r(d.value) * Math.cos(angleSlice * i - Math.PI / 2) )
      .attr('cy', (d,i) => r(d.value) * Math.sin(angleSlice * i - Math.PI / 2) )
      .style('fill', 'none')
      .style('pointer-events', 'all')
      .on('mouseover', function(event,d,i){
        var newX = parseFloat(d3.select(this).attr('cx')) - 10
        var newY = parseFloat(d3.select(this).attr('cy')) - 10
        
        tooltip
          .attr('x', newX)
          .attr('y', newY)
          .text(format(d.value))
          .transition()
          .duration(200)
          .style('opacity', 1)
        })
      .on('mouseout', () => {
        tooltip
          .transition()
          .duration(200)
          .style('opacity', 0)
        })
  
  const tooltip = g.append('text')
    .attr('class', 'tooltip')
    .style('opacity', 0)
  
  return svg.node()
}


function _8(md){return(
md`___`
)}

function _9(data){return(
data[0]
)}

function _data(){return(
[
    [
      //Grecia
      { axis: "Liderazgo", value: 0.2 },
      { axis: "Arquitectura de Software", value: 0.2 },
      { axis: "Ciencia de datos", value: 0.2 },
      { axis: "Diseño e Interfaz", value: 0.1 },
      { axis: "Desarrollo Front-end", value: 0.8 },
      { axis: "Desarrollo Backend", value: 0.5 }
    ]
  ]
)}

function _11(md){return(
md`___`
)}

function _margin(){return(
{top:50, bottom:50, left:50, right:50}
)}

function _width(){return(
400
)}

function _height(){return(
400
)}

function _d3(require){return(
require('d3@6')
)}

function __(require){return(
require('lodash')
)}

function _chroma(require){return(
require('chroma-js')
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md"], _2);
  main.variable(observer("chartBasic")).define("chartBasic", ["d3","height","width","data","margin"], _chartBasic);
  main.variable(observer("chartClean")).define("chartClean", ["d3","height","width","data","margin"], _chartClean);
  main.variable(observer("chartWatercolor")).define("chartWatercolor", ["d3","height","width","data","margin"], _chartWatercolor);
  main.variable(observer("chartPencil")).define("chartPencil", ["d3","height","width","data","margin"], _chartPencil);
  main.variable(observer("chartInnerGlow")).define("chartInnerGlow", ["d3","height","width","data","margin"], _chartInnerGlow);
  main.variable(observer()).define(["md"], _8);
  main.variable(observer()).define(["data"], _9);
  main.variable(observer("data")).define("data", _data);
  main.variable(observer()).define(["md"], _11);
  main.variable(observer("margin")).define("margin", _margin);
  main.variable(observer("width")).define("width", _width);
  main.variable(observer("height")).define("height", _height);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  main.variable(observer("_")).define("_", ["require"], __);
  main.variable(observer("chroma")).define("chroma", ["require"], _chroma);
  return main;
}
