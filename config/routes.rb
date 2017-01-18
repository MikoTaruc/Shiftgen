Rails.application.routes.draw do
  root 'calendars#index'
  post 'google_sync', to: 'calendars#google_sync', as: 'sync'
end
