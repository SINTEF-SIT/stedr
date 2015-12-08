# stedr

stedr is a mobile application for discovering, creating and sharing digital stories related to places. The name of the application stems from the Norwegian word sted (plural steder) for place. Anyone can create and share new places and new stories.

stedr is developed in connection to the [EU/FP7 IST research project TAG CLOUD](http://www.tagcloudproject.eu/). The aim is to engage a wider public in culture heritage. Both digital storytelling and social media are topics addressed by the project, hence the idea of developing an application that combines cultural and social stories.

The idea about stedr was first elaborated by [SINTEF ICT](http://www.sintef.no/sintef-ikt/). It was then refined and the application was developed through the guidance of students at the [Department of Computer and Information Science at NTNU](http://www.ntnu.edu/idi).

# Developer Guide

stedr is written with [Ionic Framework](http://ionicframework.com/) and runs on mobile units using [Apache Cordova](http://cordova.apache.org/). Thus, the respective developer guides applies: [Ionic](http://ionicframework.com/docs/guide/preface.html), [Cordova](http://cordova.apache.org/docs/en/latest/guide/overview/).

## Navigate the project
All styling is found in the *scss* folder

All templates are found in *www/templates*

The application is initialised in *www/js/app.js*
The controllers is in *www/js/controllers.js* and they rely on *services.js* to fetch content from the server
