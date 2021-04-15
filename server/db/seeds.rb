# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
#
# NOTE: We are utilizing this for TESTING PURPOSES ONLY. This seed is loaded in when the RSpec is run.

# seed two users with questionnaires
@quest = Questionnaire.create()
@user = User.create(email: "test@test.test", 
  first_name: "first", 
  last_name: "last",
  password: "password",
  password_confirmation: "password",
  questionnaire_id: @quest.id,
  privacy_level: 0
)

@invited_quest = Questionnaire.create()
@invited_user = User.create(email: "hello@hello.hello", 
  first_name: "first", 
  last_name: "last",
  password: "password",
  password_confirmation: "password",
  questionnaire_id: @invited_quest.id,
  privacy_level: 1
)

@invited_quest2 = Questionnaire.create()
@invited_user2 = User.create(email: "hi@hi.hi", 
  first_name: "new", 
  last_name: "last",
  password: "password",
  password_confirmation: "password",
  questionnaire_id: @invited_quest2.id,
  privacy_level: 1
)

@no_event_user_quest = Questionnaire.create()
@no_event_user = User.create(email: "no@event.user", 
  first_name: "first", 
  last_name: "last",
  password: "password",
  password_confirmation: "password",
  questionnaire_id: @no_event_user_quest.id,
  privacy_level: 1
)

@privacy_quest = Questionnaire.create()
@privacy_user = User.create(
  email: "privacy@hello.hello",
  first_name: "first",
  last_name: "last",
  password: "password",
  password_confirmation: "password",
  questionnaire_id: @privacy_quest.id,
  privacy_level: 0
)

# seed two events, one hosted by each
@event1 = Event.create(
  title: "test",
  host_id: @user.id,
  description: "test event",
  date_time: Time.now,
  food_prepackaged: true,
  food_buffet: false,
  location: "test",
  indoor: true,
  outdoor: false,
  remote: false,
  score: 1, 
  social_distancing_masks: 6,
  social_distancing_no_masks: nil
)

@event2 = Event.create(
  title: "invited test",
  host_id: @invited_user.id,
  description: "test event",
  date_time: Time.now,
  food_prepackaged: true,
  food_buffet: false,
  location: "test",
  indoor: true,
  outdoor: false,
  remote: false,
  score: 1,
  social_distancing_masks: 6,
  social_distancing_no_masks: nil
)

@event3 = Event.create(
  title: "invited test incomplete",
  host_id: @invited_user.id,
  description: "test event",
  date_time: Time.now,
  food_prepackaged: true,
  food_buffet: false,
  location: "test",
  indoor: true,
  outdoor: false,
  remote: false,
  score: 1, 
  social_distancing_masks: 6,
  social_distancing_no_masks: nil
)

@event4 = Event.create(
  title: "test2",
  host_id: @user.id,
  description: "test event",
  date_time: Time.now,
  food_prepackaged: true,
  food_buffet: false,
  location: "test",
  indoor: true,
  outdoor: false,
  remote: false,
  score: 1,
  social_distancing_masks: 6,
  social_distancing_no_masks: nil
)

@event5 = Event.create(
  title: "event 5",
  host_id: @user.id,
  description: "test event",
  date_time: Time.now,
  food_prepackaged: true,
  food_buffet: false,
  location: "test",
  indoor: true,
  outdoor: false,
  remote: false,
  score: 1,
  social_distancing_masks: 6,
  social_distancing_no_masks: nil
)

@event6 = Event.create(
  title: "event 6",
  host_id: @user.id,
  description: "test event",
  date_time: Time.now,
  food_prepackaged: true,
  food_buffet: false,
  location: "test",
  indoor: true,
  outdoor: false,
  remote: false,
  score: 1,
  social_distancing_masks: 6,
  social_distancing_no_masks: nil
)

@event7 = Event.create(
  title: "event7",
  host_id: @user.id,
  description: "test event",
  date_time: Time.now,
  food_prepackaged: true,
  food_buffet: false,
  location: "test",
  indoor: true,
  outdoor: false,
  remote: false,
  score: 1,
  social_distancing_masks: 6,
  social_distancing_no_masks: nil
)

# seed two invitations, each user invited to the other event

Participant.create(
  user_id: @invited_user.id,
  event_id: @event1.id,
  questionnaire_complete: 1
)

Participant.create(
  user_id: @invited_user2.id,
  event_id: @event1.id,
  questionnaire_complete: 1
)

Participant.create(
  user_id: @user.id,
  event_id: @event2.id,
  questionnaire_complete: 1
)

Participant.create(
  user_id: @user.id,
  event_id: @event3.id,
  questionnaire_complete: 0
)

Participant.create(
  user_id: @invited_user.id,
  event_id: @event4.id,
  questionnaire_complete: 0
)

Participant.create(
  user_id: @invited_user.id,
  event_id: @event6.id,
  questionnaire_complete: 0
)

Participant.create(
  user_id: @invited_user.id,
  event_id: @event6.id,
  questionnaire_complete: 0
)

Participant.create(
  user_id: @invited_user.id,
  event_id: @event6.id,
  questionnaire_complete: 0
)