Rails.application.routes.draw do

  resources :events, only: [:index, :show, :update, :destroy] do 
    resources :invitees, only: [:index, :create]
    resources :suggestions, only: [:index, :show]
  end
end
