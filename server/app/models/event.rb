class Event < ApplicationRecord
    belongs_to :user, optional: true
    has_many :participants

    alias_attribute :user_id, :host_id

    validates :title, :date_time, :location, presence: true
    validate :xor_distancing

    before_save :default_values

    private

    def default_values
      self.food_prepackaged = false if self.food_prepackaged.nil?
      self.food_buffet = false if self.food_buffet.nil?
      self.indoor = false if self.indoor.nil?
      self.outdoor = false if self.outdoor.nil?
      self.remote = false if self.remote.nil?
    end
    
    def xor_distancing
      unless self.social_distancing_masks.nil? ^ self.social_distancing_no_masks.nil?
        errors.add(:base, "one of the social distancing scores needs to be null, but not both")
      end
    end
end
