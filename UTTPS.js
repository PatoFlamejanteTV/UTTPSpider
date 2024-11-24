/*
V 1.0 | 11/24/2024 | MIT License | PatoFlamejanteTV/UltimateQuack/UltimateChessPlayer
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

const API_KEY = "YOUR_API_KEY"; // Replace this with your API key
const searchQuery = "UTTP"; // The word to search for
const excludedWord = "AUTTP"; // Word to exclude

async function fetchYouTubeChannels() {
    const baseUrl = "https://www.googleapis.com/youtube/v3/search";
    const params = new URLSearchParams({
        part: "snippet",
        q: searchQuery,
        type: "channel",
        maxResults: 50, // You can adjust this (max: 50 per request)
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
                    url: `https://www.youtube.com/channel/${item.snippet.channelId}`
                }))
                .filter(channel => channel.name.includes(searchQuery) && !channel.name.includes(excludedWord));

            console.clear();
            if (filteredChannels.length === 0) {
                console.log("No channels found with the specified criteria.");
            } else {
                console.log(`Found ${filteredChannels.length} channel(s):`);
                filteredChannels.forEach((channel, index) => {
                    console.log(`${index + 1}. ${channel.name} - ${channel.url}`);
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
