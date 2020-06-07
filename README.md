# Predictivity

Team Predictivity's goal was to empower building managers to perfectly understand how buildings are being used. We created a web application that lets building managers visualize past and predict occupancy data for their buildings on a room-based level, using the input from various sensor types (Co2, temperature, ...). 

We documented all our results here:
- Project Summary: [Slidedeck](https://docs.google.com/presentation/d/1qpU_UKLbqJDZ6oZMdAlD6Jsx-QJ2avTraa9yf8MUtsM/edit?usp=sharing) 
- Sketches: [Figma](https://www.figma.com/file/wOsFS1qPWi37BpjUHW58na/CS210_Figma?node-id=0%3A1)
- Communication: 	[Slack](predictivityworkspace.slack.com)
- Teacher's College Data: [Gdrive](https://drive.google.com/open?id=1DFASDY-6bd1F9LfzzfqIgpeD1SUZT-J5)
- Website: [predictivity.io](http://predictivity.io/)

## Overview of the Code

We created our web application with a ReactJS frontend (using MaterialUI), NodeJS backend and MongoDB database. In the following a small guide where you can find what parts of the code.

### ReactJS Frontend ###
- The main `index.jsx` file that routes URL queries to the specific components can be found in the `src` folder
- The code for the frontend is located in the `components` folder. The whole web app is built in a modular way, which is why the compenents are split in different sub-folders.
TODO: Do we need data, images, public & styles, CS210 Heatmap???

### NodeJS Backend ###
- `webServer.js` is the source backend file. It includes routers that makes the backend more modular.
- The main part of the backend code can be found in the `routers` folder. `adminControl.js` controls the identity & access management part of the web app, `buildingsRouter.js` includes APIs for handling all the building data, and `sensorDataRouter.js` contains REST APIs for handling all the sensor data.

### MongoDB ###
We use MongoDB for storing our data. We have three schemas. User stores all user-related data (password, usernames, ...). Building stores all building related data (Buildings, Floors, Rooms). SensorData stores all the readings of the different types of sensors.


## Getting Started

You'll need to install NodeJS and MongoDB and set the node as well as mongod command as a path variables. As a next step, install all libraries using `npm install` and start MongoDB by running command `mongod`. You'll need to run both the frontend and the backend in separate terminal windows.

Frontend:

- `npm run build:w` (runs the frontend react app in development mode)
- Open [http://localhost:8081](http://localhost:8081) to view it in the browser

Backend:

- `nodemon webServer.js` (runs the backend node.js)
- The backend listens in your terminal

## Deploying

### Developing Locally
This is the process we used for developing locally:
1. Create a new branch from master: `git checkout -b /workspace`
2. Connect the remote branch: `git push --set-upstream origin /workspace`
3. Get current git status: `git status`
4. Update local personal branch with latest from remote master: `git pull --rebase origin master`
5. Process to commit changes: `git add, git commit, git push`
6.  Open a pull request on github to merge your branch into master This allows you to review the changes you're merging in one last time.

### Deploying to predictivity.io
We are hosting our webapp on AWS. Using CodePipeline, the code in the "ebs-deploy" branch is sent to an Elastic Beanstalk instance that compiles it and updates [our registered domain](predictivity.io). Once the latest commit is merged to master, you only need to push your changes to the 'ebs-deploy' branch. The changes will be reflected on [predictivity.io](predictivity.io)

