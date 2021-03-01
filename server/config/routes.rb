Rails.application.routes.draw do

  resources :users, only: [:index, :create, :show, :update] do
    resources :questionnaires, only: [:index, :create]
    member do 
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
