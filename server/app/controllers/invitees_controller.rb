class InviteesController < ApplicationController
  def index
    #TODO: get list of invitees
    @part = Participant.where(event_id: params[:event_id]).collect(&:user_id)
    @invitees = User.find(@part)

    respond_to do |format|
      format.json { render json: @invitees.as_json }
      end
  end

  def create
    #TODO: add invitee to an event
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
