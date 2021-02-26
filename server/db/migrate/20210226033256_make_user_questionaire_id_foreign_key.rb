class MakeUserQuestionaireIdForeignKey < ActiveRecord::Migration[6.1]
  def change
    add_foreign_key :users, :questionnaires, column: :questionnaire_id
  end
end
