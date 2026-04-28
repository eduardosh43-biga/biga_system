Rails.application.routes.draw do  
  namespace :api do
    namespace :v1 do
      post 'auth/login', to: 'authentication#login'
      get 'dashboard/stats', to: 'dashboard#stats'
      resources :inventory_batches, only: [:index, :show, :create, :update, :destroy]
     resources :ingredients, only: [:index, :show, :create, :update, :destroy]
     resources :recipes, only: [:index, :show, :create, :update, :destroy]
     resources :recipe_ingredients, only: [:index, :show, :create, :update, :destroy]
     resources :orders, only: [:index, :show, :create, :update, :destroy] do
        member do
          patch :cancel
        end
     end
    #  resources :order_items, only: [:index, :show, :create, :update, :destroy]
     resources :promotions, only: [:index, :show, :create, :update, :destroy]
     resources :promotion_items, only: [:index, :show, :create, :update, :destroy]
    end
  end
 
  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

end
