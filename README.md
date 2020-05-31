# Visual Sort

Step-by-step visual of various sorting algorithms on random data sets - built with React.

## Live Demo

https://dzrana.github.io/visual-sort/

#### Sample:

![Visual Sort Demo](demo/v-s_demo.gif)

## Purpose

#### Overview:

This project was meant as an aid to help visualize the code for several different sorting algorithms as the data was being sorted. I found it to be easier to understand the concepts behind each when I could see every number become sorted one-by-one.

#### Challenges:

Using React, the biggest challenge for this project was "animating" the swaps to show the sorting, seemingly, in real time. My initial solution was to store the state of the array after every swap then, using `setState()`, running through them all, setting the state to each one to update the graph and show the dataset at that time. I found that this wasn't the full solution as `setState()` batches updates and only showed the last dataset which was the array having been fully sorted. My solution for this was to set a timeout after each iteration. This allowed me to not only show each swap, but to set options for different speeds at which the sorting can be shown. Aside from this, figuring out which swaps to show and how when working with recursive implementations of some of these sorting algorithms was also a bit of a challenge.

#### Conclusion:

Using React and `Chart.js` to "animate" these sorting algorithms helped me explore the more subtle inner-workings of React and gave me a deeper understanding of how things work under the hood.
