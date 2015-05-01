require 'websocket_helper'
require 'net/http'

class WebsocketController < WebsocketRails::BaseController

  include WebsocketHelper

  def initialize_session
    unless controller_store[:id_num]
      controller_store[:id_num] = 0
      Thread.abort_on_exception = true
      Thread.new do
        logger.info "starting listener"
        subscribe_to_redis
      end
    end
  end

  def connected
    logger.info "connection made!"
  end

  def reconnected_client
    logger.info "reconnected #{message}"
    unless controller_store[:id_num]
      controller_store[:id_num] = 0
      Thread.abort_on_exception = true
      Thread.new do
        logger.info "starting listener"
        subscribe_to_redis
      end
    end
    trigger_success
  end

  def try_rejoin
    info = controller_store[session[:session_id]] ||= {moderator:{},player:{}}
    logger.info "#{info[:player]}"
    if info[:player]["start_time"]
      info = info[:player]
      evt = {
        "event" => "joinRoom",
        "clientID" => message[0],
        "roomID" => info["roomName"],
        "roomName" => info["roomName"],
        "deviseName" => "guest@guest.com",
        "password" => "", # TODO: no password support for now
        "userName" => info["userName"]
      }
      write_queue(ActiveSupport::JSON.encode(evt))
      trigger_success room: info[:player]["roomName"]
    else
      trigger_failure
    end
  end

  def can_rejoin
    info = controller_store[session[:session_id]] ||= {moderator:{},player:{}}
    if info[:player]["start_time"]
      trigger_success room: info[:player]["roomName"]
    else
      trigger_failure
    end
  end

  def mod_rejoin
    info = controller_store[session[:session_id]] ||= {moderator:{},player:{}}
    if info[:moderator]["start_time"]
      trigger_success info[:moderator]["roomName"]
    else
    	trigger_failure
    end
  end

  def update_credentials
  	if message[2]=="**MODERATOR**"
  		role = :moderator
  	else
  		role = :player
  	end
  	controller_store[session[:session_id]] ||= {moderator:{},player:{}}
    controller_store[session[:session_id]][role] = {
      roomName: message[1],
      userName: message[2],
      # userName: data["deviseName"],
      start_time: Time.now.nsec
    }
    logger.info "credentials: #{controller_store[session[:session_id]]}"
    trigger_success
  end

  def clear_session
  	controller_store[session[:session_id]] = {moderator:{},player:{}}
  end

  def send_event(send_channel, msg)
    if send_channel
      WebsocketRails[:"#{send_channel}"].trigger(:event, msg)
    else
      logger.info "no channel specified, skipping #{msg}"
      # WebsocketRails[:"#{controller_store[:current_event_id]}"].trigger(:event, msg)
    end

    # send_message :event, msg
  end

  def receive_event
    logger.info "received #{message}"
    controller_store[:current_event_id] = message[0]
    jss = ActiveSupport::JSON.decode(message[2])
    jss["clientID"] = message[0]
    jss["roomID"] = message[1]
    jss["deviseName"] = "#{current_user.email}"
    # write_pipe(ActiveSupport::JSON.encode(jss))
    if(jss["event"] == "changeSettings")
      send_event(jss["roomName"],ActiveSupport::JSON.encode(jss))
    end
    # logger.info "current #{current_user.email}"
    # else
    #if @mode == "redis"
      write_queue(ActiveSupport::JSON.encode(jss))
    #else
     # write_pipe(ActiveSupport::JSON.encode(jss))
    # end
    # end
    # logger.info "wrote"
  end

  def get_new_id
    logger.info "assign"
    # logger.info "assigned #{controller_store[:id_num]}"
    trigger_success "#{controller_store[:id_num]}"
    controller_store[:id_num] += 1
  end

  def clean_environment
    logger.info "__\nclearing environment\n__"
    event = {"event"=>"clearAllGames"}
    write_queue(ActiveSupport::JSON.encode(event))

    trigger_success "succ"
  end

  def watch_pipe(mode)
    controller_store[:start_time] = Time.now.nsec
    str = read_queue(true)
    loop do
      # if mode == "redis"
      # logger.info "check queue"
      logger.info "got #{str}"
      # else
      #   str = read_pipe
      # end
      obj = ActiveSupport::JSON.decode(str);



      if(obj["event"] == "changeSettings")
        send_channel = obj["roomName"]
      else
        send_channel = obj["clientID"]    #redundant?
      end

      logger.info "Sending #{str} to #{send_channel}"


      if(obj["event"] == "fieldDump")
        update_map(obj)
      else
        send_event(send_channel,str)
      end

      str = read_queue(true)
    end
  end

  def check_model
    if REDISCHAN == 'edge'
      url = URI.parse('http://localhost:1238/start')
    else
      url = URI.parse('http://localhost:5678/start')
      # url = URI.parse('http://localhost:4567/start')
    end

    # if ENV["RAILS_ENV"] == "development"
    #   url = URI.parse('http://localhost:4567/start')
    # else
    #   url = URI.parse('http://mysterious-cliffs-4762.herokuapp.com/start')
    # end
    req = Net::HTTP::Get.new(url.path)
    res = Net::HTTP.start(url.host, url.port) {|http|
      http.request(req)
    }
    trigger_success
  end

  def found_bug
    github = Github.new oauth_token: "1b0ce27688c23c68d783d10899ac8bdd49122cba", user: 'wstrinz', repo: 'Fields-of-Fuel-Server'
    github.issues.create(title: message["title"], body: message["body"])
    # trigger_success
  end

  def subscribe_to_redis
    redis = REDISLOCALR
    # if ENV["RAILS_ENV"] == "development"
    #   redis = REDISLOCALR
    # else
    #   redis = REDISREAD
    # end
    logger.info "subscribing"
    redis.subscribe(:"toRuby#{REDISCHAN}") do |on|
      on.message do |channel, msg|
        data = JSON.parse(msg)
        if(data["event"] == "fieldDump")
          update_map(data)
        else
          logger.info "sending #{msg}"
          send_event(data["clientID"], msg)
        end

        record_event(msg)
      end
    end
  end
end
