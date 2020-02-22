import React, { Component } from "react";
import VisualData from "./components/VisualData";
import "./App.css";

class App extends Component {
  constructor() {
    super();
    this.state = {
      numbers: 0,
      isBubbleSort: false,
      data: {
        labels: [],
        datasets: [
          {
            label: "Dataset",
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
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  };

  handleSubmit = () => {
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
            <button onClick={this.handleSubmit}>Submit</button>
          </label>
        </div>
        <div>
          <label>
            Sort:
            <input
              name="bubbleSort"
              type="checkbox"
              checked={this.state.isBubbleSort}
              onChange={this.handleSortChange}
            />
          </label>
        </div>
      </div>
    );
  }
}

export default App;
