class UsersController < AuthController

  def index
    @id = general_auth || return
    @users = User.where(["email LIKE ? and id != ?", "#{params[:q]}%", "#{@id}"])

    @users = @users.map{ |user| user.as_json(only: %i[id email first_name last_name]) }

    respond_to do |format|
      format.json { render json: { users: @users } }
    end
  end

  def create
    @user_found = User.find_by(email: params[:email])

    if @user_found != nil
      respond_to do |format|
        format.json { render json: { error: 'email already registered' }, status: :conflict }
      end

      return
    end
    
    @new_questionnaire = Questionnaire.create()
    @new_user = User.new(email: params[:email], 
      first_name: params[:first_name], 
      last_name: params[:last_name],
      password: params[:password],
      password_confirmation: params[:password],
      questionnaire_id: @new_questionnaire.id,
      privacy_level: params[:privacy_level]
    )

    if !@new_user.save
      respond_to do |format|
        format.json { render json: { error: 'missing fields' }, status: :unprocessable_entity }
      end

      return
    end

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

    @id = general_auth || return

    user_auth(@id) || return
    
    @user = User.find(@id)
    @hosted_events = @user.events ? @user.events : []
    @hosted_events = @hosted_events.map{ |event| format_event(event.id) }

    @event_ids = Participant.where(user_id: params[:id]).collect(&:event_id)
    @invited_events = Event.find(@event_ids)
    @invited_events = @invited_events.map{ |event| format_event(event.id) }

    user_json = @user.as_json(only: %i[id email first_name last_name privacy_level])

    respond_to do |format|
      format.json { render json: {user: user_json, hosted_events: @hosted_events, invited_events: @invited_events } }
    end
  end

  def update

    @id = general_auth || return

    user_auth(@id) || return
    
    @user = User.find(@id)
    @user.update(
      email: params[:email],
      first_name: params[:first_name], 
      last_name: params[:last_name],
      privacy_level: params[:privacy_level]
    )

    user_json = @user.as_json(only: %i[id email first_name last_name privacy_level])

    respond_to do |format|
      format.json { render json: {user: user_json} }
    end
  end

  def login
    @user = User.find_by(email: params[:email])

    if !@user 
      respond_to do |format|
        format.json { render json: { error: 'user not found' }, status: :not_found }
      end

      return
    end

    if !@user.authenticate(params[:password])
      respond_to do |format|
        format.json { render json: { error: 'password incorrect' }, status: :unauthorized }
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

    @id = general_auth || return

    user_auth(@id) || return

    @other_event_ids = Participant.where(user_id: params[:id]).where(questionnaire_complete: true).collect(&:event_id)
    @new_event_ids = Participant.where(user_id: params[:id]).where(questionnaire_complete: false).collect(&:event_id)

    @other_events = Event.find(@other_event_ids)
    @new_events = Event.find(@new_event_ids)

    @other_events = @other_events.map{ |event| format_event_with_scores(event.id, params[:id]) }
    @new_events = @new_events.map{ |event| format_event(event.id) }

    respond_to do |format|
      format.json { render json: {new_events: @new_events, other_events: @other_events } }
    end
  end

  def events
    
    @id = general_auth || return

    user_auth(@id) || return
    
    @user = User.find(@id)
    @events = @user.events ? @user.events : []

    @events = @events.map{ |event| format_event(event.id) }

    respond_to do |format|
      format.json { render json: {events: @events } }
    end
  end

  private

  def format_event(event_id)
    @event = Event.find(event_id)
    @host = User.find(@event.host_id)
    @responses = Participant.where(event_id: @event.id).where(questionnaire_complete: true).length
    @invitees = Participant.where(event_id: @event.id).length

    @event_json = @event.as_json(only: %i[id title host_id description date_time food_prepackaged food_buffet location indoor outdoor remote score])

    return {**@event_json, host_email: @host.email, host_first_name: @host.first_name, host_last_name: @host.last_name, invitees: @invitees, responses: @responses }
  end

  def format_event_with_scores(event_id, user_id)
    @event = Event.find(event_id)
    @host = User.find(@event.host_id)
    @responses = Participant.where(event_id: @event.id).where(questionnaire_complete: true).length
    @invitees = Participant.where(event_id: @event.id).length

    @user_participant = Participant.where(event_id: event_id).find_by(user_id: user_id)
    @subscores = {
      location_score: @user_participant.location_score, 
      masks_social_dist_score: @user_participant.masks_social_dist_score, 
      group_size_score: @user_participant.group_size_score, 
      food_score: @user_participant.food_score
    }
    @total_score = @user_participant.score

    @event_json = @event.as_json(only: %i[id title host_id description date_time food_prepackaged food_buffet location indoor outdoor remote score])

    return {**@event_json, host_email: @host.email, host_first_name: @host.first_name, host_last_name: @host.last_name, invitees: @invitees, responses: @responses, metrics: {subscores: @subscores, total_score: @total_score} }
  end
  
end
