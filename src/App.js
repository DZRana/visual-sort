import React, { Component } from "react";
import VisualData from "./components/VisualData";
import "./App.css";

class App extends Component {
  constructor() {
    super();
    this.state = {
      numbers: 0,
      sortType: "",
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

  handleSortChange = event => {
    this.setState({ sortType: event.target.id });
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

  handleSortSubmit = () => {
    const { sortType } = this.state;
    const { data } = this.state.data.datasets[0];

    switch (sortType) {
      case "bubbleSort":
        for (let i = 0; i < data.length; i++) {
          for (let j = 0; j < data.length; j++) {
            if (data[j] > data[j + 1]) {
              let temp = data[j];
              data[j] = data[j + 1];
              data[j + 1] = temp;
            }
          }
        }
        this.setState({
          data: {
            labels: data,
            datasets: [
              {
                ...this.state.data.datasets[0],
                data: data
              }
            ]
          }
        });
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
              onChange={this.handleSortChange}
            />
            <label htmlFor="bubbleSort">Bubble Sort</label>
            <input
              type="radio"
              id="mergeSort"
              name="sortType"
              onChange={this.handleSortChange}
            />
            <label htmlFor="mergeSort">Merge Sort</label>
            <button onClick={this.handleSortSubmit}>Sort!</button>
          </label>
        </div>
      </div>
    );
  }
}

export default App;
