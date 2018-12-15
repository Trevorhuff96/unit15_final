function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  console.log("Im inside buildMetadata")

  d3.json(`/metadata/${sample}`).then(function(d) {
    // this would return a json
    //console.log(d)
    // this would return an array of 7 lists
    // console.log(Object.entries(d));
 
 
    mData = Object.entries(d);
 
    var PANEL = d3.select("#sample-metadata");
 
    PANEL.html("");
 
   //console.log(mData);
   //console.log(PANEL);
 
    PANEL.selectAll("h6").data(mData).enter().append("h6")
      .text(function(d) { return `${d[0]}: ${d[1]}`; });

    // Object.entries(d).forEach(([key, value]) =>{
    //   PANEL.append("h6").text(`${key}: ${value}`);
    // });
 
  });
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  console.log("Im in buildCharts");
  d3.json(`/samples/${sample}`).then(function(d){
    var otu_ids = d.otu_ids
    var sample_values = d.sample_values
    var otu_labels = d.otu_labels

    console.log(otu_labels);

    var bubbleTrace= {
      x: otu_ids,
      y: sample_values,
      mode: "markers",
      text: otu_labels,
      marker : {
        size : sample_values,
        color: otu_ids
      }
    }
    var bubbleData =[bubbleTrace];

    var bubbleLayout = {
      xaxis : {title: "OTU ID"}
    }

    Plotly.newPlot("bubble", bubbleData, bubbleLayout)

    // use the same variables we defined (otu_ids , ect)
    // use the .slice(0,10)
    // 
    
    var pieTrace = {
      values: sample_values.sort(function(a,b){return b-a}).slice(0,10),
      labels: otu_ids.slice(0,10),
      marker: {
        colorscale: "Earth"
      },
      type: "pie"
    }

    var pieData = [pieTrace];

    var pieLayout = {

    };

    Plotly.newPlot("pie", pieData, pieLayout);
  });


    // @TODO: Build a Bubble Chart using the sample data

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    // first sample is always 940
    // the rest of the samples are called in optionChanged
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// optionChanged is called every time the user clicks a new sample value
function optionChanged(newSample) {
  console.log("IM in optionChanged")
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
