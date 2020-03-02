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

  animateMergeSort = (combinedSwaps, labels, finalDataArr, cntr, ms) => {
    if (!this.state.sortingPaused) {
      if (cntr === combinedSwaps.length) {
        this.setState({
          sortingActive: true,
          data: {
            labels: finalDataArr,
            datasets: [
              {
                label: "Combined",
                backgroundColor: "rgba(0, 102, 128, 0.2)",
                borderColor: "rgba(0, 102, 128, 1)",
                borderWidth: 1,
                hoverBackgroundColor: "rgba(0, 102, 128, 0.4)",
                hoverBorderColor: "rgba(0, 102, 128, 1)",
                data: finalDataArr
              }
            ]
          }
        });
      } else {
        this.setState({
          sortingActive: true,
          data: {
            labels: labels,
            datasets: combinedSwaps[cntr]
          }
        });
      }
      cntr++;
      if (cntr <= combinedSwaps.length) {
        setTimeout(
          () =>
            this.animateMergeSort(
              combinedSwaps,
              labels,
              finalDataArr,
              cntr,
              ms
            ),
          ms
        );
      } else {
        this.setState({ sortingActive: false });
      }
    } else {
      this.setState({ sortingActive: false, sortingPaused: false });
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
        this.animateSwaps(orderedSwaps, 0, ms);
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
        this.animateSwaps(orderedSwaps, 0, ms);
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
        this.animateSwaps(orderedSwaps, 0, ms);
        try {
          this.sortCheck(data, orderedSwaps[orderedSwaps.length - 1]);
        } catch (e) {
          console.error(e);
        }
        break;

      case "mergeSort":
        const mergeSort = (
          dataCopy,
          orderedSplitLeft,
          orderedSwapsLeft,
          orderedSplitRight,
          orderedSwapsRight
        ) => {
          if (dataCopy.length <= 1) {
            return dataCopy;
          }

          const middle = Math.floor(dataCopy.length / 2);

          const left = dataCopy.slice(0, middle);
          orderedSplitLeft.push(left);
          const right = dataCopy.slice(middle);
          orderedSplitRight.push(right);

          return merge(
            mergeSort(
              left,
              orderedSplitLeft,
              orderedSwapsLeft,
              orderedSplitRight,
              orderedSwapsRight
            ),
            mergeSort(
              right,
              orderedSplitLeft,
              orderedSwapsLeft,
              orderedSplitRight,
              orderedSwapsRight
            )
          );
        };

        const merge = (left, right) => {
          let result = [],
            leftNdx = 0,
            rightNdx = 0;

          while (leftNdx < left.length && rightNdx < right.length) {
            if (left[leftNdx] < right[rightNdx]) {
              result.push(left[leftNdx]);
              leftNdx++;
              orderedSwaps.push(result.slice());
              orderedSwapsLeft.push(result.slice());
            } else {
              result.push(right[rightNdx]);
              rightNdx++;
              orderedSwaps.push(result.slice());
              orderedSwapsRight.push(result.slice());
            }
          }

          return result
            .concat(left.slice(leftNdx))
            .concat(right.slice(rightNdx));
        };

        let orderedSplitLeft = [];
        let orderedSplitRight = [];
        let singleLefts = [];
        let singleRights = [];
        let labels = [];
        let orderedSwapsLeft = [];
        let orderedSwapsRight = [];
        let combinedSwaps = [];

        orderedSwaps.push(
          mergeSort(
            dataCopy,
            orderedSplitLeft,
            orderedSwapsLeft,
            orderedSplitRight,
            orderedSwapsRight
          )
        );

        let finalDataArr = orderedSwaps[orderedSwaps.length - 1];

        for (let i = 0; i < orderedSplitLeft.length; i++)
          if (orderedSplitLeft[i].length === 1)
            singleLefts.push(orderedSplitLeft[i][0]);
        for (let i = 0; i < orderedSplitRight.length; i++)
          if (orderedSplitRight[i].length === 1)
            singleRights.push(orderedSplitRight[i][0]);

        for (
          let i = 1;
          i <= Math.ceil((singleLefts.length + singleRights.length) / 2);
          i++
        ) {
          labels.push(`Pair ${i}`);
        }

        let newDatasets = [
          {
            label: "Left",
            backgroundColor: "rgba(0, 102, 255, 0.2)",
            borderColor: "rgba(0, 102, 255,1)",
            borderWidth: 1,
            hoverBackgroundColor: "rgba(0, 102, 255,0.4)",
            hoverBorderColor: "rgba(0, 102, 255,1)",
            data: singleLefts
          }
        ];

        newDatasets.push({
          label: "Right",
          backgroundColor: "rgba(0, 102, 0, 0.2)",
          borderColor: "rgba(0, 102, 0,1)",
          borderWidth: 1,
          hoverBackgroundColor: "rgba(0, 102, 0,0.4)",
          hoverBorderColor: "rgba(0, 102, 0,1)",
          data: singleRights
        });

        combinedSwaps.push(newDatasets);

        for (let i = 0; i < orderedSwapsLeft.length; i++) {
          //console.log(orderedSwapsLeft[i]);
          let test = [
            {
              label: "Left",
              backgroundColor: "rgba(0, 102, 255, 0.2)",
              borderColor: "rgba(0, 102, 255,1)",
              borderWidth: 1,
              hoverBackgroundColor: "rgba(0, 102, 255,0.4)",
              hoverBorderColor: "rgba(0, 102, 255,1)",
              data: orderedSwapsLeft[i]
            }
          ];

          test.push({
            label: "Right",
            backgroundColor: "rgba(0, 102, 0, 0.2)",
            borderColor: "rgba(0, 102, 0,1)",
            borderWidth: 1,
            hoverBackgroundColor: "rgba(0, 102, 0,0.4)",
            hoverBorderColor: "rgba(0, 102, 0,1)",
            data: singleRights
          });

          combinedSwaps.push(test);
        }

        const leftLast = combinedSwaps.length - 1;

        for (let i = 0; i < orderedSwapsRight.length; i++) {
          //console.log(orderedSwapsRight[i]);
          let test = [
            {
              label: "Left",
              backgroundColor: "rgba(0, 102, 255, 0.2)",
              borderColor: "rgba(0, 102, 255,1)",
              borderWidth: 1,
              hoverBackgroundColor: "rgba(0, 102, 255,0.4)",
              hoverBorderColor: "rgba(0, 102, 255,1)",
              data: combinedSwaps[leftLast][0].data
            }
          ];

          test.push({
            label: "Right",
            backgroundColor: "rgba(0, 102, 0, 0.2)",
            borderColor: "rgba(0, 102, 0,1)",
            borderWidth: 1,
            hoverBackgroundColor: "rgba(0, 102, 0,0.4)",
            hoverBorderColor: "rgba(0, 102, 0,1)",
            data: orderedSwapsRight[i]
          });

          combinedSwaps.push(test);
        }

        setTimeout(() => {
          this.animateMergeSort(combinedSwaps, labels, finalDataArr, 0, ms);
        }, ms);

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
            <input
              type="radio"
              id="mergeSort"
              name="sortType"
              onChange={this.handleSortTypeChange}
            />
            <label htmlFor="mergeSort">Merge Sort</label>
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
