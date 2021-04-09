class AddQuestionnaireColumn15 < ActiveRecord::Migration[6.1]
  def change
    add_column :questionnaires, :q15, :integer
  end
end
