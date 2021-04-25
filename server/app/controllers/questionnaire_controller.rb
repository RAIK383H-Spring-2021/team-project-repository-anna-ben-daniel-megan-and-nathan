include ComfortMetric

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
    @privacy_level = @user.privacy_level

    @event_ids = Participant.where(user_id: params[:id]).collect(&:event_id)
    @host_ids = @event_ids.map{ |id| Event.find(id).host_id }

    if(!(@id == @user.id) && !(@host_ids.include?(@id) && @privacy_level == 1))
      respond_to do |format|
        format.json { render json: { error: :unauthorized }, status: :unauthorized }
      end

      return
    end

    @questionnaire = Questionnaire.find(@user.questionnaire_id)
    q_JSON = @questionnaire.as_json(only: %i[id q1 q2 q3 q4 q5 q6 q7 q8 q9 q10 q11 q12 q13 q14 q15])

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
    @participant = Participant.where(event_id: params[:event_id]).find_by(user_id: @id)

    if(!(@participant) || !(@id == params[:id].to_i))
      respond_to do |format|
        format.json { render json: { error: :unauthorized }, status: :unauthorized }
      end

      return
    end

    @user = User.find_by(id: @id)
    @event = Event.find(params[:event_id])
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
      q14: params[:q14],
      q15: params[:q15],
    )

    metrics = ComfortMetric.generateTotalScore(@user.id, @event.id)

    @invitee = @participant.update(
      user_id: @id,
      event_id: params[:event_id],
      questionnaire_complete: 1,
      score: metrics[:total_score],
      location_score: metrics[:subscores][:location_score],
      masks_social_dist_score: metrics[:subscores][:masks_social_dist_score],
      group_size_score: metrics[:subscores][:group_size_score],
      food_score: metrics[:subscores][:food_score] || nil
    )

    updateEventScore(params[:event_id])

    q_JSON = @questionnaire.as_json(only: %i[id q1 q2 q3 q4 q5 q6 q7 q8 q9 q10 q11 q12 q13 q14 q15])

    respond_to do |format|
      format.json { render json: { questionnaire: {**q_JSON}, metrics: metrics } }
    end
  end

  private

  def updateEventScore(event_id)
    @responses = Participant.where(event_id: event_id).where(questionnaire_complete: true).length
    @invitees = Participant.where(event_id: event_id).length

    if (@responses / @invitees >= 0.8)
      @participants = Participant.where(event_id: event_id).where(questionnaire_complete: true).collect(&:user_id)
      @scores = @participants.map{ |id| Participant.where(event_id: event_id).find_by(user_id: id).score }
      @avg = @scores.sum(0.0) / @scores.size
      @event.update(score: @avg)
    end
  end
end
