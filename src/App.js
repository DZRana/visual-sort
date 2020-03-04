import React, { Component } from "react";
import VisualData from "./components/VisualData";
import "./App.css";

/*
  TODO:
    1. FIX PAUSE FROM STARTING FROM THE BEGINNING
*/

/*
this.setState({
      data: {
        datasets: [
          this.state.data.datasets.push({
            label: "Data",
            backgroundColor: "rgba(0, 102, 255, 0.2)",
            borderColor: "rgba(0, 102, 255,1)",
            borderWidth: 1,
            hoverBackgroundColor: "rgba(0, 102, 255,0.4)",
            hoverBorderColor: "rgba(0, 102, 255,1)",
            data: singleLefts
          }),
          this.state.data.datasets.push({
            label: "Data",
            backgroundColor: "rgba(0, 102, 0, 0.2)",
            borderColor: "rgba(0, 102, 0,1)",
            borderWidth: 1,
            hoverBackgroundColor: "rgba(0, 102, 0,0.4)",
            hoverBorderColor: "rgba(0, 102, 0,1)",
            data: singleRights
          })
        ]
      }
    });

*/

class App extends Component {
  constructor() {
    super();
    this.state = {
      test: 0,
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
            backgroundColor: "rgba(0,102,128,0.2)",
            borderColor: "rgba(0,102,128,1)",
            borderWidth: 1,
            hoverBackgroundColor: "rgba(0,102,128,0.4)",
            hoverBorderColor: "rgba(0,102,128,1)",
            data: []
          }
        ]
      }
    };
  }

  testState = () => {
    console.log(this.state.data);
    this.setState({ test: this.state.test + 1 });
  };

  handleNumberChange = event => {
    this.setState({ numbers: event.target.value });
  };

  handleSortTypeChange = event => {
    this.setState({ sortType: event.target.id });
  };

  handleSortSpeedChange = event => {
    this.setState({ sortSpeed: event.target.id });
  };

  generateRandomNum = range => {
    return Math.floor(Math.random() * range) + 1;
  };

  handleNumberSubmit = () => {
    let labels = [];
    let dataset = [];
    for (let i = 0; i < this.state.numbers; i++) {
      let rnd = this.generateRandomNum(1000);
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
            label: "Data",
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
            label: "Data",
            backgroundColor: "rgba(0,102,128,0.2)",
            borderColor: "rgba(0,102,128,1)",
            borderWidth: 1,
            hoverBackgroundColor: "rgba(0,102,128,0.4)",
            hoverBorderColor: "rgba(0,102,128,1)",
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

  sortCheck = (data, mySortResult) => {
    let dataCopy = data.slice();
    if (dataCopy.length <= 1) return;

    let jsSort = dataCopy.sort((a, b) => a - b);
    for (let i = 0; i < dataCopy.length; i++) {
      if (jsSort[i] !== mySortResult[i])
        throw new Error("Implementation result does not match JS sort result");
    }
  };

  animateSwaps = (sortType, orderedSwaps, cntr, ms) => {
    switch (sortType) {
      case "mergeSort":
      case "quickSort":
        if (!this.state.sortingPaused) {
          this.setState({
            sortingActive: true,
            data: orderedSwaps[cntr]
          });
          cntr++;
          if (cntr < orderedSwaps.length) {
            setTimeout(
              () => this.animateSwaps(sortType, orderedSwaps, cntr, ms),
              ms
            );
          } else {
            this.setState({ sortingActive: false });
          }
        } else {
          this.setState({ sortingActive: false, sortingPaused: false });
        }
        break;
      default:
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
            setTimeout(
              () => this.animateSwaps(sortType, orderedSwaps, cntr, ms),
              ms
            );
          } else {
            this.setState({ sortingActive: false });
          }
        } else {
          this.setState({ sortingActive: false, sortingPaused: false });
        }
        break;
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
        this.animateSwaps(sortType, orderedSwaps, 0, ms);
        try {
          this.sortCheck(data, orderedSwaps[orderedSwaps.length - 1]);
        } catch (e) {
          console.error(e);
        }
        break;

      case "selectionSort":
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
        this.animateSwaps(sortType, orderedSwaps, 0, ms);
        try {
          this.sortCheck(data, orderedSwaps[orderedSwaps.length - 1]);
        } catch (e) {
          console.error(e);
        }
        break;

      case "insertionSort":
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
        this.animateSwaps(sortType, orderedSwaps, 0, ms);
        try {
          this.sortCheck(data, orderedSwaps[orderedSwaps.length - 1]);
        } catch (e) {
          console.error(e);
        }
        break;

      case "mergeSort":
        const mergeSort = dataCopy => {
          if (dataCopy.length <= 1) {
            return dataCopy;
          }

          const middle = Math.floor(dataCopy.length / 2);

          const left = dataCopy.slice(0, middle);
          //console.log("left:", left);
          orderedSwaps.push({
            labels: left,
            datasets: [
              {
                label: "Left",
                backgroundColor: "rgba(0, 102, 255, 0.2)",
                borderColor: "rgba(0, 102, 255,1)",
                borderWidth: 1,
                hoverBackgroundColor: "rgba(0, 102, 255,0.4)",
                hoverBorderColor: "rgba(0, 102, 255,1)",
                data: left
              }
            ]
          });
          const right = dataCopy.slice(middle);
          //console.log("right:", right);
          orderedSwaps.push({
            labels: right,
            datasets: [
              {
                label: "Right",
                backgroundColor: "rgba(0, 102, 0, 0.2)",
                borderColor: "rgba(0, 102, 0,1)",
                borderWidth: 1,
                hoverBackgroundColor: "rgba(0, 102, 0,0.4)",
                hoverBorderColor: "rgba(0, 102, 0,1)",
                data: right
              }
            ]
          });

          return merge(mergeSort(left), mergeSort(right));
        };

        const merge = (left, right) => {
          let result = [],
            leftNdx = 0,
            rightNdx = 0;

          while (leftNdx < left.length && rightNdx < right.length) {
            if (left[leftNdx] < right[rightNdx]) {
              result.push(left[leftNdx]);
              leftNdx++;
            } else {
              result.push(right[rightNdx]);
              rightNdx++;
            }
          }

          let last = result
            .concat(left.slice(leftNdx))
            .concat(right.slice(rightNdx));
          //console.log("merged:", last);

          orderedSwaps.push({
            labels: last,
            datasets: [
              {
                label: "Merged",
                backgroundColor: "rgba(0, 102, 128, 0.2)",
                borderColor: "rgba(0, 102, 128, 1)",
                borderWidth: 1,
                hoverBackgroundColor: "rgba(0, 102, 128, 0.4)",
                hoverBorderColor: "rgba(0, 102, 128, 1)",
                data: last
              }
            ]
          });

          return last;
        };
        mergeSort(dataCopy);
        this.animateSwaps(sortType, orderedSwaps, 0, ms);
        try {
          this.sortCheck(
            data,
            orderedSwaps[orderedSwaps.length - 1].datasets[0].data
          );
        } catch (e) {
          console.error(e);
        }
        break;
      case "quickSort":
        const quickSort = dataCopy => {
          if (dataCopy.length <= 1) {
            return dataCopy;
          } else {
            let left = [];
            let right = [];
            let newArr = [];
            let pivot = dataCopy.pop();
            //console.log("pivot:", pivot);

            orderedSwaps.push({
              labels: [pivot],
              datasets: [
                {
                  label: "Pivot",
                  backgroundColor: "rgba(0, 102, 128, 0.2)",
                  borderColor: "rgba(0, 102, 128, 1)",
                  borderWidth: 1,
                  hoverBackgroundColor: "rgba(0, 102, 128, 0.4)",
                  hoverBorderColor: "rgba(0, 102, 128, 1)",
                  data: [pivot]
                }
              ]
            });

            for (let i = 0; i < dataCopy.length; i++) {
              if (dataCopy[i] <= pivot) {
                left.push(dataCopy[i]);
                //console.log("left:", left);
                orderedSwaps.push({
                  labels: left.slice(),
                  datasets: [
                    {
                      label: "Less than Pivot",
                      backgroundColor: "rgba(0, 102, 255, 0.2)",
                      borderColor: "rgba(0, 102, 255,1)",
                      borderWidth: 1,
                      hoverBackgroundColor: "rgba(0, 102, 255,0.4)",
                      hoverBorderColor: "rgba(0, 102, 255,1)",
                      data: left.slice()
                    }
                  ]
                });
              } else {
                right.push(dataCopy[i]);
                //console.log("right:", right);
                orderedSwaps.push({
                  labels: right.slice(),
                  datasets: [
                    {
                      label: "Greater than Pivot",
                      backgroundColor: "rgba(0, 102, 0, 0.2)",
                      borderColor: "rgba(0, 102, 0,1)",
                      borderWidth: 1,
                      hoverBackgroundColor: "rgba(0, 102, 0,0.4)",
                      hoverBorderColor: "rgba(0, 102, 0,1)",
                      data: right.slice()
                    }
                  ]
                });
              }
            }

            let last = newArr.concat(quickSort(left), pivot, quickSort(right));
            //console.log("last:", last);
            orderedSwaps.push({
              labels: last,
              datasets: [
                {
                  label: "Combined",
                  backgroundColor: "rgba(0, 102, 128, 0.2)",
                  borderColor: "rgba(0, 102, 128, 1)",
                  borderWidth: 1,
                  hoverBackgroundColor: "rgba(0, 102, 128, 0.4)",
                  hoverBorderColor: "rgba(0, 102, 128, 1)",
                  data: last
                }
              ]
            });

            return last;
          }
        };

        quickSort(dataCopy);
        this.animateSwaps(sortType, orderedSwaps, 0, ms);
        try {
          this.sortCheck(
            data,
            orderedSwaps[orderedSwaps.length - 1].datasets[0].data
          );
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
            <input
              type="radio"
              id="mergeSort"
              name="sortType"
              onChange={this.handleSortTypeChange}
            />
            <label htmlFor="mergeSort">Merge Sort</label>
            <input
              type="radio"
              id="quickSort"
              name="sortType"
              onChange={this.handleSortTypeChange}
            />
            <label htmlFor="quickSort">Quick Sort</label>
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
                <button onClick={this.testState}>test</button>
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
