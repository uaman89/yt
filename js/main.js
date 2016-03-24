var searchPanel = kendo.observable({
    query: 'ok!',
    searchResultItems: new Array(),

    onSearch: function(){

        var request = gapi.client.youtube.search.list({
            q: this.get('query'),
            part: 'snippet',
            maxResults: 20,
        });
        request.execute( function( response ){
            var resultItems = new Array();

            $.each(response.items, function( name, value ){
                console.log('name:', name);
                console.log('value:', value);

                var info = value.snippet;

                var resultItem = {
                    imageSource: info.thumbnails.default.url,
                    imageAlt: info.title,
                    movieRoute: value.id.videoId,
                    movieTitle: info.title,
                    movieDescription: info.description,
                };

                resultItems.push(resultItem);
            });
            searchPanel.set('searchResultItems', resultItems);
        } );
    },

});

var searchPanelView = new kendo.View('searchPanelTpl', { model: searchPanel, wrap: false });
var searchResultView = new kendo.View('searchResultTpl', { model: searchPanel, wrap: false });


var layout = new kendo.Layout('appLayout');

layout.render($("#app"));

layout.showIn("#searchPanel", searchPanelView);
layout.showIn("#searchResult", searchResultView);
