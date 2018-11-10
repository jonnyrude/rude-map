# Neighborhood Map (Reat) Project

This is my completed project for Udacity's React Fundamentals course, part of the Front End Nanodegree. No starter code was provided for this project.

My neighborhood map is a single page web application built with React. It lists 15 cafe's in the south Denver-Metro area, displays their locations wiht markers on a Google Map, and allows for the user to search through the list by typing into the filter field.

## To Run this App:

* Clone or download the project
* In a terminal:
  * `cd` into the root folder
  * install all project dependencies by running `yarn install` (only need to do this once)
  * start the development server with `yarn start` (this start a local server and open a web browser tab to the project)

## Features
The locations for this app are hard-coded. There is no search functionality.

The photo, Foursquare rating, and hours of operation information (if available) are retrieved from the Foursquare API, so this information is live.

Clicking on a list item will bounce the corresponding map marker and open an Info Window with information about that cafe.

Clicking the bouncing icon will stop the bouncing. Constant bouncing gets annoying, and I thought this would be an intuitive way to stop it.


## Attributions:
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

This project utilizes [the Foursquare Places API](https://developer.foursquare.com/docs/api).

