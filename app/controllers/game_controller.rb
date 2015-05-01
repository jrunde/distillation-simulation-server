class GameController < ApplicationController
  def play
  end

  def global
  end

  def moderator
  end

  def help_text
  	# puts "got here #{params["target"]}!"
  	# puts "sending  #{{text: "Show healthy healthy icon"}.to_json}"

  	target = params["target"]

  	if Help.find_by_name(target)
  		msg = Help.find_by_name(target).text
  	else
  		msg = "no text yet for #{target}"
  	end

  	respond_to do |format|
  		format.json {render :json => {"text" => msg}}
  	end
  end
end
