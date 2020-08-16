const apiMoviesUrl = "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json";
const moviesData = localStorage.getItem("movies-data")
  ? JSON.parse(localStorage.getItem("movies-data"))
  : d3.json(apiMoviesUrl, (data) => {
      localStorage.setItem("movies-data", JSON.stringify(data));
      return data;
    });

const width = 1000;
const height = 600;

const colorMap = [
  {
    category: "Action",
    color: "rgb(76, 146, 195)",
  },
  {
    category: "Drama",
    color: "rgb(255, 153, 62)",
  },
  {
    category: "Adventure",
    color: "rgb(86, 179, 86)",
  },
  {
    category: "Family",
    color: "rgb(255, 201, 147)",
  },
  {
    category: "Animation",
    color: "rgb(209, 192, 221)",
  },
  {
    category: "Comedy",
    color: "rgb(208, 176, 169)",
  },
  {
    category: "Biography",
    color: "rgb(222, 82, 83)",
  },
];

// svg
const svg = d3.select("#chart").append("svg").attr("viewBox", `0 0 1000 600`).attr("id", "svg");

// tooltip
const toolTip = d3.select("body").append("div").attr("id", "tooltip");

// tree map
const root = d3.hierarchy(moviesData).sum((d) => d.value);
d3.treemap().size([width, height]).padding(1)(root);

svg
  .selectAll("rect")
  .data(root.leaves())
  .enter()
  .append("rect")
  .attr("x", (d) => d.x0)
  .attr("y", (d) => d.y0)
  .attr("width", (d) => d.x1 - d.x0)
  .attr("height", (d) => d.y1 - d.y0)
  .attr("class", "tile")
  .attr("data-name", (d) => d.data.name)
  .attr("data-category", (d) => d.data.category)
  .attr("data-value", (d) => d.data.value)
  .style("stroke", "black")
  .style("fill", (d) => fillColor(d.data.category))
  .on("mouseover", (d) => {
    d3.select("#tooltip")
      .style("opacity", 0.8)
      .attr("data-value", d.data.value)
      .text(`Movie: ${d.data.name}, Category: ${d.data.category}, Value: ${d.data.value}`);
  })
  .on("mouseout", () => d3.select("#tooltip").style("opacity", 0))
  .on("mousemove", () =>
    d3
      .select("#tooltip")
      .style("left", d3.event.pageX + 20 + "px")
      .style("top", d3.event.pageY - 80 + "px")
  );

svg
  .selectAll("text")
  .data(root.leaves())
  .enter()
  .append("text")
  .text((d) => d.data.name || "")
  .attr("x", (d) => d.x0)
  .attr("y", (d) => d.y0 + 20)
  .attr("font-size", "12px")
  .attr("color", "#FFF");

// legend
const legend = d3.select("#chart").append("svg").attr("id", "legend");

legend
  .selectAll("g.legend")
  .data(colorMap)
  .enter()
  .append("g")
  .attr("transform", function (d, i) {
    return `translate(${i * 140 + 50}, 0)`;
  })
  .each(function (d) {
    d3.select(this)
      .append("rect")
      .attr("width", 30)
      .attr("height", 15)
      .attr("class", "legend-item")
      .attr("fill", d.color)
      .attr("stroke", "rgb(0,0,0)");
    d3.select(this)
      .append("text")
      .attr("text-anchor", "start")
      .attr("x", 40)
      .attr("y", 15 / 2)
      .attr("dy", "0.35em")
      .text(d.category);
  });

function fillColor(category) {
  return colorMap.filter((entry) => entry.category == category)[0].color;
}
