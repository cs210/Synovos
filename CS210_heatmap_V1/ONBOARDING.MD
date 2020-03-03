Commands to start running our application:

TODO: Add here

Useful GitHub commands:

<Create a new branch from master>
git checkout -b <name>/workspace

<Connect the remote branch>
git push --set-upstream origin <name>/workspace

<Get current git status>
git status

<Update local personal branch with latest from remote master>
<Most important command!!!>
git pull --rebase origin master

<Process to commit changes>
git add .
git commit -m "<Commit message>"
git push


<To put changes into master so that we all can use them>

Open a pull request on github to merge your branch into master
This allows you to review the changes you're merging in one last time
Or... maybe skip the reviewing and use some terminal based command?


<How to run the code>
Do the following things first
1. install node.js and set the node command as a path variable
2. install mongodb and set the mongodb command as a path variable

Run the code with the following commands in your directory:
1. npm install 
2. To run mongodb -> write "mongod"
3. To load the database -> "node loadDatabase.js" (this file has a few entries for our database!)
4. To run the view and keep it updated -> "npm run build:w"
5. To run the backend and keep it updated -> "nodemon webServer.js"
6. All the "model" code, i.e. the database, is in loadDatabase.js and in the "schema" directory
7. All the "controller" code, i.e. the backend, is in webServer.js
All the "view"code, i.e. the frontend, is in index.jsx and the component directory


