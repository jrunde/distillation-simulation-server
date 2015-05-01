class PlayerController < ApplicationController
  # before_filter :authenticate_user!
  before_filter :authentic

  def authentic
    sign_in(User.find_or_create_by_email("guest@guest.com")) unless current_user
  end

  def index
    @name = current_user.email.slice(/.*@/)
    @name[-1] = ""
  end

  def change_user
    sign_out current_user if current_user
    redirect_to new_user_session_url
  end

  def help
  end
end
