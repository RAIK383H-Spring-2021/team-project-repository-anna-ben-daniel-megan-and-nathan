require 'rails_helper'

RSpec.describe User, type: :model do
    it "does not validate when not all fields are provided" do
        @event = Event.new()

        expect(@event.valid?).to be false
    end

    it "successfully creates a new event entry when all fields are valid" do
        Event.create(title: "Updated Title", 
        host_id: 2,
        description: "test event",
        date_time: Time.now,
        food_prepackaged: true,
        food_buffet: false,
        location: "test",
        indoor: true,
        outdoor: false,
        remote: false,
        score: 1)
    
        @event = Event.find_by(title: 'Updated Title')
    
        expect(@event).to be_truthy
    end

    it "sets required fields if not provided" do
        Event.create(title: "Updated Title", 
        host_id: 2,
        description: "test event",
        date_time: Time.now,
        food_prepackaged: nil,
        food_buffet: nil,
        location: "test",
        indoor: nil,
        outdoor: nil,
        remote: nil,
        score: 1)
    
        @event = Event.find_by(title: 'Updated Title')
    
        expect(@event.food_prepackaged).to be false
        expect(@event.food_buffet).to be false
        expect(@event.indoor).to be false
        expect(@event.outdoor).to be false
        expect(@event.remote).to be false
    end
end