# Shindig

\[short description]

Megan Chaffey, Nathan Gentry, Anna Krueger, Ben Lohrman, Daniel Noon

This project has two parts:

- Client
  - Written in React + Typescript
  - Mobile-First
  - PWA
  - Capacitor

## Client

add documentation here :D

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

Our application is currently deployed using Heroku! Visit it at https://shindig.one.

However, if you REALLY want to run it locally, here's some instructions!

### Deploying the Frontend Locally

### Deploying the Backend Locally

This is more complicated than the frontend. Requirements to run this application:

* Ruby, specifically version `2.7.2`
* PostgreSQL

Once you have those two things installed on your computer, do the following:

* `cd` into the `server/` directory
* Run: `bundle install`. This will install the necessary Gems defined in our `Gemfile`.
* Run: `rails db:create` followed by `rails db:create RAILS_ENV=test`. This creates the development and testing databases.
* Run: `rails db:migrate` followed by `rails db:migrate RAILS_ENV=test`. This will create the tables and columns in the databases.
* Run: `rails s`. This will begin serving the backend so that it can be interacted with.

From here you should be good to go! If you want to run our tests, simply run the `rspec` command.
