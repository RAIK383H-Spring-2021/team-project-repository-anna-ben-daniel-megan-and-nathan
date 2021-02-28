class EventsController < ApplicationController
  def create
    #TODO: Create a new event
    respond_to do |format|
      format.json { render json: { status: '/events/create received request' } }
    end
  end

  def show
    #TODO: Get a specific event's details
    respond_to do |format|
      format.json { render json: { status: '/events/show received request' } }
      end
  end

  def update
    #TODO: update an event
    respond_to do |format|
      format.json { render json: { status: '/events/update received request' } }
      end
  end

  def destroy
    #TODO: delete an event
    respond_to do |format|
      format.json { render json: { status: '/events/destroy received request' } }
      end
  end
end
