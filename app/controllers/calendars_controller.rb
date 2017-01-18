require 'pp'

class CalendarsController < ApplicationController
  def index
  end

  def google_sync
    pp "Syncing with google TEST"
    render :json => {}, :status => 200
  end
end
