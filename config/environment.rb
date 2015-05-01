# Load the rails application
require File.expand_path('../application', __FILE__)
ENV["REDISTOGO_URL"] = 'redis://redistogo:1f736fa2a27319dc45b7ebb470e04bbe@dory.redistogo.com:10177/'

# Initialize the rails application
KoSombo::Application.initialize!