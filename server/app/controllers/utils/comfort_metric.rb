module ComfortMetric
  def generateTotalScore(userID, eventID)
    @event = Event.find(eventID)
    @user = User.find(userID)
    @quest = @user.questionnaire

    indoor = nil
    scores = []
    
    if event.indoor
      indoor =  true
      locationScore = @quest.q1
    elsif event.outdoor
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
  end

  def generateFoodScore(quest, event, indoor)
    if event.food_prepackaged

    else

    end
    return 1
  end

  def generateMasksSocialDistancingScore(quest, event, indoor)
    # TODO: everythingx

    return 1
  end

  def generateGroupSizeScore(quest, event, indoor)
    # TODO: everything
    return 1
  end
end