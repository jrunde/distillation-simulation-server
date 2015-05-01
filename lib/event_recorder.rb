require 'json'

class EventRecorder
  def self.record(msg, buffer=nil)
    store(parse(msg), buffer)
  end

  def self.parse(event)
    event = JSON.parse(event)
    event["_timestamp"] = Time.now.to_s
    event
  end

  def self.store(event, buffer = nil)
    if buffer
      buffer << event.to_s
    else
      # puts "recorded #{event.to_s}"
    end
  end

  def self.report(buffer = nil)
    # send records to remote server
  end
end