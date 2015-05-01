# require_relative '../../lib/make_map.rb'

uri = URI.parse(ENV["REDISTOGO_URL"])
REDISREAD = Redis.new(:host => uri.host, :port => uri.port, :password => uri.password)
REDISWRITE = Redis.new(:host => uri.host, :port => uri.port, :password => uri.password)
REDISLOCALR = Redis.new
REDISLOCALW = Redis.new
# REDISCHAN = "edge"
# REDISCHAN = ENV["REDIS_CHANNEL"] || "edge"
REDISCHAN = "dev"
