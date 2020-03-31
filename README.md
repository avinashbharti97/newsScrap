# covid-19 news 

Get latest covid-19 summerized news from different India's news leading platform at same place
## Desktop view
![](covidNewsDesktop.gif)

## Mobile view
![]()
---
# Technology used

- nodejs
- expressjs
- request, JsDom

# About Project

- Provides an AI Powered summerized news(20% text size of original news )
- This project scrape latest covid-19 news from Times Of India, NDTV, India Times
- Scraping done every 30 min automatically with the help of cron job
- A react based frontend to consume the api generated by this project is available at https://github.com/avinashbharti97/newsScrapFrontend

## Api
   
    * To get the scraped Data
    loclhost:3000/news
## Requirements

For development, you will only need Node.js and a node global package, npm, installed in your environement.

### Node
- #### Node installation on Windows

  Just go on [official Node.js website](https://nodejs.org/) and download the installer.
Also, be sure to have `git` available in your PATH, `npm` might need it (You can find git [here](https://git-scm.com/)).

- #### Node installation on Ubuntu

  You can install nodejs and npm easily with apt install, just run the following commands.

      $ sudo apt install nodejs
      $ sudo apt install npm

- #### Other Operating Systems
  You can find more information about the installation on the [official Node.js website](https://nodejs.org/) and the [official NPM website](https://npmjs.org/).

If the installation was successful, you should be able to run the following command.

    $ node --version
    v8.11.3

    $ npm --version
    6.1.0

If you need to update `npm`, you can make it using `npm`! Cool right? After running the following command, just open again the command line and be happy.

    $ npm install npm -g


---

## Install

    $ git clone https://github.com/avinashbharti97/newsScrap
    $ cd newsScrap 
    $ npm install


## Running the project

    $ npm start

## Simple build for production

    $ npm build








