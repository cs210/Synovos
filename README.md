# Predictivity

Team Predictivity's goal was to empower building managers to perfectly understand how buildings are being used. We created a web application that lets building managers visualize past and predict future occupancy data for their buildings on a room-based level, using the input from various sensor types (Co2, humidity, occupancy, light, ...). 

We documented all our results here:
- Deliverables Contract: [Link](https://docs.google.com/document/d/1-ukhlMXUFTjF5bEcbENf6f5bvX0perpOGn1yGpHHVTw/edit?usp=sharing)
- Project Summary: [Slidedeck](https://docs.google.com/presentation/d/1w2vqwME2XjXvJ0K5pTu7avIjo9anWkmk8A0gTjthroU/edit?usp=sharing) 
- Communication: 	[Slack](predictivityworkspace.slack.com)
- Documents: [GDrive](https://drive.google.com/open?id=1gd8iSW_obgrzy-6PcdXnFb0ZkSduXJZp)
- Website: [Link](tbd)

## Getting Started

As a first step, install all libraries using `npm install` and start MongoDB by running command `mongod`. Also, if you want to load our dummy data run the comman node `loadDatabase.js`.

## Running the app

You'll need to run both the frontend and the backend in separate terminal windows.

Frontend:

- `npm run build:w` (runs the frontend react app in development mode)
- Open [http://localhost:3000](http://localhost:3000) to view it in the browser

Backend:

- `nodemon webServer.js` (runs the backend node.js)
- The backend listens in your terminal

## Developing

This project uses the following for frontend:

- ReactJS
- [Create React App](https://github.com/facebook/create-react-app) (MAYBE TO-DO)
- [Material UI](https://material-ui.com/), a React implementation of [Material Design](https://material.io/design/).

And the following for backend:

- NodeJS
- MongoDB database
- (TODO - how to implement the Python backend for running ML models)

High-level code structure:

- `index.html` is entry point to the app and renders a single component: `App`
- `index.jsx` contains the implementation of the main `App` component.
- `webServer.js` contains the nodeJS backend.
- `\schema` contains the MongoDB schema.

Commit messages:

- Keep changes in your commits small and understandable
- Follow the commit format displayed on `git commit`
- When adding details on a commit message, focus on the "why" -- the "how" should be mostly evident from your change.
- More info on good commit messages: <https://chris.beams.io/posts/git-commit/>

### Walkthrough for adding a new feature X

- Create a local feature branch `git checkout -b <your name/github username>/feature_name`. 
  - E.g. `git checkout -b andrejsafundzic/organize_components` or `git checkout -b andrejsafundzic/create_new_dropdown_menu`
- Implement your changes.
- `npm run test` (TODO - not there yet) and `npm run lint`!
- `git add` the changed files, `git commit`, then push your changes to github: `git push -u origin <your branch name>`
- Open a pull request to merge your feature into master (the git push command will show you the command, or you can create a PR directly in github)
  - If a front-end change, include a screenshot in the PR description
- Request one reviewer and await review!
- Once the reviewer have Accepted your review, you can merge into master and delete the branch
- NOTE: for very minor edits such as fixing typos or updating comments, e.g. changes that _don't_ require a review, you can of course just make a local commit and push directly to master. If you're unsure, stick to making a PR.

### General guidelines

- Components live in `components/`
  - Each component should have its own file and (generally) export a single function component
- Code style
  - run `npm run lint` before committing
  - [StandardJS](https://standardjs.com/) as our style guide
  - [eslint](https://github.com/eslint/eslint) for linting
  - (Recommended environment is VSCode with the ESLint extension, configured to auto-format on save)
- We use "CSS in JS"
  - The css for a view doesn't live in a separate css file, but instead together with the typescript inside the same .tsx file.
  - CSS in JS simplifies project structure and keeps component style close to its implementation.
  - We use Material UI's solution <https://material-ui.com/styles/basics/#why-use-material-uis-styling-solution>.
- Avoid leaving TODOs, and instead create cards for technical work items on Trello.
- Comments.
  - First, organize your code and name things in a way that makes them easy to understand so that comments aren't necessary in the first place.
  - For complex/unintuitive logic or subtle/novel usage of a library, do leave comments!

### Guide for writing components

Say you're writing a component `Foobar`:

- Create `Foobar.jsx`
- Your file should export a single component.
- Try using *only* function components and avoid class components.
  In late 2018, React introduced Hooks, that allow you to have state and a bunch of other awesome functionality without all the boilerplate of writing React classes.
  Read https://reactjs.org/docs/hooks-overview.html.

#### Super fast iterations with Storybook (TO-DO NEEDS TO BE SETUP!!!)

- We use [Storybook](https://storybook.js.org/) to quickly iterate on developing a component.
  - Storybook allows you to specify a component and its inputs, and displays just that component in a auto-refreshing webpage.
  - This saves you the time of rerendering the *entire* app and doing *manual* operations to get to the view that you want to test.
- `npm run storybook` and take a look at `stories/` for examples

### Other useful resources

- Generating random csv files: <https://www.mockaroo.com/>
- We suggest the VSCode editor. It has great javascript support and some good extensions, such as:
  - ESLint
