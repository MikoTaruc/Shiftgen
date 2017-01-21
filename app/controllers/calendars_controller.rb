require 'pp'
require 'google/apis/calendar_v3'
require 'googleauth'
require 'googleauth/stores/file_token_store'
require 'google/api_client/client_secrets'
require 'fileutils'

class CalendarsController < ApplicationController
  def index
    client = Signet::OAuth2::Client.new(access_token: session[:access_token])
    client.expires_in = Time.now + 1_000_000

    service = Google::Apis::CalendarV3::CalendarService.new

    service.authorization = client

    @calendar_list = service.list_calendar_lists
    pp "mikocalendars"
    pp @calendar_list
  end

  def redirect
    client = Signet::OAuth2::Client.new({
      client_id: ENV['GOOGLE_CLIENT_ID'],
      client_secret: ENV['GOOGLE_CLIENT_SECRET'],
      authorization_uri: 'https://accounts.google.com/o/oauth2/auth',
      scope: Google::Apis::CalendarV3::AUTH_CALENDAR,
      redirect_uri: url_for(:action => :callback)
    })

    redirect_to client.authorization_uri.to_s
  end

  def callback
    client = Signet::OAuth2::Client.new({
      client_id: ENV['GOOGLE_CLIENT_ID'],
      client_secret: ENV['GOOGLE_CLIENT_SECRET'],
      token_credential_uri: 'https://accounts.google.com/o/oauth2/token',
      redirect_uri: url_for(:action => :callback),
      code: params[:code]
    })

    response = client.fetch_access_token!
    session[:access_token] = response['access_token']
    redirect_to url_for(:action => :index)
  end

  def google_sync
    pp "Syncing with google TEST"
    pp params

    calendar = Google::Apis::CalendarV3::CalendarService.new
    calendar.authorization = authorization

    render :json => {}, :status => 200
  end
end
