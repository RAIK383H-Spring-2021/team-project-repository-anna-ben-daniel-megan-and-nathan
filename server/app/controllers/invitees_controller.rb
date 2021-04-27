class InviteesController < AuthController
  def index

    @id = general_auth || return
    @host_id = Event.find_by(id: params[:event_id]).host_id

    host_auth(@id, @host_id) || return

    @part = Participant.where(event_id: params[:event_id])
    @formatted = format_invitees(@part)

    respond_to do |format|
      format.json { render json: @formatted }
      end
  end

  def create

    @id = general_auth || return
    @event = Event.find_by(id: params[:event_id])

    host_auth(@id, @event.host_id) || return

    @user_ids = params[:user_ids]

    if @user_ids.include?(@event.host_id.to_s)
      respond_to do |format|
        format.json { render json: { error: "cannot invite host to their own event" }, status: :unprocessable_entity }
      end

      return
    end

    @invitee_ids = []
    @user_ids.each do |user_id|
      @invitee = Participant.new(
        user_id: user_id,
        event_id: params[:event_id],
      )
      @invitee.save!
      @invitee_ids.append(@invitee.id)
    end

    check_score(@event)

    respond_to do |format|
      format.json { render json: { ids: @invitee_ids } }
    end
  end

  private

  def check_score(event)
    @responses = Participant.where(event_id: @event.id).where(questionnaire_complete: true).length
    @invitees = Participant.where(event_id: @event.id).length

    if (@responses / @invitees < 0.8)
      event.update(score: nil)
    end
  end

  def format_invitees(invitees)
    formatted = []
    invitees.each do |invitee|
      @user = User.find(invitee.user_id)
      @privacy_level = @user.privacy_level

      if @privacy_level == 0
        formatted.append({ id: @user.id, first_name: @user.first_name, last_name: @user.last_name, email: @user.email })
      else
        if invitee.food_score
          subscores = { location_score: invitee.location_score, masks_social_dist_score: invitee.masks_social_dist_score, group_size_score: invitee.group_size_score, food_score: invitee.food_score }
        else
          subscores = { location_score: invitee.location_score, masks_social_dist_score: invitee.masks_social_dist_score, group_size_score: invitee.group_size_score }
        end

        metrics = { subscores: subscores, total_score: invitee.score }
        formatted.append({ id: @user.id, first_name: @user.first_name, last_name: @user.last_name, email: @user.email, metrics: metrics })
      end
    end

    return formatted
  end
end
