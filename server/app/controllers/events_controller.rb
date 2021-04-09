class EventsController < ApplicationController
  def create
    #TODO: Create a new event

    if !authorized()
      respond_to do |format|
        format.json { render json: { error: :unauthorized }, status: :unauthorized }
      end

      return
    end

    @id = authorized()

    @event = Event.new(
      title: params[:title],
      host_id: @id,
      description: params[:description],
      date_time: params[:date_time],
      food_prepackaged: params[:food_prepackaged],
      food_buffet: params[:food_buffet],
      location: params[:location],
      indoor: params[:indoor],
      outdoor: params[:outdoor],
      remote: params[:remote],
      score: nil
    )

    if !@event.save
      respond_to do |format|
        format.json { render json: { error: :unprocessable_entity }, status: :unprocessable_entity }
      end
      return
    end

    respond_to do |format|
      format.json { render json: { id: @event[:id] } }
    end
  end

  def show
    #TODO: Get a specific event's details

    if !authorized()
      respond_to do |format|
        format.json { render json: { error: :unauthorized }, status: :unauthorized }
      end

      return
    end

    @id = authorized()
    @authorizedInvitees = Participant.where(event_id: params[:id]).collect(&:user_id)
    @event = Event.find_by(id: params[:id])
    
    if(@event == nil)
      respond_to do |format|
        format.json { render json: { error: :not_found }, status: :not_found }
      end

      return
    end

    # authorization: match id of host or invitee
    if (!(@id == @event.host_id) && !(@authorizedInvitees.include?(@id)))
      respond_to do |format|
        format.json { render json: { error: :unauthorized }, status: :unauthorized }
      end

      return
    end

    @responses = Participant.where(event_id: params[:id]).where(questionnaire_complete: true).length
    @invitees = Participant.where(event_id: params[:id]).length

    @host = User.find_by(id: @event.host_id)

    e_JSON = @event.as_json(only: %i[id title host_id description date_time food_prepackaged food_buffet location indoor outdoor remote score])

    respond_to do |format|
      format.json { render json: { event: {**e_JSON, responses: @responses, invitees: @invitees, host_email: @host.email, host_first_name: @host.first_name, host_last_name: @host.last_name} } }
      end
  end

  def update
    #TODO: update an event 
    if !authorized()
      respond_to do |format|
        format.json { render json: { error: :unauthorized }, status: :unauthorized }
      end

      return
    end

    @id = authorized()

    @event = Event.find_by(id: params[:id])

    if (!(@id == @event.host_id))
      respond_to do |format|
        format.json { render json: { error: :unauthorized }, status: :unauthorized }
      end

      return
    end

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
    if !authorized()
      respond_to do |format|
        format.json { render json: { error: :unauthorized }, status: :unauthorized }
      end

      return
    end

    @id = authorized()

    @event = Event.find_by(id: params[:id])

    if (!(@id == @event.host_id))
      respond_to do |format|
        format.json { render json: { error: :unauthorized }, status: :unauthorized }
      end

      return
    end

    @eventId = params[:id]
    @invitees = Participant.where(event_id: params[:id]).collect(&:id)

    Participant.destroy(@invitees)
    Event.destroy(@eventId)

    respond_to do |format|
      format.json { render json: { status: :ok} }
      end
  end
end
