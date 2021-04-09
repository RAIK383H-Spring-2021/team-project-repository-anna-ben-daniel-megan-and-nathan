class QuestionnaireController < ApplicationController
  def show
    #TODO: Get current questionnaire responses
    # auth matches either id OR the user has questionnaire sharing on
    if !authorized()
      respond_to do |format|
        format.json { render json: { error: :unauthorized }, status: :unauthorized }
      end

      return
    end

    @id = authorized()
    @user = User.find_by(id: params[:id])

    if(!(@id == params[:id].to_i) && !(@user.privacy_level == 1))
      respond_to do |format|
        format.json { render json: { error: :unauthorized }, status: :unauthorized }
      end

      return
    end

    @questionnaire = Questionnaire.find(@user.questionnaire_id)
    q_JSON = @questionnaire.as_json(only: %i[id q1 q2 q3 q4 q5 q6 q7 q8 q9 q10 q11 q12 q13])

    respond_to do |format|
      format.json { render json: q_JSON }
    end
  end

  def update
    #TODO: Update questionnaire responses
    #Just the user can update it
    if !authorized()
      respond_to do |format|
        format.json { render json: { error: :unauthorized }, status: :unauthorized }
      end

      return
    end

    @id = authorized()

    if(!(@id==params[:id].to_i))
      respond_to do |format|
        format.json { render json: { error: :unauthorized }, status: :unauthorized }
      end

      return
    end

    @user = User.find_by(id: params[:id])
    @questionnaire = Questionnaire.find(@user.questionnaire_id)
    @questionnaire.update(
      q1: params[:q1],
      q2: params[:q2],
      q3: params[:q3],
      q4: params[:q4],
      q5: params[:q5],
      q6: params[:q6],
      q7: params[:q7],
      q8: params[:q8],
      q9: params[:q9],
      q10: params[:q10],
      q11: params[:q11],
      q12: params[:q12],
      q13: params[:q13],
    )
    q_JSON = @questionnaire.as_json(only: %i[id q1 q2 q3 q4 q5 q6 q7 q8 q9 q10 q11 q12 q13])

    respond_to do |format|
      format.json { render json: q_JSON }
    end
  end
end
