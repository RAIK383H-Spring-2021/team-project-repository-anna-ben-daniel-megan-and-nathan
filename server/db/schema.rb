# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2021_04_14_012746) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "events", force: :cascade do |t|
    t.string "title"
    t.integer "host_id"
    t.string "description"
    t.datetime "date_time"
    t.boolean "food_prepackaged"
    t.boolean "food_buffet"
    t.string "location"
    t.boolean "indoor"
    t.boolean "outdoor"
    t.boolean "remote"
    t.float "score"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "social_distancing_masks"
    t.integer "social_distancing_no_masks"
  end

  create_table "participants", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "event_id", null: false
    t.boolean "questionnaire_complete"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.float "score"
    t.float "location_score"
    t.float "masks_social_dist_score"
    t.float "group_size_score"
    t.float "food_score"
    t.index ["event_id"], name: "index_participants_on_event_id"
    t.index ["user_id"], name: "index_participants_on_user_id"
  end

  create_table "questionnaires", force: :cascade do |t|
    t.integer "q1"
    t.integer "q2"
    t.integer "q3"
    t.integer "q4"
    t.integer "q5"
    t.integer "q6"
    t.integer "q7"
    t.integer "q8"
    t.integer "q9"
    t.integer "q10"
    t.integer "q11"
    t.integer "q12"
    t.integer "q13"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "q14"
    t.integer "q15"
  end

  create_table "suggestions", force: :cascade do |t|
    t.bigint "event_id", null: false
    t.boolean "masks"
    t.integer "distance"
    t.string "indoor_outdoor"
    t.integer "room_size"
    t.integer "food"
    t.float "score"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["event_id"], name: "index_suggestions_on_event_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email"
    t.string "first_name"
    t.string "last_name"
    t.string "password_hash"
    t.integer "questionnaire_id"
    t.integer "privacy_level"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  add_foreign_key "events", "users", column: "host_id"
  add_foreign_key "participants", "events"
  add_foreign_key "participants", "users"
  add_foreign_key "suggestions", "events"
  add_foreign_key "users", "questionnaires"
end
