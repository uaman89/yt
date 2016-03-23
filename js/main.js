var searchPanel = kendo.observable({
    query: 'ok!',
    searchClick: function(){
        if (gapi.client.youtube == undefined){
            onClientLoad();
        }

        var request = gapi.client.youtube.search.list({
            q: 'star wars',
            part: 'snippet'
        });

        request.execute( this.renderSearchResult );
        // Send the request to the API server,
        // and invoke showRepsonse() with the response.
        //request.execute(showResponse);
    },

    renderSearchResult: function(response){
        var responseString = JSON.stringify(response, '', 2);
        $('#searchResult').html(responseString);
    }
});

var searchPanelView = new kendo.View('searchPanelTpl', {model: searchPanel, wrap: false});

var layout = new kendo.Layout('appLayout');

layout.render($("#app"));

layout.showIn("#searchPanel", searchPanelView);
