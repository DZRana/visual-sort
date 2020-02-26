import React, { Component } from "react";
import VisualData from "./components/VisualData";
import "./App.css";

class App extends Component {
  constructor() {
    super();
    this.state = {
      numbers: 0,
      beforeSort: [],
      sortType: "",
      sortSpeed: "",
      sortingActive: false,
      sortingPaused: false,
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
      beforeSort: dataset,
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

  handleReset = () => {
    this.setState({
      data: {
        labels: this.state.beforeSort,
        datasets: [
          {
            ...this.state.data.datasets[0],
            data: this.state.beforeSort
          }
        ]
      }
    });
  };

  handlePause = () => {
    this.setState({ sortingPaused: true });
  };

  handleStop = () => {
    this.handlePause();
    this.handleReset();
  };

  animateSwaps = (orderedSwaps, cntr, ms) => {
    if (!this.state.sortingPaused) {
      this.setState({
        sortingActive: true,
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
      } else {
        this.setState({ sortingActive: false });
      }
    } else {
      this.setState({ sortingActive: false, sortingPaused: false });
    }
  };

  sortCheck = (data, mySortResult) => {
    let dataCopy = data.slice();
    if (dataCopy.length <= 1) return;

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

    if (dataCopy.length <= 1) return;

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
        ms = 1;
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
        orderedSwaps.push(dataCopy.slice());
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

      case "insertionSort":
        orderedSwaps = [];
        for (let i = 1; i < dataCopy.length; i++) {
          let current = dataCopy[i];
          let sortedNdx = i - 1;
          while (dataCopy[sortedNdx] > current && sortedNdx >= 0) {
            dataCopy[sortedNdx + 1] = dataCopy[sortedNdx];
            orderedSwaps.push(dataCopy.slice());
            sortedNdx--;
          }
          dataCopy[sortedNdx + 1] = current;
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
    const { data, sortingActive } = this.state;
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
            {!sortingActive && (
              <button onClick={this.handleNumberSubmit}>New Data</button>
            )}
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
            <input
              type="radio"
              id="insertionSort"
              name="sortType"
              onChange={this.handleSortTypeChange}
            />
            <label htmlFor="insertionSort">Insertion Sort</label>
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
            {!sortingActive ? (
              <div>
                <button onClick={this.handleSortSubmit}>Sort!</button>
                <button onClick={this.handleReset}>Reset</button>
              </div>
            ) : (
              <div>
                <button onClick={this.handlePause}>Pause</button>
                <button onClick={this.handleStop}>Stop</button>
              </div>
            )}
          </label>
        </div>
      </div>
    );
  }
}

export default App;
