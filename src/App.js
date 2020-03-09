/* eslint-disable no-loop-func */
import React, { Component } from "react";
import VisualData from "./components/VisualData";
import Options from "./components/Options";
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

  visualize = (data, sortType, orderedSwaps, ms) => {
    this.animateSwaps(sortType, orderedSwaps, 0, ms);
    try {
      if (sortType === "mergeSort" || sortType === "quickSort") {
        this.sortCheck(
          data,
          orderedSwaps[orderedSwaps.length - 1].datasets[0].data
        );
      } else this.sortCheck(data, orderedSwaps[orderedSwaps.length - 1]);
    } catch (e) {
      console.error(e);
    }
  };

  handleSortSubmit = () => {
    const { sortSpeed, sortType } = this.state;
    const { data } = this.state.data.datasets[0];
    let dataCopy = data.slice();
    let ms = 0;
    let bgColors = [];
    let brdrColors = [];
    let hBgColors = [];
    let hBrdrColors = [];
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
        this.visualize(data, sortType, orderedSwaps, ms);
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
        this.visualize(data, sortType, orderedSwaps, ms);
        break;

      case "heapSort":
        let arrLength;
        let i;

        const swap = (dataCopy, i, j) => {
          const temp = dataCopy[i];
          dataCopy[i] = dataCopy[j];
          dataCopy[j] = temp;
        };

        const hRoot = (dataCopy, i) => {
          let left = 2 * i + 1;
          let right = 2 * i + 2;
          let max = i;

          if (left < arrLength && dataCopy[left] > dataCopy[max]) max = left;

          if (right < arrLength && dataCopy[right] > dataCopy[max]) max = right;

          if (max !== i) {
            swap(dataCopy, i, max);
            orderedSwaps.push(dataCopy.slice());
            hRoot(dataCopy, max);
          }
        };

        const heapSort = dataCopy => {
          arrLength = dataCopy.length;

          for (i = Math.floor(arrLength / 2); i >= 0; --i) hRoot(dataCopy, i);

          for (i = dataCopy.length - 1; i > 0; i--) {
            swap(dataCopy, 0, i);
            orderedSwaps.push(dataCopy.slice());
            arrLength--;

            hRoot(dataCopy, 0);
          }
        };

        heapSort(dataCopy);
        this.visualize(data, sortType, orderedSwaps, ms);
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
        this.visualize(data, sortType, orderedSwaps, ms);
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
        this.visualize(data, sortType, orderedSwaps, ms);
        break;

      case "quickSort":
        const quickSort = dataCopy => {
          let initialArr = dataCopy.slice();
          if (dataCopy.length <= 1) {
            return dataCopy;
          } else {
            let left = [];
            let right = [];
            let newArr = [];
            let newInit = [];
            let pivot = dataCopy.pop();

            //console.log("pivot:", pivot);

            for (let i = 0; i < dataCopy.length; i++) {
              // BEFORE SWAP: highlight pivot and number being compared (dataCopy[i])
              initialArr.forEach(v => {
                if (v === pivot || v === dataCopy[i]) {
                  bgColors.push("rgba(255,99,132,0.2)");
                  brdrColors.push("rgba(255,99,132,1)");
                  hBgColors.push("rgba(255,99,132,0.4)");
                  hBrdrColors.push("rgba(255,99,132,1)");
                } else {
                  bgColors.push("rgba(0,102,128,0.2)");
                  brdrColors.push("rgba(0,102,128,1)");
                  hBgColors.push("rgba(0,102,128,0.4)");
                  hBrdrColors.push("rgba(0,102,128,1)");
                }
              });

              orderedSwaps.push({
                labels: initialArr,
                datasets: [
                  {
                    label: "Data (Comparison w/ Pivot)",
                    backgroundColor: bgColors,
                    borderColor: brdrColors,
                    borderWidth: 1,
                    hoverBackgroundColor: hBgColors,
                    hoverBorderColor: hBrdrColors,
                    data: initialArr
                  }
                ]
              });

              bgColors = [];
              brdrColors = [];
              hBgColors = [];
              hBrdrColors = [];
              // BEFORE SWAP: highlight pivot and number being compared (dataCopy[i])

              if (dataCopy[i] <= pivot) {
                left.push(dataCopy[i]);
                //console.log("left:", left);
                newInit = newArr.concat(left, pivot, right);

                newInit.forEach(v => {
                  if (v === pivot) {
                    bgColors.push("rgba(255,99,132,0.2)");
                    brdrColors.push("rgba(255,99,132,1)");
                    hBgColors.push("rgba(255,99,132,0.4)");
                    hBrdrColors.push("rgba(255,99,132,1)");
                  } else if (v === dataCopy[i] || left.includes(v)) {
                    bgColors.push("rgba(0, 102, 255,0.2)");
                    brdrColors.push("rgba(0, 102, 255,1)");
                    hBgColors.push("rgba(0, 102, 255,0.4)");
                    hBrdrColors.push("rgba(0, 102, 255,1)");
                  } else if (right.includes(v)) {
                    bgColors.push("rgba(0, 102, 0,0.2)");
                    brdrColors.push("rgba(0, 102, 0,1)");
                    hBgColors.push("rgba(0, 102, 0,0.4)");
                    hBrdrColors.push("rgba(0, 102, 0,1)");
                  } else {
                    bgColors.push("rgba(0,102,128,0.2)");
                    brdrColors.push("rgba(0,102,128,1)");
                    hBgColors.push("rgba(0,102,128,0.4)");
                    hBrdrColors.push("rgba(0,102,128,1)");
                  }
                });

                orderedSwaps.push({
                  labels: newInit,
                  datasets: [
                    {
                      label: "Swapped to Left of Pivot",
                      backgroundColor: bgColors,
                      borderColor: brdrColors,
                      borderWidth: 1,
                      hoverBackgroundColor: hBgColors,
                      hoverBorderColor: hBrdrColors,
                      data: newInit
                    }
                  ]
                });

                bgColors = [];
                brdrColors = [];
                hBgColors = [];
                hBrdrColors = [];
              } else {
                right.push(dataCopy[i]);
                //console.log("right:", right);
                newInit = newArr.concat(left, pivot, right);

                newInit.forEach(v => {
                  if (v === pivot) {
                    bgColors.push("rgba(255,99,132,0.2)");
                    brdrColors.push("rgba(255,99,132,1)");
                    hBgColors.push("rgba(255,99,132,0.4)");
                    hBrdrColors.push("rgba(255,99,132,1)");
                  } else if (left.includes(v)) {
                    bgColors.push("rgba(0, 102, 255,0.2)");
                    brdrColors.push("rgba(0, 102, 255,1)");
                    hBgColors.push("rgba(0, 102, 255,0.4)");
                    hBrdrColors.push("rgba(0, 102, 255,1)");
                  } else if (v === dataCopy[i] || right.includes(v)) {
                    bgColors.push("rgba(0, 102, 0,0.2)");
                    brdrColors.push("rgba(0, 102, 0,1)");
                    hBgColors.push("rgba(0, 102, 0,0.4)");
                    hBrdrColors.push("rgba(0, 102, 0,1)");
                  } else {
                    bgColors.push("rgba(0,102,128,0.2)");
                    brdrColors.push("rgba(0,102,128,1)");
                    hBgColors.push("rgba(0,102,128,0.4)");
                    hBrdrColors.push("rgba(0,102,128,1)");
                  }
                });

                orderedSwaps.push({
                  labels: newInit,
                  datasets: [
                    {
                      label: "Swapped to Right of Pivot",
                      backgroundColor: bgColors,
                      borderColor: brdrColors,
                      borderWidth: 1,
                      hoverBackgroundColor: hBgColors,
                      hoverBorderColor: hBrdrColors,
                      data: newInit
                    }
                  ]
                });

                bgColors = [];
                brdrColors = [];
                hBgColors = [];
                hBrdrColors = [];
              }
            }

            let last = newArr.concat(quickSort(left), pivot, quickSort(right));
            //console.log("last:", last);

            initialArr.forEach(() => {
              bgColors.push("rgba(0,102,128,0.2)");
              brdrColors.push("rgba(0,102,128,1)");
              hBgColors.push("rgba(0,102,128,0.4)");
              hBrdrColors.push("rgba(0,102,128,1)");
            });

            orderedSwaps.push({
              labels: last,
              datasets: [
                {
                  label: "Left + Pivot + Right",
                  backgroundColor: bgColors,
                  borderColor: brdrColors,
                  borderWidth: 1,
                  hoverBackgroundColor: hBgColors,
                  hoverBorderColor: hBrdrColors,
                  data: last
                }
              ]
            });

            bgColors = [];
            brdrColors = [];
            hBgColors = [];
            hBrdrColors = [];

            return last;
          }
        };

        quickSort(dataCopy);
        this.visualize(data, sortType, orderedSwaps, ms);
        break;

      default:
        break;
    }
  };

  render() {
    const { data, sortingActive, numbers } = this.state;
    return (
      <div className="container-fluid">
        <VisualData data={data} />
        <Options
          sortingActive={sortingActive}
          numbers={numbers}
          handleNumberChange={this.handleNumberChange}
          handleNumberSubmit={this.handleNumberSubmit}
          handleSortTypeChange={this.handleSortTypeChange}
          handleSortSpeedChange={this.handleSortSpeedChange}
          handleSortSubmit={this.handleSortSubmit}
          handleReset={this.handleReset}
          handleStop={this.handleStop}
        />
      </div>
    );
  }
}

export default App;
