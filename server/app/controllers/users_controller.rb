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

    if @user_found != []
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

      @token = encode({user_id: @new_user.id})
      respond_to do |format|
        format.json { render json: { user: @new_user, token: @token } }
      end
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

    @user = User.find_by(email: params[:email])

    if @user && @user.authenticate(params[:password])
      token = encode({ user_id: @user.id })
      respond_to do |format|
        format.json { render json: { user: @user, token: token } }
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

    respond_to do |format|
      format.json { render json: { status: 'users controller events successfully received request' } }
    end
  end
end
