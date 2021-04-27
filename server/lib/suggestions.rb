include ComfortMetric

module Suggestions

  def self.generate(event)
    @participant_user_ids = Participant.where(event_id: event.id).where(questionnaire_complete: true).collect(&:user_id)
    @users = @participant_user_ids.map{ |id| User.find(id) }
    @questionnaires = @users.map { |user| user.questionnaire }

    @num_participants = @participant_user_ids.length
    @food = event.food_buffet || event.food_prepackaged

    indoor_suggestion = generate_indoor(@questionnaires, @food, @num_participants)
    outdoor_suggestion = generate_outdoor(@questionnaires, @food, @num_participants)
    remote_suggestion = generate_remote(@questionnaires)

    indoor_score = generate_dummy_score(event, indoor_suggestion, "indoor", @questionnaires, @food)
    outdoor_score = generate_dummy_score(event, outdoor_suggestion, "outdoor", @questionnaires, @food)

    indoor_suggestion[:score] = indoor_score
    outdoor_suggestion[:score] = outdoor_score

    suggestions = { indoor: indoor_suggestion, outdoor: outdoor_suggestion, remote: remote_suggestion }

    return suggestions
  end

  def self.generate_indoor(questionnaires, food, num_participants)
    suggestions = {}

    location_comfort = questionnaires.map{ |quest| quest.q1 }
    location_comfort = location_comfort.sum(0.0) / location_comfort.length
    suggestions[:location_comfort] = location_comfort

    mask_importance = questionnaires.map{ |quest| quest.q6 }
    mask_importance = mask_importance.sum(0.0) / mask_importance.length

    if mask_importance >= 2.5
      with_mask_avg = questionnaires.map{ |quest| quest.q4 }
      with_mask_avg = with_mask_avg.sum(0.0) / with_mask_avg.length
      suggestions[:masks] = true
      suggestions[:distance] = with_mask_avg.to_i
      suggestions[:room_size] = (with_mask_avg.to_i ** 2) * (num_participants + 1)
    else
      no_mask_avg = questionnaires.map{ |quest| quest.q5 }
      no_mask_avg = no_mask_avg.sum(0.0) / no_mask_avg.length
      suggestions[:masks] = false
      suggestions[:distance] = no_mask_avg.to_i
      suggestions[:room_size] = (no_mask_avg.to_i ** 2) * (num_participants + 1)
    end

    if food
      prepackaged_average = questionnaires.map{ |quest| quest.q7 }
      buffet_average = questionnaires.map{ |quest| quest.q8 }
      prepackaged_average = prepackaged_average.sum(0.0) / prepackaged_average.length
      buffet_average = buffet_average.sum(0.0) / buffet_average.length

      suggestions[:food_type] = prepackaged_average >= buffet_average ? "prepackaged" : "buffet"
      suggestions[:food_comfort] = prepackaged_average >= buffet_average ? prepackaged_average : buffet_average
    end

    return suggestions
  end

  def self.generate_outdoor(questionnaires, food, num_participants)
    suggestions = {}

    location_comfort = questionnaires.map{ |quest| quest.q2 }
    location_comfort = location_comfort.sum(0.0) / location_comfort.length
    suggestions[:location_comfort] = location_comfort

    mask_importance = questionnaires.map{ |quest| quest.q12 }
    mask_importance = mask_importance.sum(0.0) / mask_importance.length

    if mask_importance >= 2.5
      with_mask_avg = questionnaires.map{ |quest| quest.q10 }
      with_mask_avg = with_mask_avg.sum(0.0) / with_mask_avg.length
      suggestions[:masks] = true
      suggestions[:distance] = with_mask_avg.to_i
    else
      no_mask_avg = questionnaires.map{ |quest| quest.q11 }
      no_mask_avg = no_mask_avg.sum(0.0) / no_mask_avg.length
      suggestions[:masks] = false
      suggestions[:distance] = no_mask_avg.to_i
    end

    if food
      prepackaged_average = questionnaires.map{ |quest| quest.q13 }
      buffet_average = questionnaires.map{ |quest| quest.q14 }
      prepackaged_average = prepackaged_average.sum(0.0) / prepackaged_average.length
      buffet_average = buffet_average.sum(0.0) / buffet_average.length

      suggestions[:food_type] = prepackaged_average >= buffet_average ? "prepackaged" : "buffet"
      suggestions[:food_comfort] = prepackaged_average >= buffet_average ? prepackaged_average : buffet_average
    end

    return suggestions
  end

  def self.generate_remote(questionnaires)
    suggestions = {}

    location_comfort = questionnaires.map{ |quest| quest.q3 }
    location_comfort = location_comfort.sum(0.0) / location_comfort.length
    suggestions[:score] = location_comfort

    return suggestions
  end

  def self.generate_dummy_score(event, hash, location, questionnaires, food)
    @dummy_event = Event.new(
      title: event.title,
      host_id: event.host_id,
      description: event.description,
      date_time: event.date_time,
      food_prepackaged: hash[:food_type] == "prepackaged",
      food_buffet: hash[:food_type] == "buffet",
      location: event.location,
      indoor: location == "indoor",
      outdoor: location == "outdoor",
      remote: location == "remote",
      score: nil,
      social_distancing_masks: hash[:masks] ? hash[:distance] : nil,
      social_distancing_no_masks: !(hash[:masks]) ? hash[:distance] : nil
    )

    all_scores = []

    questionnaires.each do |quest|
      food_score = food ? ComfortMetric.generateFoodScore(quest, @dummy_event, @dummy_event.indoor) : nil
      masks_social_dist_score = ComfortMetric.generateMasksSocialDistancingScore(quest, @dummy_event, @dummy_event.indoor)
      group_size_score = ComfortMetric.generateGroupSizeScore(quest, event, @dummy_event.indoor)
      location_score = @dummy_event.indoor ? quest.q1 : quest.q2

      if food_score
        total_score = [food_score, masks_social_dist_score, group_size_score, location_score].sum(0.0) / 4
      else
        total_score = [masks_social_dist_score, group_size_score, location_score].sum(0.0) / 3
      end

      all_scores.append(total_score)
    end
    
    avg_score = all_scores.sum(0.0) / all_scores.length

    return avg_score
  end

end