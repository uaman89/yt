 // Your use of the YouTube API must comply with the Terms of Service:
// https://developers.google.com/youtube/terms


// Called automatically when JavaScript client library is loaded.
function onClientLoad() {
    gapi.client.load('youtube', 'v3', onYouTubeApiLoad);
    console.log('okay!!!');
}

// Called automatically when YouTube API interface is loaded (see line 9).
function onYouTubeApiLoad() {
    // This API key is intended for use only in this lesson.
    // See https://goo.gl/PdPA1 to get a key for your own applications.
    gapi.client.setApiKey('AIzaSyCYvoN4eLABsyKaG1nS8T1GSHMKL5Us3BA');
}


//----------------------------------------------------------------------------------------------------------------------
// not in use. justfor test:

function search() {
    // Use the JavaScript client library to create a search.list() API call.
    var request = gapi.client.youtube.search.list({
        q: 'star wars',
        part: 'snippet'
    });

    request.execute(onSearchResponse);
}

// Called automatically with the response of the YouTube API request.
function onSearchResponse(response) {
    showResponse(response);
}

// Helper function to display JavaScript value on HTML page.
function showResponse(response) {
 var responseString = JSON.stringify(response, '', 2);
 document.getElementById('response').innerHTML += responseString;
}
