class EventsController < ApplicationController
  include ComfortMetric

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
      score: nil,
      social_distancing_masks: params[:social_distancing_masks],
      social_distancing_no_masks: params[:social_distancing_no_masks]
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
    @authorized_invitees = Participant.where(event_id: params[:id]).collect(&:user_id)
    @event = Event.find_by(id: params[:id])
    
    if(@event == nil)
      respond_to do |format|
        format.json { render json: { error: :not_found }, status: :not_found }
      end

      return
    end

    # authorization: match id of host or invitee
    if (!(@id == @event.host_id) && !(@authorized_invitees.include?(@id)))
      respond_to do |format|
        format.json { render json: { error: :unauthorized }, status: :unauthorized }
      end

      return
    end

    @responses = Participant.where(event_id: params[:id]).where(questionnaire_complete: true).length
    @invitees = Participant.where(event_id: params[:id]).length

    @user_participant = Participant.where(event_id: params[:id]).find_by(user_id: @id)

    if @user_participant
      @subscores = {
        location_score: @user_participant.location_score, 
        masks_social_dist_score: @user_participant.masks_social_dist_score, 
        group_size_score: @user_participant.group_size_score, 
        food_score: @user_participant.food_score
      }
      @total_score = @user_participant.score
      @metrics = { subscores: @subscores, total_score: @total_score }
    end

    @host = User.find_by(id: @event.host_id)

    e_JSON = @event.as_json(only: %i[id title host_id description date_time food_prepackaged food_buffet location indoor outdoor remote score social_distancing_masks social_distancing_no_masks])

    respond_to do |format|
      format.json { render json: { event: {**e_JSON, responses: @responses, invitees: @invitees, host_email: @host.email, host_first_name: @host.first_name, host_last_name: @host.last_name, metrics: @metrics || [] } } }
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
      score: params[:score],
      social_distancing_masks: params[:social_distancing_masks],
      social_distancing_no_masks: params[:social_distancing_no_masks]
    )

    update_participants_and_event(@event)

    e_JSON = @event.as_json(only: %i[id title host_id description date_time food_prepackaged food_buffet location indoor outdoor remote score social_distancing_masks social_distancing_no_masks])
    
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

    @event_id = params[:id]
    @invitees = Participant.where(event_id: params[:id]).collect(&:id)

    Participant.destroy(@invitees)
    Event.destroy(@event_id)

    respond_to do |format|
      format.json { render json: { status: :ok } }
      end
  end

  private
  
  def update_participants_and_event(event)
    @responses = Participant.where(event_id: event.id).where(questionnaire_complete: true)

    @responses.each do |participant|
      @metrics = ComfortMetric.generateTotalScore(participant.user_id, participant.event_id)
      participant.update(
        score: @metrics[:total_score],
        location_score: @metrics[:subscores][:location_score],
        masks_social_dist_score: @metrics[:subscores][:masks_social_dist_score],
        group_size_score: @metrics[:subscores][:group_size_score],
        food_score: @metrics[:subscores][:food_score] || nil
      )
    end

    @total_invitees = Participant.where(event_id: event.id).length

    if (@responses.length / @total_invitees >= 0.8)
      @participants = @responses.collect(&:user_id)
      @scores = @participants.map{ |id| Participant.where(event_id: event.id).find_by(user_id: id).score }
      @avg = @scores.sum(0.0) / @scores.size
      event.update(score: @avg)
    end
  end
end
