Rails.application.routes.draw do
  root 'calendars#index'
  get 'auth', to: 'calendars#redirect', as: 'auth'
  get 'oauth_callback', to: 'calendars#callback'
  post 'google_sync', to: 'calendars#google_sync', as: 'sync'
end
