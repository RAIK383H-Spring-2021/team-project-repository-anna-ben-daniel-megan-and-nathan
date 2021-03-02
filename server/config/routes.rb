Rails.application.routes.draw do

  defaults format: :json do
    resources :users, only: [:index, :create, :show, :update] do
      member do 
        get 'questionnaire', to: 'questionnaire#show'
        put 'questionnaire', to: 'questionnaire#update'
        get 'invitations'
        get 'events'
      end
    end

    post '/users/login'

    resources :events, only: [:create, :show, :update, :destroy] do 
      resources :invitees, only: [:index, :create]
      resources :suggestions, only: [:index, :show]
    end
  end
end
