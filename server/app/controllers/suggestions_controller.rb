include Suggestions

class SuggestionsController < ApplicationController
  def index
    
    if !authorized()
      respond_to do |format|
        format.json { render json: { error: :unauthorized }, status: :unauthorized }
      end

      return
    end

    @id = authorized()

    @event = Event.find_by(id: params[:event_id])

    if (!(@id == @event.host_id))
      respond_to do |format|
        format.json { render json: { error: :unauthorized }, status: :unauthorized }
      end

      return
    end

    suggestions = Suggestions.generate(@event)

    respond_to do |format|
      format.json { render json: { suggestions: suggestions } }
    end
  end
end
