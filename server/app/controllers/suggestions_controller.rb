class SuggestionsController < AuthController
  include Suggestions

  def index

    @id = general_auth || return

    @event = Event.find_by(id: params[:event_id])

    host_auth(@id, @event.host_id) || return

    @responses = Participant.where(event_id: @event.id).where(questionnaire_complete: true).length
    @invitees = Participant.where(event_id: @event.id).length

    unless @responses / @invitees >= 0.8
      respond_to do |format|
        format.json { render json: { error: :not_found }, status: :not_found }
      end

      return
    end

    suggestions = Suggestions.generate(@event)

    respond_to do |format|
      format.json { render json: { suggestions: suggestions } }
    end
  end
end
