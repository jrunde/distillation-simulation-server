class DocController < ApplicationController
    def show
    end
    
    def search
        @search_str = params[:search] || "yis"
        folder = "#{File.dirname(__FILE__)}/../../public/help/text"
        files = Dir["#{folder}/*"]
        docs = {}
        files.each{|f|
            docs[f] = IO.read("#{f}")
        }
        
        # docs = {
        #   "Plant" => "This is where you plant things and they grow so you can make all the money ever.",
        #   "Economy" => "Where all the money lives yis yis",
        #   "Energy" => "Grow corn, grind it down, shove it in a rocket engine and pchoooo!",
        # }
        
        @found_articles = {}
        @order = []
        @links = {}
        after_buffer = before_buffer = 50
        
        # variables to keep track of the top five hits
        most_found = 0
        second_most_found = 0
        third_most_found = 0
        fourth_most_found = 0
        fifth_most_found = 0
        
        docs.each do |title,doc|
            link = doc[0..doc.index(' ')]
            doc = doc[doc.index(' ')..doc.length]
            if doc[@search_str]
                indx = doc.index(@search_str)
                pre = ""
                suf = ""
                
                # clip on an appropriate buffer to the first instance of the found string
                if indx - before_buffer < 0
                    snip_start = 0
                else
                    snip_start = indx - before_buffer
                    pre = "..."
                end
                
                if indx + after_buffer > doc.length
                    snip_end = doc.length
                else
                    snip_end = indx + @search_str.size + after_buffer
                    suf = "..."
                end
                
                # add the article to the hash of found articles
                @found_articles[title] = pre + doc[snip_start..snip_end] + suf
                

                # organize the top five found articles
                hits = doc.split(@search_str).length
                i = @found_articles.length - 1
                
                if hits > most_found
                    i = 0
                    fifth_most_found = fourth_most_found
                    fourth_most_found = third_most_found
                    third_most_found = second_most_found
                    second_most_found = most_found
                    most_found = hits
                elsif hits > second_most_found
                    i = 1
                    fifth_most_found = fourth_most_found
                    fourth_most_found = third_most_found
                    third_most_found = second_most_found
                    second_most_found = hits
                elsif hits > third_most_found
                    i = 2
                    fifth_most_found = fourth_most_found
                    fourth_most_found = third_most_found
                    third_most_found = hits
                elsif hits > fourth_most_found
                    i = 3
                    fifth_most_found = fourth_most_found
                    fourth_most_found = hits
                elsif hits > fifth_most_found
                    i = 4
                    fifth_most_found = hits
                end
                
                # insert the title of each article in the proper place in the queue
                @order.insert(i, title)
                @links[title] = link
            end
        end
    end
end
