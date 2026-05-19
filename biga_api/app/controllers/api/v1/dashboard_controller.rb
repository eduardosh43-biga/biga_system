class Api::V1::DashboardController < ApplicationController
  before_action :authorize_admin!

  def stats
    service = DashboardStatsService.new(
      start_date: params[:start_date],
      end_date: params[:end_date]
    )
    
    render json: service.call
  end
end
