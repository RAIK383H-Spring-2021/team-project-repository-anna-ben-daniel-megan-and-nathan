class InviteesController < ApplicationController
  def index
    #get list of invitees
    respond_to do |format|
      format.json { render json: { status: 'invitees/index received request' } }
      end
  end

  def create
    #add invitee to an event
    respond_to do |format|
      format.json { render json: { status: 'invitees/create received request' } }
      end
  end
end
