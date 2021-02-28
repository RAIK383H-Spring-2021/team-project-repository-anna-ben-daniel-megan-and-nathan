class UsersController < ApplicationController
  def index
    # TODO: get all users matching query (uses ?q=...)

    respond_to do |format|
      format.json { render json: { status: 'users controller index successfully received request' } }
    end
  end

  def create
    # TODO: take user info sent via post request and push new user into database

    respond_to do |format|
      format.json { render json: { status: 'users controller create successfully received request' } }
    end
  end

  def show
    # TODO: query database for user corresponding to the :id and return corresponding information

    respond_to do |format|
      format.json { render json: { status: 'users controller show successfully received request' } }
    end
  end

  def update
    # TODO: update corresponding user entry with new user information

    respond_to do |format|
      format.json { render json: { status: 'users controller update successfully received request' } }
    end
  end

  def login
    # TODO: find corresponding user in query if exists, otherwise be sad :(

    respond_to do |format|
      format.json { render json: { status: 'users controller login successfully received request' } }
    end
  end

  def invitations
    # TODO: get all events a specified user is invited to

    respond_to do |format|
      format.json { render json: { status: 'users controller invitations successfully received request' } }
    end
  end

  def events
    # TODO: get all events a specified user has created

    respond_to do |format|
      format.json { render json: { status: 'users controller events successfully received request' } }
    end
  end
end
