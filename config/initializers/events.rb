WebsocketRails.setup do |config|

  # Uncomment to override the default log level. The log level can be
  # any of the standard Logger log levels. By default it will mirror the
  # current Rails environment log level.
  # config.log_level = :debug

  # Uncomment to change the default log file path.
  # config.log_path = "#{Rails.root}/log/websocket_rails.log"

  # Set to true if you wish to log the internal websocket_rails events
  # such as the keepalive `websocket_rails.ping` event.
  # config.log_internal_events = false

  # Change to true to enable standalone server mode
  # Start the standalone server with rake websocket_rails:start_server
  # * Requires Redis
  config.standalone = false

  # Change to true to enable channel synchronization between
  # multiple server instances.
  # * Requires Redis.
  config.synchronize = false

  # Uncomment and edit to point to a different redis instance.
  # Will not be used unless standalone or synchronization mode
  # is enabled.
  # config.redis_options = {:host => 'localhost', :port => '6379'}
end

WebsocketRails::EventMap.describe do
  # You can use this file to map incoming events to controller actions.
  # One event can be mapped to any number of controller actions. The
  # actions will be executed in the order they were subscribed.
  #
  # Uncomment and edit the next line to handle the client connected event:
    subscribe :found_bug, :to => WebsocketController, :with_method => :found_bug
    subscribe :client_connected, :to => WebsocketController, :with_method => :connected
    subscribe :receive_event, :to => WebsocketController, :with_method => :receive_event
    subscribe :get_new_id, :to => WebsocketController, :with_method => :get_new_id
    subscribe :check_model, :to => WebsocketController, :with_method => :check_model
    subscribe :try_rejoin, :to => WebsocketController, :with_method => :try_rejoin
    subscribe :can_rejoin, :to => WebsocketController, :with_method => :can_rejoin
    subscribe :mod_rejoin, :to => WebsocketController, :with_method => :mod_rejoin
    subscribe :play_now, :to => WebsocketController, :with_method => :play_now
    subscribe :clear_session, :to => WebsocketController, :with_method => :clear_session
    subscribe :update_credentials, :to => WebsocketController, :with_method => :update_credentials
    subscribe :clean_environment, :to => WebsocketController, :with_method => :clean_environment
    subscribe :reconnected_client, :to => WebsocketController, :with_method => :reconnected_client
  #
  # Here is an example of mapping namespaced events:
  #   namespace :product do
  #     subscribe :new, :to => ProductController, :with_method => :new_product
  #   end
  # The above will handle an event triggered on the client like `product.new`.
end
