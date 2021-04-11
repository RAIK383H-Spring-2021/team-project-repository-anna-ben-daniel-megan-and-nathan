include Math

module ComfortMetric
  def generateTotalScore(userID, eventID)
    @event = Event.find(eventID)
    @user = User.find(userID)
    @quest = @user.questionnaire

    indoor = nil
    scores = []
    
    if (@event.indoor)
      indoor =  true
      locationScore = @quest.q1
    elsif (@event.outdoor)
      indoor = false
      locationScore = @quest.q2
    else
      locationScore = @quest.q3
      return locationScore
    end

    if (@event.food_prepackaged || @event.food_buffet)
      foodScore = generateFoodScore(@quest, @event, indoor)
    end

    masksSocialDistScore = generateMasksSocialDistancingScore(@quest, @event, indoor)
    groupSizeScore = generateGroupSizeScore(@quest, @event, indoor)

    if (foodScore)
      subscores = [locationScore, masksSocialDistScore, groupSizeScore, foodScore]
      avg = subscores.sum(0.0) / subscores.size
      return {subscores: subscores, totalScore: avg}
    else
      subscores = [locationScore, masksSocialDistScore, groupSizeScore]
      avg = subscores.sum(0.0) / subscores.size
      return {subscores: subscores, totalScore: avg}
    end
  end

  def generateFoodScore(quest, event, indoor)
    if (indoor)
      if event.food_prepackaged
        return quest.q7
      else
        return quest.q8
      end
    else
      if event.food_prepackaged
        return quest.q13
      else
        return quest.q14
      end
    end
  end

  def generateMasksSocialDistancingScore(quest, event, indoor)
    if (indoor)
      if (event.social_distancing_masks)
        indRisk = 1 / (feetToMeters(quest.q4) + 1)
        eventRisk = 1 / (feetToMeters(event.social_distancing_masks) + 1)
        indComfort = indRisk * findPenalty(quest, event, indoor)
        return indComfort > eventRisk ? 5 : maskSigmoid(eventRisk - indComfort)
      else
        indRisk = 6 / (feetToMeters(quest.q5) + 1)
        eventRisk = 6 / (feetToMeters(event.social_distancing_no_masks) + 1)
        indComfort = indRisk * findPenalty(quest, event, indoor)
        return indComfort > eventRisk ? 5 : maskSigmoid(eventRisk - indComfort)
      end
    else
      if (event.social_distancing_masks)
        indRisk = 1 / (feetToMeters(quest.q10) + 1)
        eventRisk = 1 / (feetToMeters(event.social_distancing_masks) + 1)
        indComfort = indRisk * findPenalty(quest, event, indoor)
        return indComfort > eventRisk ? 5 : maskSigmoid(eventRisk - indComfort)
      else
        indRisk = 6 / (feetToMeters(quest.q11) + 1)
        eventRisk = 6 / (feetToMeters(event.social_distancing_no_masks) + 1)
        indComfort = indRisk * findPenalty(quest, event, indoor)
        return indComfort > eventRisk ? 5 : maskSigmoid(eventRisk - indComfort)
      end
    end
  end

  def generateGroupSizeScore(quest, event, indoor)
    if (indoor)
      comfortSize = quest.q9
      eventSize = Participant.where(event_id: event.id).length
      return comfortSize > eventSize ? 5 : groupSigmoid(comfortSize - eventSize)
    else
      comfortSize = quest.q15
      eventSize = Participant.where(event_id: event.id).length
      return comfortSize > eventSize ? 5 : groupSigmoid(comfortSize - eventSize)
    end
  end

  private

  def findPenalty(quest, event, indoor)
    if (indoor)
      return event.social_distancing_masks ? 1 : 1.2 - (0.2 * quest.q6)
    else
      return event.social_distancing_masks ? 1 : 1.2 - (0.2 * quest.q12)
    end
  end

  def feetToMeters(x)
    return x / 3.281
  end

  def maskSigmoid(x)
    return (-8 / (1 + Math.exp(-x))) + 9
  end

  def groupSigmoid(x)
    return (-8 / (1 + Math.exp(-x))) + 1
  end

end