//"models"

var searchModel = kendo.observable({

    query: 'star wars',

    searchResultItems: new Array(),

    nextPageToken: null,

    autocompleteData: new Array(),

    search: function(){

        console.log('try find "' + this.query + '"');

        var request = gapi.client.youtube.search.list({
            q: this.query,
            part: 'snippet',
            type: 'video',
            maxResults: 20,
        });

        request.execute( function( response ){
            console.log('response:', response);
            searchModel.set('nextPageToken',  response.nextPageToken );
            var resultItems = new Array();
            var arrTitles = new Array;

            $.each(response.items, function( name, value ){
                //console.log('name:', name);
                //console.log('value:', value);

                var info = value.snippet;

                var resultItem = {
                    imageSource: info.thumbnails.default.url,
                    imageAlt: info.title,
                    videoRoute: '#/video/' + value.id.videoId,
                    videoTitle: info.title,
                    videoAuthor: info.channelTitle,
                    videoPublishedAt: convertYoutubeDate( info.publishedAt ),
                };


                resultItems.push(resultItem);
                arrTitles.push(info.title);
            });
            searchModel.set('searchResultItems', resultItems);
            searchModel.set('autocompleteData', arrTitles );
        });
    },

    loadNextPageResult: function(){
        //searchModel.set('searchResultItems', resultItems);
        console.log('try load more "' + this.query + '"');

        var request = gapi.client.youtube.search.list({
            q: this.query,
            part: 'snippet',
            type: 'video',
            maxResults: 20,
            pageToken: this.nextPageToken
        });

        request.execute( function( response ) {
            console.log('response:', response);
            searchModel.set('nextPageToken', response.nextPageToken);
            var resultItems = searchModel.searchResultItems;
            //console.log('this.searchResultItems:', searchModel.searchResultItems);
            
            //var arrTitles = new Array;

            $.each(response.items, function (name, value) {
                //console.log('name:', name);
                //console.log('value:', value);

                var info = value.snippet;

                var resultItem = {
                    imageSource: info.thumbnails.default.url,
                    imageAlt: info.title,
                    videoRoute: '#/video/' + value.id.videoId,
                    videoTitle: info.title,
                    //videoDescription: info.description,
                    videoAuthor: info.channelTitle,
                    videoPublishedAt: convertYoutubeDate(info.publishedAt),
                };


                resultItems.push(resultItem);
                //arrTitles.push(info.title);
            });
            searchModel.set('searchResultItems', resultItems);
        });
    }

});

var videoModel = kendo.observable({
    imageSource: '',
    imageAlt: '',
    videoTitle: '',
    videoDescription: '',
    videoPublishedAt: null,
    videoId: null,
    userComment: 'text your comment',

    open: function( videoId ) {

        var request = gapi.client.youtube.videos.list({
            part: 'snippet',
            id: videoId
        });
        var model = this;
        request.execute(function (response) {
            console.log('response', response);
            //console.log('model', model);
            var info = response.items[0].snippet;
            imgSrc = info.thumbnails.high.url;
            videoModel.set('imageSource', imgSrc);
            model.set('imageAlt', info.title);
            model.set('videoTitle', info.title);
            model.set('videoDescription', info.description);
            model.set('videoUrl', 'http://www.youtube.com/v/' + videoId + '?fs=1&autoplay=1')
        });

        this.set('videoId', videoId);
        this.loadComments();
    },

    play: function() {

        $('#playerWindow').kendoWindow({
            actions: ["Refresh", "Maximize", "Minimize", "Close"],
            draggable: true,
            height: "300px",
            width: "500px",
            modal: true,
            resizable: true,
            title: "Modal Window",
            iframe: true,
            content: this.videoUrl,
            close: function(e){
                console.log('e:', e);
                $('#playerWindow').html(''); //cause destroy doesn't want to work
            }
        }).data("kendoWindow");

        var player = $("#playerWindow").data("kendoWindow");
        player.center().open();

    },

    comments: null,

    addComment: function(e){
        if (e.keyCode == 13) {
            arrComments = this.comments;
            console.log('new comment: ', this.userComment);
            arrComments.push({
                commentText: this.userComment,
                commentDateTime: new Date().toLocaleString(),
            });

            console.log('new arrComments:',arrComments);

            this.set('comments', arrComments);

            localStorage.setItem( this.videoId, JSON.stringify(arrComments));
            console.log('localStorage:', localStorage);
        }
    },
    loadComments: function(){
        console.log('loadComments invoke');
        if (!localStorageSupport) {
            data = null;
            alert('sorry, comments are unavailable!');
        }
        else
            data = JSON.parse(localStorage.getItem(this.videoId)) || new Array();
        this.set('comments',  data);
        console.log('this.comments:', this.comments);
    }
});



//view & layout
var searchPanelView = new kendo.View('searchPanelTpl', { model: searchModel, wrap: false });
var searchResultView = new kendo.View('searchResultTpl', { model: searchModel, wrap: false });
var videoDetailsView = new kendo.View('videoDetailsTpl', { model: videoModel, wrap: false, evalTemplate: true });

var layout = new kendo.Layout('appLayout');


//routing
var router = new kendo.Router({
    change: function(e) {
        console.log(e.url);
    }
});

router.route("/", function( ) {
    //$('#videoDetails').html('welcome');
    searchModel.search();
});

router.route("/video/:id", function( id ) {
console.log('videoModel.videoId:', videoModel.videoId);
    if ( videoModel.videoId === null ){
        $('#videoDetails').fadeIn(500);
        $('#welcomeBlock').fadeOut(500);
    }

    videoModel.open( id );
    $("#playButton").kendoButton({
        icon: "arrowhead-e"
    });
});


//
var localStorageSupport = false;



//init app
function appInit() {
    gapi.client.load('youtube', 'v3', function(){

        console.log('youtube client loaded');

        gapi.client.setApiKey('AIzaSyCYvoN4eLABsyKaG1nS8T1GSHMKL5Us3BA');

        $("#app").html('');

        layout.render($("#app"));
        layout.showIn("#searchPanel", searchPanelView);
        layout.showIn("#searchResult", searchResultView);
        layout.showIn("#videoDetails", videoDetailsView);

        localStorageSupport = (('localStorage' in window && window['localStorage'] !== null));

        $('#searchQuery').kendoAutoComplete({
            change: function(){
                searchModel.set('query',this.value());
                searchModel.search();
            },
            valuePrimitive: true,
            dataTextField: "name"
        });
        kendo.bind($('#searchQuery'), searchModel);

        router.start();
    });
    console.log('gapi client loaded');
}

function convertYoutubeDate( strDate ){
    var publishedAt = strDate.split('T')[0].split('-');
    var converted = publishedAt[2] + ' ' + publishedAt[1] + ' ' + publishedAt[0]
    return converted;
}