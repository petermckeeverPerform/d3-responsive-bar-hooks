import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import "./Responsive.css";
import debounce from "lodash.debounce";

const sample = [
  {category: "A", quantity: 40},
  {category: "B", quantity: 151},
  {category: "C", quantity: 89},
  {category: "D", quantity: 124}
]

const Chart = () => {

  const d3Chart = useRef()

  const [dimensions, setDimensions] = useState({
      width: null,
      height: null,
      resize: false
  })

  const update = useRef(false)

  useEffect(() => {
    const resize = () => {
      if (window.innerWidth > 800) {
          setDimensions({
              width: 800,
              height: 400,
              resize: true
          })
      }
      else {
          setDimensions({
              width: window.innerWidth,
              height: window.innerWidth / 2,
              resize: true
          })
      }  
  };

  const debounceResize = debounce(resize , 150)

  if (!dimensions.resize) {
    debounceResize()
    
  }

  window.addEventListener("resize", debounceResize);
  return () => window.removeEventListener("resize", debounceResize);

  
  }, [dimensions]);
  
  useEffect(() =>  {
    
    if(update) {
      d3.selectAll("g").remove()
  } else {
      update.current = true
  }   

  if (dimensions.resize){
  drawChart(sample, dimensions)
}
  }, [dimensions])



  function drawChart(data, dimensions) {

    const margin = {top: 50, right: 30, bottom: 30, left: 60}

    console.log(dimensions)

    const chartWidth = dimensions.width
    const chartHeight = dimensions.height


    const svg = d3.select(d3Chart.current)
      .attr("width", chartWidth + margin.left + margin.right)
      .attr("height", chartHeight + margin.top + margin.bottom)

    const x = d3.scaleBand()
      .domain(d3.range(sample.length))
      .range([margin.left, chartWidth - margin.right])
      .padding(0.1)

    svg.append("g")
      .attr("transform", `translate(0, ${chartHeight})`)
      .call(d3.axisBottom(x).tickFormat(i => sample[i].category).tickSizeOuter(0).tickSize(0).tickPadding(10))

    const max = d3.max(sample, d => d.quantity)

    const y = d3.scaleLinear()
      .domain([0, max])
      .range([chartHeight, margin.top])

    svg.append("g")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(y))


    svg.append("g")
      .attr("fill", "#2ac2ee")
      .selectAll("rect")
      .data(data)
      .join("rect")
      .attr("x", (d, i) => x(i))
      .attr("y", d => y(d.quantity))
      .attr("height", d => y(0)-y(d.quantity))
      .attr("width", x.bandwidth())

  };

  return (
      <div id="wrapper">
        <svg ref={d3Chart}>
        </svg>
      </div>
      )
}


export default Chart;