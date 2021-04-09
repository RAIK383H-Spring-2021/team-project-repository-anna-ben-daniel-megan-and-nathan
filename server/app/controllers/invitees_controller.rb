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
    @host_id = Event.find_by(id: params[:event_id]).host_id

    if (!(@id == @host_id))
      respond_to do |format|
        format.json { render json: { error: :unauthorized }, status: :unauthorized }
      end

      return
    end

    @invitee = Participant.new(
      user_id: params[:user_id],
      event_id: params[:event_id],
      questionnaire_complete: params[:questionnaire_complete],
    )
    @invitee.save!

    respond_to do |format|
      format.json { render json: { id: @invitee[:id] } }
      end
  end
end
