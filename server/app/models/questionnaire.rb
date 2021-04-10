class Questionnaire < ApplicationRecord
  has_one :user

  before_save :default_values

    private

    def default_values
      self.q1 = 1 if self.q1.nil?
      self.q2 = 1 if self.q2.nil?
      self.q3 = 1 if self.q3.nil?
      self.q4 = 1 if self.q4.nil?
      self.q5 = 1 if self.q5.nil?
      self.q6 = 1 if self.q6.nil?
      self.q7 = 1 if self.q7.nil?
      self.q8 = 1 if self.q8.nil?
      self.q9 = 1 if self.q9.nil?
      self.q10 = 1 if self.q10.nil?
      self.q11 = 1 if self.q11.nil?
      self.q12 = 1 if self.q12.nil?
      self.q13 = 1 if self.q13.nil?
      self.q14 = 1 if self.q14.nil?
      self.q15 = 1 if self.q15.nil?
    end
end
