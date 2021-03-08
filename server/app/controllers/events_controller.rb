class EventsController < ApplicationController
  def create
    #TODO: Create a new event
    @event = Event.new(
      title: params[:title],
      host_id: params[:host_id],
      description: params[:description],
      date_time: params[:date_time],
      food_prepackaged: params[:food_prepackaged],
      food_buffet: params[:food_buffet],
      location: params[:location],
      indoor: params[:indoor],
      outdoor: params[:outdoor],
      remote: params[:remote],
      score: params[:score]
    )

    @event.save!
    respond_to do |format|
      format.json { render json: { id: @event[:id] } }
    end
  end

  def show
    #TODO: Get a specific event's details
    @event = Event.find(params[:id])
    e_JSON = @event.as_json(only: %i[id title host_id description date_time food_prepackaged food_buffet location indoor outdoor remote score])

    respond_to do |format|
      format.json { render json: e_JSON }
      end
  end

  def update
    #TODO: update an event
    @event = Event.find_by(id: params[:id])
    @event.update(
      title: params[:title],
      host_id: params[:host_id],
      description: params[:description],
      date_time: params[:date_time],
      food_prepackaged: params[:food_prepackaged],
      food_buffet: params[:food_buffet],
      location: params[:location],
      indoor: params[:indoor],
      outdoor: params[:outdoor],
      remote: params[:remote],
      score: params[:score]
    )

    e_JSON = @event.as_json(only: %i[id title host_id description date_time food_prepackaged food_buffet location indoor outdoor remote score])
    
    respond_to do |format|
      format.json { render json: e_JSON }
      end
  end

  def destroy
    #TODO: delete an event
    @event = params[:id]

    Event.destroy(@event)

    respond_to do |format|
      format.json { render json: { status: '/events/destroy received request' } }
      end
  end
end
