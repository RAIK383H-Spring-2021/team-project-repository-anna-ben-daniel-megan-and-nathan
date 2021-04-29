module ComfortMetric
  include Math
  
  def self.generate_total_score(userID, eventID)
    @event = Event.find(eventID)
    @user = User.find(userID)
    @quest = @user.questionnaire

    indoor = nil
    scores = []
    
    if (@event.indoor)
      indoor =  true
      location_score = @quest.q1
    elsif (@event.outdoor)
      indoor = false
      location_score = @quest.q2
    else
      location_score = @quest.q3
      return { total_score: location_score, subscores: {} }
    end

    if (@event.food_prepackaged || @event.food_buffet)
      foodScore = generate_food_score(@quest, @event, indoor)
    end

    masks_social_dist_score = generate_masks_social_distancing_score(@quest, @event, indoor)
    group_size_score = generate_group_size_score(@quest, @event, indoor)

    if (foodScore)
      score_arr = [location_score, masks_social_dist_score, group_size_score, foodScore]
      subscores = { location_score: location_score, masks_social_dist_score: masks_social_dist_score, group_size_score: group_size_score, food_score: foodScore }
      avg = score_arr.sum(0.0) / score_arr.size
      return {subscores: subscores, total_score: avg}
    else
      score_arr = [location_score, masks_social_dist_score, group_size_score]
      subscores = { location_score: location_score, masks_social_dist_score: masks_social_dist_score, group_size_score: group_size_score }
      avg = score_arr.sum(0.0) / score_arr.size
      return {subscores: subscores, total_score: avg}
    end
  end

  def self.generate_food_score(quest, event, indoor)
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

  def self.generate_masks_social_distancing_score(quest, event, indoor)
    if (indoor)
      if (event.social_distancing_masks)
        ind_risk = 1 / (feet_to_meters(quest.q4) + 1)
        event_risk = 1 / (feet_to_meters(event.social_distancing_masks) + 1)
        return ind_risk >= event_risk ? 5 : mask_sigmoid(event_risk - ind_risk)
      else
        ind_risk = 6 / (feet_to_meters(quest.q5) + 1)
        event_risk = 6 / (feet_to_meters(event.social_distancing_no_masks) + 1)
        ind_comfort = ind_risk * find_penalty(quest, event, indoor)
        return ind_comfort >= event_risk ? 5 : mask_sigmoid(event_risk - ind_comfort)
      end
    else
      if (event.social_distancing_masks)
        ind_risk = 1 / (feet_to_meters(quest.q10) + 1)
        event_risk = 1 / (feet_to_meters(event.social_distancing_masks) + 1)
        return ind_risk >= event_risk ? 5 : mask_sigmoid(event_risk - ind_risk)
      else
        ind_risk = 6 / (feet_to_meters(quest.q11) + 1)
        event_risk = 6 / (feet_to_meters(event.social_distancing_no_masks) + 1)
        ind_comfort = ind_risk * find_penalty(quest, event, indoor)
        return ind_comfort >= event_risk ? 5 : mask_sigmoid(event_risk - ind_comfort)
      end
    end
  end

  def self.generate_group_size_score(quest, event, indoor)

    comfort_size = -1
    if (indoor)
      comfort_size = quest.q9
    else
      comfort_size = quest.q15
    end

    event_size = Participant.where(event_id: event.id).length
    return (comfort_size > event_size) || (comfort_size == -1) ? 5 : group_sigmoid((comfort_size - event_size).to_f/comfort_size)
  end

  private

  def self.find_penalty(quest, event, indoor)
    if (indoor)
      return event.social_distancing_no_masks ? 1 : 1.2 - (0.2 * quest.q6)
    else
      return event.social_distancing_no_masks ? 1 : 1.2 - (0.2 * quest.q12)
    end
  end

  def self.feet_to_meters(x)
    return x / 3.281
  end

  def self.mask_sigmoid(x)
    return (-8 / (1 + Math.exp(-x))) + 9
  end

  def self.group_sigmoid(x)
    return (8 / (1 + Math.exp((-3.5)*x))) + 1
  end

end