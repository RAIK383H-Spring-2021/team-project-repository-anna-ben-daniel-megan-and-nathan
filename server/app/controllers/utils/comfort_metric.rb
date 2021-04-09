module ComfortMetric
  def generateTotalScore(userID, eventID)
    @event = Event.find(eventID)
    @user = User.find(userID)
    @quest = @user.questionnaire

    locationScore = generateLocationScore(@user, @event)
    foodScore = generateFoodScore(@user, @event)
    masksSocialDistScore = generateMasksSocialDistancingScore(@user, @event)
    groupSizeScore = generateGroupSizeScore(@user, @event)
  end

  def generateLocationScore(user, event)
    # TODO: everything
    return 1
  end

  def generateFoodScore(user, event)
    # TODO: everything
    return 1
  end

  def generateMasksSocialDistancingScore(user, event)
    # TODO: everything
    return 1
  end

  def generateGroupSizeScore(user, event)
    # TODO: everything
    return 1
  end
end