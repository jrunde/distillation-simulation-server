

# puts ("#{sender} listieng on #{REDISREAD}")
# loop do
#   # if mode == "redis"
#   puts "poll"
#   if (str = REDISREAD.rpop("fromJava")[1]) # yay spin waiting
#     # else
#     #   str = read_pipe
#     # end
#     obj = ActiveSupport::JSON.decode(str);

#     if(obj["event"] == "changeSettings")
#       send_channel = obj["roomName"]
#     else
#       send_channel = obj["clientID"]    #redundant?
#     end

#     puts "Sending #{str} to #{send_channel}"

#     send_event(send_channel,str)
#   end
# end


