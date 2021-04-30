# Shindig



Megan Chaffey, Nathan Gentry, Anna Krueger, Ben Lohrman, Daniel Noon

This project is comprised of a React+TypeScript web client 

## Client

### Technologies

* **React**: allowed us to create UI components following the function component + hooks pattern. Routing is handled by react-router, and several simple hooks were written exclusively for use in Shindig.
* **TypeScript**: used for all code in the project, which provides a strong, null-safe type system. This enables us to write better code and collaborate more effectively. 
* **Storybook**: helped us design, prototype, and test React components isolated from the rest of the app. You can view the Storybook at https://storybook.shindig.one

In addition to these significant technologies, several small npm packages were used, such as a handful of Google’s material design components, rc-slider, jwt-decode, workbox, and others.

### Structure

In the top-level `client` directory, you will find several files and folders:

```
.storybook	 		- storybook configuration
public				- static assets to be served
│					  along with the compiled react app
└─ manifest.json	- metadata about our progressive web app
src					- the root of the react app
-----------------
package.json		list of dependencies, metadata, build/develop/test script definitions
tsconfig.json		typescript compiler options
```

In the `src` folder, there are additional important files and folders:

```
components			- any and all custom components (there are many)
					  can be found here.
hooks				- custom hooks.
models				- interfaces or classes representing a server response.
pages				- special components that represent entire pages.
└─ partials			- added late in development, place for sections
					  of pages that have become unwieldy.
resources			- an idea we had early in development to keep
					  server-client communications isolated from the app,
					  rarely used in practice.
stories				- component metadata for storybook.
util				- utility functions or classes for use throughout the app.
------------------
api.ts				- contains a helper class to maintain authorization,
					  abstract communications, cache fetch results, update
					  the cache, and deal with URLs.
App.tsx				- base component wrapping all other components and pages.
					  imports base CSS, deals with routing and authorization
					  guards, etc.
index.tsx			- bootstraps React, service worker
theme.ts			- stores theme information for dark and light themes,
					  type information for theming.
User.ts				- logic for user-specific data. we want to make the app
					  performant but behave as expected, i.e, we need to make
					  sure we have the most up-to-date information on the user.
					  To achieve this, User.ts queries the name and email
                      stored in the authorization token to display to the user.
                      However, as soon as an opportunity arises, this
                      we fetch newer data from the server--profile data,
                      questionnaire data, etc. This information is also cached
                      in case the user goes offline.
```



## Server

### Technologies

Our backend API is built using the framework Ruby on Rails. Because our frontend is written separately, we do not utilize the views that Rails is capable of creating.

Our API is a JSON REST API, and each controller action responds to requests with an accurate HTTP status and JSON object containing the requested information/error message.

### Backend Structure

Our application utilizes MVC, and our backend reflects this. Our logic is separated into a series of controllers within the `server/app/controllers/` directory. Referenced functionality for things such as the comfort metric calculation and suggestion generation can be found within the `server/lib/` directory.

The models can be found within the `/server/app/models/` directory. Most of them are fairly simple, with relations and validations defined but kept relatively slim for readability.

Our tests can be found in the `/server/spec/` directory, and the corresponding code coverage metrics can be found within the `/server/coverage/` directory as well. We use the testing framework RSpec to run our testing suites, which are comprised of tests for all controllers and models, along with our comfort metric and suggestion generation calculations.

### API Structure

```
  /users
  |   POST /                          -> create new user (account creation)
  |   POST /login                     -> get user auth token (login)
  |   GET  /:user_id                  -> get user profile data
  |   PUT  /:user_id                  -> update user profile data
  |   
  |   /:user_id
  |   |   GET /invitations            -> get events user is invited to
  |   |   GET /events                 -> get events user has created
  |   |   GET /questionnaire          -> get user's questionnaire
  |
  /events
  |   POST    /                       -> create an event
  |   GET     /:event_id              -> get event details
  |   PUT     /:event_id              -> update event
  |   DELETE  /:event_id              -> delete event
  |
  |   /:event_id
  |   |   GET  /invitees              -> get list of invitees for event
  |   |   POST /invitees              -> add invitee to event
  |   |   GET  /suggestions           -> get suggestions for event
  |   |   
  |   |   /invitees/:user_id (user id corresponding to invitee)
  |   |   |   PUT /questionnaire      -> update user questionnaire and calculate comfort score for event
  |   |
  |
```

## Deploying

Our application is currently deployed using Heroku and Vercel! Visit it at https://shindig.one.

However, if you REALLY want to run it locally, here's some instructions!

### Deploying the Frontend Locally

Getting the front-end up and running on your local device is extremely simple.

1. If you haven’t already, install Node.js (this will also install npm)
2. Open a terminal session and `cd` into the `client` directory
3. Run `npm i` to install dependencies
4. Run `npm start` to start a development server
5. The dev server should open Shindig in your default browser automatically.
   * If it fails to do so, open http://localhost:3000 in your browser.

### Deploying the Backend Locally

This is more complicated than the frontend. Requirements to run this application:

* Ruby, specifically version `2.7.2`
* PostgreSQL

Once you have those two things installed on your computer, do the following:

* `cd` into the `server/` directory
* Run: `bundle install`. This will install the necessary Gems defined in our `Gemfile`.
* Go into the `config/` directory and open `database.yml`. Here, you need to edit the `username` and `password` fields to match your PostgreSQL credentials.
* Run: `rails db:create` followed by `rails db:create RAILS_ENV=test`. This creates the development and testing databases.
* Run: `rails db:migrate` followed by `rails db:migrate RAILS_ENV=test`. This will create the tables and columns in the databases.
* Run: `rails s`. This will begin serving the backend so that it can be interacted with.

From here you should be good to go! If you want to run our tests, simply run the `rspec` command.
