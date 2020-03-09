import React from "react";

const Options = ({ ...props }) => {
  return (
    <div>
      <div>
        <label>
          Number:
          <input
            type="text"
            numbers={props.numbers}
            onChange={props.handleNumberChange}
          />
          {!props.sortingActive && (
            <button onClick={props.handleNumberSubmit}>New Data</button>
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
            onChange={props.handleSortTypeChange}
          />
          <label htmlFor="bubbleSort">Bubble Sort</label>
          <input
            type="radio"
            id="selectionSort"
            name="sortType"
            onChange={props.handleSortTypeChange}
          />
          <label htmlFor="selectionSort">Selection Sort</label>
          <input
            type="radio"
            id="insertionSort"
            name="sortType"
            onChange={props.handleSortTypeChange}
          />
          <label htmlFor="insertionSort">Insertion Sort</label>
          <input
            type="radio"
            id="heapSort"
            name="sortType"
            onChange={props.handleSortTypeChange}
          />
          <label htmlFor="heapSort">Heap Sort</label>
          <input
            type="radio"
            id="mergeSort"
            name="sortType"
            onChange={props.handleSortTypeChange}
          />
          <label htmlFor="mergeSort">Merge Sort</label>
          <input
            type="radio"
            id="quickSort"
            name="sortType"
            onChange={props.handleSortTypeChange}
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
            onChange={props.handleSortSpeedChange}
          />
          <label htmlFor="slowSort">Slow</label>
          <input
            type="radio"
            id="fastSort"
            name="sortSpeed"
            onChange={props.handleSortSpeedChange}
          />
          <label htmlFor="fastSort">Fast</label>
          <input
            type="radio"
            id="fastestSort"
            name="sortSpeed"
            onChange={props.handleSortSpeedChange}
          />
          <label htmlFor="fastSort">Fastest</label>
          {!props.sortingActive ? (
            <div>
              <button onClick={props.handleSortSubmit}>Sort!</button>
              <button onClick={props.handleReset}>Reset</button>
            </div>
          ) : (
            <div>
              <button onClick={props.handleStop}>Stop</button>
            </div>
          )}
        </label>
      </div>
    </div>
  );
};

export default Options;
