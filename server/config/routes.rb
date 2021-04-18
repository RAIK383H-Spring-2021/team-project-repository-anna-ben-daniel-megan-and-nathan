Rails.application.routes.draw do

  defaults format: :json do
    resources :users, only: [:index, :create, :show, :update] do
      member do
        get 'questionnaire', to: 'questionnaire#show'
        get 'invitations'
        get 'events'
      end
    end

    post '/users/login'

    resources :events, only: [:create, :show, :update, :destroy] do 
      resources :invitees, only: [:index, :create] do
        member do
          put 'questionnaire', to: 'questionnaire#update'
        end
      end
      
      get 'suggestions', to: 'suggestions#index'
    end
  end
end
