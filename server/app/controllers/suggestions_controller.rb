class SuggestionsController < ApplicationController
  def index
    #TODO: Get overview of suggestions
      respond_to do |format|
        format.json { render json: { status: 'Suggestions controller index received request' } }
      end
  end

  def show
    #TODO: Get overview of a particular suggestion
    respond_to do |format|
      format.json { render json: { status: 'Suggestions controller show received request' } }
    end
  end
end
