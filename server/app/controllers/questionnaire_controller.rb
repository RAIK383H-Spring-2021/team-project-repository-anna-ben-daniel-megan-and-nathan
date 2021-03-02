class QuestionnaireController < ApplicationController
  def show
    #TODO: Get current questionnaire responses
    respond_to do |format|
      format.json { render json: { status: 'Questionnaires controller show received request' } }
    end
  end

  def update
    #TODO: Update questionnaire responses
    respond_to do |format|
      format.json { render json: { status: 'Questionnaires controller update received request' } }
    end
  end
end
