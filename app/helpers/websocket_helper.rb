module WebsocketHelper
  # def open_pipes(mode)
  #   if mode == "pipes"
  #     puts 'rails opening pipes'
  #     puts write = open("#{Rails.root}/pipes/javapipe",'r+')
  #     puts read = open("#{Rails.root}/pipes/rubypipe",'w+')
  #   else
  #     puts 'rails connecting to redis'
  #     uri = URI.parse("redis://redistogo:1f736fa2a27319dc45b7ebb470e04bbe@dory.redistogo.com:10177/")
  #     write = Redis.new(:host => uri.host, :port => uri.port, :password => uri.password)
  #     read = Redis.new(:host => uri.host, :port => uri.port, :password => uri.password)
  #   end
  #   puts "array #{[write,read]}"
  #   [write,read]
  #   # #puts "#{File.exist?('~/javapipe')}"
  #   # Dir.chdir(File.dirname(__FILE__))
  # end

  class MapServerManager
    @@ports = {}
    START_PORT = 16000

    def self.ports
      @@ports
    end

    def self.getPort
      START_PORT
    end

    def register(room,port)
      @@ports[room] = port
    end

    class MapServer
      def initialize(game)
        @map_file = File.new(Rails.root.to_s + "/public/map/#{game}.xml")
      end

      def run
        @port ||= MapServerManager.getPort
        @process = spawn("cd bin/lib/OGCServer ; ./bin/ogcserver-local.py #{@map_file.path} #{@port}")
      end

      def restart
        Process.kill(@process)
        run
      end
    end
  end

  def write_pipe(pipe, msg)
    # puts "writing #{msg} to "

    pipe.puts(msg)
    pipe.flush
  end

  # def read_pipe
  #   red.gets
  # end

  def write_queue(msg)
    # REDISREAD.lpush("toJava", msg)
      redis = REDISLOCALW
      record_event(msg)
    # if ENV["RAILS_ENV"] == "development"
    #   redis = REDISLOCALW
    # else
    #   redis = REDISWRITE
    # end
    # puts "writing"
    redis.lpush("toJava#{REDISCHAN}", msg)
  end

  def read_queue(blocking)
    # puts "waiting to read"
    if ENV["RAILS_ENV"] == "development"
      redis = REDISLOCALR
    else
      redis = REDISREAD
    end

    if blocking==false

      # REDISWRITE.rpop("fromJava")
      redis.rpop("fromJava#{REDISCHAN}")
    else

      redis.brpop("fromJava#{REDISCHAN}")[1]
      # REDISWRITE.brpop("fromJava")[1]
    end
    # puts "read"
  end

  def update_map(json)
    begin
      if ENV["RAILS_ENV"] == "development"
        RestClient.post("http://localhost:9999/map/#{json["clientID"]}", data: json.to_json )
      else
        RestClient.post("http://fofmap.strinz.me/map/#{json["clientID"]}", data: json.to_json ){ |response, request, result, &block|
            if [301, 302, 307].include? response.code
              response.follow_redirection(request, result, &block)
            else
                response.return!(request, result, &block)
            end
        }
      end
    rescue
      logger.info "couldn't post map data to cartographer"
    end
  end

  def record_event(event)
    if ENV["RAILS_ENV"] == "development"
      RECORDER.record(event)
    else
      # record event using a file, DB, or some other buffer

      # RECORDER.record(event)
    end
  end

end