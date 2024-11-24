/*
V 1.1 | 11/24/2024 | MIT License | PatoFlamejanteTV/UltimateQuack/UltimateChessPlayer
 ____ ___________________________________  _________      .__    .___            
|    |   \__    ___/\__    ___/\______   \/   _____/_____ |__| __| _/___________ 
|    |   / |    |     |    |    |     ___/\_____  \\____ \|  |/ __ |/ __ \_  __ \
|    |  /  |    |     |    |    |    |    /        \  |_> >  / /_/ \  ___/|  | \/
|______/   |____|     |____|    |____|   /_______  /   __/|__\____ |\___  >__|   
                                                 \/|__|           \/    \/       
    _  _          _    _ _______ _______ _____  
  _| || |_   /\  | |  | |__   __|__   __|  __ \ 
 |_  __  _| /  \ | |  | |  | |     | |  | |__) |
  _| || |_ / /\ \| |  | |  | |     | |  |  ___/ 
 |_  __  _/ ____ \ |__| |  | |     | |  | |     
   |_||_|/_/    \_\____/   |_|     |_|  |_|                                                 
*/

// Customizable Variables
const API_KEY = "INSERT_YOUR_YOUTUBE_API_KEY_HERE!!!"; // Replace this with your YouTube API key
const searchQueries = ["UTTP", "THDTC", "KKTK"]; // List of words to search for (OR logic)
const excludedWords = ["AUTTP", "ATHDTC", "AKKTK", "anti uttp"]; // List of words to exclude (NOW USING OR LOGIC)
const maxResults = 50; // Adjustable maximum results per request (max: 50)
const resultLogLevel = "full"; // Log level for results: "brief", "full", or "none"

async function fetchYouTubeChannels() {
    const baseUrl = "https://www.googleapis.com/youtube/v3/search";
    const params = new URLSearchParams({
        part: "snippet",
        // Join search queries with OR for the API query
        q: searchQueries.join(" OR "),
        type: "channel",
        maxResults,
        key: API_KEY
    });

    try {
        const response = await fetch(`${baseUrl}?${params.toString()}`);
        const data = await response.json();

        if (data.items && data.items.length > 0) {
            const filteredChannels = data.items
              .map(item => ({
                    name: item.snippet.channelTitle,
                    id: item.snippet.channelId,
                    url: `https://www.youtube.com/channel/${item.snippet.channelId}`,
                    description: item.snippet.description, // Added for full log
                    publishedAt: item.snippet.publishedAt // Added for full log
                }))
              .filter(channel => 
                    // Check if channel name includes ANY of the search queries
                    searchQueries.some(query => channel.name.toLowerCase().includes(query.toLowerCase()))
                    &&
                    // **MODIFIED TO USE OR LOGIC FOR EXCLUDED WORDS**
                   !excludedWords.some(word => channel.name.toLowerCase().includes(word.toLowerCase()))
                );

            console.clear();
            if (filteredChannels.length === 0) {
                console.log("No channels found with the specified criteria.");
            } else {
                console.log(`Found ${filteredChannels.length} channel(s) matching '${searchQueries.join(", ")}' and excluding (OR) '${excludedWords.join(", ")}':`);
                filteredChannels.forEach((channel, index) => {
                    switch (resultLogLevel) {
                        case "brief":
                            console.log(`${index + 1}. ${channel.name} - ${channel.url}`);
                            break;
                        case "full":
                            console.log(`**${index + 1}. ${channel.name}**\nURL: ${channel.url}\nDescription: ${channel.description}\nPublished At: ${channel.publishedAt}\n`);
                            break;
                        case "none":
                            // For testing, suppress logging
                            break;
                        default:
                            console.warn("Invalid resultLogLevel. Defaulting to 'brief'.");
                            console.log(`${index + 1}. ${channel.name} - ${channel.url}`);
                    }
                });
            }
        } else {
            console.log("No results found for the search query.");
        }
    } catch (error) {
        console.error("Error fetching data from YouTube API:", error);
    }
}

// Run the function
fetchYouTubeChannels();
