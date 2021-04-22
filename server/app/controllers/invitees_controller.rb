class InviteesController < ApplicationController
  def index
    #TODO: get list of invitees
    if !authorized()
      respond_to do |format|
        format.json { render json: { error: :unauthorized }, status: :unauthorized }
      end

      return
    end

    @id = authorized()
    @host_id = Event.find_by(id: params[:event_id]).host_id

    if (!(@id == @host_id))
      respond_to do |format|
        format.json { render json: { error: :unauthorized }, status: :unauthorized }
      end

      return
    end

    @part = Participant.where(event_id: params[:event_id]).collect(&:user_id)
    @invitees = User.find(@part)

    respond_to do |format|
      format.json { render json: @invitees.as_json }
      end
  end

  def create
    #TODO: add invitee to an event

    # pretty sure we can use before_action for this stuff, but leaving it like this for now
    if !authorized()
      respond_to do |format|
        format.json { render json: { error: :unauthorized }, status: :unauthorized }
      end

      return
    end

    @id = authorized()
    @event = Event.find_by(id: params[:event_id])
    @host_id = @event.host_id

    if (!(@id == @host_id))
      respond_to do |format|
        format.json { render json: { error: :unauthorized }, status: :unauthorized }
      end

      return
    end

    @user_ids = params[:user_ids]

    if @user_ids.include?(@host_id.to_s)
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

    checkScore(@event)

    respond_to do |format|
      format.json { render json: { ids: @invitee_ids } }
    end
  end

  private

  def checkScore(event)
    @responses = Participant.where(event_id: @event.id).where(questionnaire_complete: true).length
    @invitees = Participant.where(event_id: @event.id).length

    if (@responses / @invitees < 0.8)
      event.update(score: nil)
    end
  end
end
