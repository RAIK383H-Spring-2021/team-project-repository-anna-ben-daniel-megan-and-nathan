class UsersController < ApplicationController

  def index
    if !authorized()
      respond_to do |format|
        format.json { render json: { status: :unauthorized } }
      end

      return
    end

    @users = User.where("email LIKE ?", "#{params[:q]}%")

    @users = @users.map{ |user| user.as_json(only: %i[id email first_name last_name]) }

    respond_to do |format|
      format.json { render json: { users: @users } }
    end
  end

  def create
    @user_found = User.find_by(email: params[:email])

    if @user_found != nil
      respond_to do |format|
        format.json { render json: { status: 'email already registered' } }
      end

      return
    end
    
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

  def show

    if !authorized()
      respond_to do |format|
        format.json { render json: { status: :unauthorized } }
      end

      return
    end

    @id = authorized()

    if (!@id == params[:id].to_i)
      respond_to do |format|
        format.json { render json: { status: :unauthorized } }
      end

      return
    end
    
    @user = User.find(@id)
    @hosted_events = @user.events ? @user.events : []

    @hosted_events = @hosted_events.map{ |event| formatEvent(event.id) }

    @event_ids = Participant.where(user_id: params[:id]).collect(&:event_id)
    @invited_events = Event.find(@event_ids)

    @invited_events = @invited_events.map{ |event| formatEvent(event.id) }

    userJson = @user.as_json(only: %i[id email first_name last_name privacy_level])

    respond_to do |format|
      format.json { render json: {user: userJson, hosted_events: @hosted_events, invited_events: @invited_events } }
    end
  end

  def update

    if !authorized()
      respond_to do |format|
        format.json { render json: { status: :unauthorized } }
      end

      return
    end

    @id = authorized()

    if (!@id == params[:id].to_i)
      respond_to do |format|
        format.json { render json: { status: :unauthorized } }
      end

      return
    end
    
    @user = User.find(@id)
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
  end

  def login
    @user = User.find_by(email: params[:email])

    if !@user 
      respond_to do |format|
        format.json { render json: { status: 'user not found' } }
      end

      return
    end

    if !@user.authenticate(params[:password])
      respond_to do |format|
        format.json { render json: { status: 'password incorrect' } }
      end

      return
    end

    token = encode({
        sub: @user.id,
        name: @user.first_name,
        iat: Time.now.to_i
      })
    respond_to do |format|
      format.json { render json: { token: token } }
    end
  end

  def invitations

    if !authorized()
      respond_to do |format|
        format.json { render json: { status: :unauthorized } }
      end

      return
    end

    @id = authorized()

    if (!@id == params[:id].to_i)
      respond_to do |format|
        format.json { render json: { status: :unauthorized } }
      end

      return
    end

    @event_ids = Participant.where(user_id: params[:id]).collect(&:event_id)
    @events = Event.find(@event_ids).map{ |event| formatEvent(event.id) }

    #@events = @events.map{ |event| formatEvent(event.id) }

    respond_to do |format|
      format.json { render json: {events: @events } }
    end
  end

  def events

    if !authorized()
      respond_to do |format|
        format.json { render json: { status: :unauthorized } }
      end

      return
    end
    
    @id = authorized()

    if (!@id == params[:id].to_i)
      respond_to do |format|
        format.json { render json: { status: :unauthorized } }
      end

      return
    end
    
    @user = User.find(@id)
    @events = @user.events ? @user.events : []

    @events = @events.map{ |event| formatEvent(event.id) }

    respond_to do |format|
      format.json { render json: {events: @events } }
    end
  end

  private

  def formatEvent(event_id)
    @event = Event.find_by(id: event_id)
    @responses = Participant.where(event_id: @event.id).where(questionnaire_complete: true).length
    @invitees = Participant.where(event_id: @event.id).length

    @event_json = @event.as_json(only: %i[id title host_id description date_time food_prepackaged food_buffet location indoor outdoor remote score])

    return {**@event_json, invitees: @invitees, responses: @responses }
  end
  
end
