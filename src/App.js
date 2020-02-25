import React, { Component } from "react";
import VisualData from "./components/VisualData";
import "./App.css";

class App extends Component {
  constructor() {
    super();
    this.state = {
      numbers: 0,
      sortType: "",
      sortSpeed: "",
      data: {
        labels: [],
        datasets: [
          {
            label: "Data",
            backgroundColor: "rgba(255,99,131,0.2)",
            borderColor: "rgba(255,99,131,1)",
            borderWidth: 1,
            hoverBackgroundColor: "rgba(255,99,131,0.4)",
            hoverBorderColor: "rgba(255,99,131,1)",
            data: []
          }
        ]
      }
    };
  }

  handleNumberChange = event => {
    this.setState({ numbers: event.target.value });
  };

  handleSortTypeChange = event => {
    this.setState({ sortType: event.target.id });
  };

  handleSortSpeedChange = event => {
    this.setState({ sortSpeed: event.target.id });
  };

  handleNumberSubmit = () => {
    let labels = [];
    let dataset = [];
    for (let i = 0; i < this.state.numbers; i++) {
      let rnd = Math.floor(Math.random() * 1000) + 1;
      labels.push(rnd.toString());
      dataset.push(rnd);
    }
    this.setState({
      data: {
        labels: labels,
        datasets: [
          {
            ...this.state.data.datasets[0],
            data: dataset
          }
        ]
      }
    });
  };

  animateSwaps = (orderedSwaps, cntr, ms) => {
    this.setState({
      data: {
        labels: orderedSwaps[cntr],
        datasets: [
          {
            ...this.state.data.datasets[0],
            data: orderedSwaps[cntr]
          }
        ]
      }
    });
    cntr++;
    if (cntr < orderedSwaps.length) {
      setTimeout(() => this.animateSwaps(orderedSwaps, cntr, ms), ms);
    }
  };

  sortCheck = (data, mySortResult) => {
    let dataCopy = data.slice();
    let jsSort = dataCopy.sort((a, b) => a - b);
    for (let i = 0; i < dataCopy.length; i++) {
      if (jsSort[i] !== mySortResult[i])
        throw new Error("Implementation result does not match JS sort result");
    }
  };

  handleSortSubmit = () => {
    const { sortSpeed, sortType } = this.state;
    const { data } = this.state.data.datasets[0];
    let dataCopy = data.slice();
    let ms = 0;
    let orderedSwaps = [];

    switch (sortSpeed) {
      case "slowSort":
        ms = 1000;
        break;
      case "fastSort":
        ms = 100;
        break;
      case "fastestSort":
        ms = 1;
        break;
      default:
        break;
    }

    switch (sortType) {
      case "bubbleSort":
        orderedSwaps = [];
        for (let i = 0; i < dataCopy.length; i++) {
          for (let j = 0; j < dataCopy.length; j++) {
            if (dataCopy[j] > dataCopy[j + 1]) {
              let temp = dataCopy[j];
              dataCopy[j] = dataCopy[j + 1];
              dataCopy[j + 1] = temp;
              orderedSwaps.push(dataCopy.slice());
            }
          }
        }
        this.animateSwaps(orderedSwaps, 0, ms);
        try {
          this.sortCheck(data, orderedSwaps[orderedSwaps.length - 1]);
        } catch (e) {
          console.error(e);
        }
        break;

      case "selectionSort":
        orderedSwaps = [];
        for (let i = 0; i < dataCopy.length; i++) {
          let min = dataCopy[i];
          let ndx = i;
          for (let j = i; j < dataCopy.length; j++) {
            if (dataCopy[j] < min) {
              min = dataCopy[j];
              ndx = j;
            }
          }
          let temp = dataCopy[i];
          dataCopy[i] = min;
          dataCopy[ndx] = temp;
          orderedSwaps.push(dataCopy.slice());
        }
        this.animateSwaps(orderedSwaps, 0, ms);
        try {
          this.sortCheck(data, orderedSwaps[orderedSwaps.length - 1]);
        } catch (e) {
          console.error(e);
        }
        break;

      default:
        break;
    }
  };

  render() {
    const { data } = this.state;
    return (
      <div>
        <VisualData data={data} />
        <div>
          <label>
            Number:
            <input
              type="text"
              numbers={this.state.numbers}
              onChange={this.handleNumberChange}
            />
            <button onClick={this.handleNumberSubmit}>New Data</button>
          </label>
        </div>
        <div>
          <label>
            Sort:
            <input
              type="radio"
              id="bubbleSort"
              name="sortType"
              onChange={this.handleSortTypeChange}
            />
            <label htmlFor="bubbleSort">Bubble Sort</label>
            <input
              type="radio"
              id="selectionSort"
              name="sortType"
              onChange={this.handleSortTypeChange}
            />
            <label htmlFor="selectionSort">Selection Sort</label>
          </label>
        </div>
        <div>
          <label>
            Speed:
            <input
              type="radio"
              id="slowSort"
              name="sortSpeed"
              onChange={this.handleSortSpeedChange}
            />
            <label htmlFor="slowSort">Slow</label>
            <input
              type="radio"
              id="fastSort"
              name="sortSpeed"
              onChange={this.handleSortSpeedChange}
            />
            <label htmlFor="fastSort">Fast</label>
            <input
              type="radio"
              id="fastestSort"
              name="sortSpeed"
              onChange={this.handleSortSpeedChange}
            />
            <label htmlFor="fastSort">Fastest</label>
            <button onClick={this.handleSortSubmit}>Sort!</button>
          </label>
        </div>
      </div>
    );
  }
}

export default App;
