class UsersController < ApplicationController

  def index
    # TODO: get all users matching query (uses ?q=...)

    respond_to do |format|
      format.json { render json: { status: 'users controller index successfully received request' } }
    end
  end

  def create
    # TODO: take user info sent via post request and push new user into database

    @user_found = User.find_by(email: params[:email])

    if @user_found != nil
      respond_to do |format|
        format.json { render json: { status: 'email already registered' } }
      end
    else
      @new_questionnaire = Questionnaire.create()
      @new_user = User.create(email: params[:email], 
        first_name: params[:first_name], 
        last_name: params[:last_name],
        password: params[:password],
        password_confirmation: params[:password],
        questionnaire_id: @new_questionnaire.id,
        privacy_level: params[:privacy_level]
      )

      @token = encode({
          sub: @new_user.id,
          name: @new_user.first_name,
          iat: Time.now.to_i
        })
      respond_to do |format|
        format.json { render json: { token: @token } }
      end
    end
  end

  def show
    # TODO: query database for user corresponding to the :id and return corresponding information

    @id = authorized()
    
    if (@id == params[:id].to_i)
      @user = User.find_by(id: @id)
      @events = @user.events ? @user.events : []

      userJson = @user.as_json(only: %i[id email first_name last_name privacy_level])

      respond_to do |format|
        format.json { render json: {user: userJson, events: @events } }
      end
    else
      respond_to do |format|
        format.json { render json: { status: :unauthorized } }
      end
    end
  end

  def update
    # TODO: update corresponding user entry with new user information

    @id = authorized()
    
    if (@id == params[:id].to_i)
      @user = User.find_by(id: @id)
      @user.update(
        email: params[:email],
        first_name: params[:first_name],
        last_name: params[:last_name],
        privacy_level: params[:privacy_level]
      )

      userJson = @user.as_json(only: %i[id email first_name last_name privacy_level])

      respond_to do |format|
        format.json { render json: {user: userJson} }
      end
    else
      respond_to do |format|
        format.json { render json: { status: :unauthorized } }
      end
    end
  end

  def login
    # TODO: find corresponding user in query if exists, otherwise be sad :(

    @user = User.find_by(email: params[:email])

    if @user && @user.authenticate(params[:password])
      token = encode({
          sub: @user.id,
          name: @user.first_name,
          iat: Time.now.to_i
        })
      respond_to do |format|
        format.json { render json: { token: token } }
      end
    else
      respond_to do |format|
        format.json { render json: { status: 'user not found' } }
      end
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

    @id = authorized()
    
    if (@id == params[:id].to_i)
      @user = User.find_by(id: @id)
      @events = @user.events ? @user.events : []

      respond_to do |format|
        format.json { render json: {events: @events } }
      end
    else
      respond_to do |format|
        format.json { render json: { status: :unauthorized } }
      end
    end
  end
  
end
