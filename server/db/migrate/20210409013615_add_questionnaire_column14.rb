class AddQuestionnaireColumn14 < ActiveRecord::Migration[6.1]
  def change
    add_column :questionnaires, :q14, :integer
  end
end
