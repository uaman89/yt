//"models"

var searchModel = kendo.observable({

    query: 'star wars',

    searchResultItems: new Array(),

    search: function(){

        console.log('try find "' + this.query + '"');

        var request = gapi.client.youtube.search.list({
            q: this.query,
            part: 'snippet',
            type: 'video',
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
                    videoRoute: '#/video/'+value.id.videoId,
                    videoTitle: info.title,
                    videoDescription: info.description,
                };

                resultItems.push(resultItem);
            });
            searchModel.set('searchResultItems', resultItems);
        });
    },

});

var videoModel = kendo.observable({
    imageSource: 'https://i.ytimg.com/vi/Vk-1gRKwft0/default.jpg',
    imageAlt: 'imgtitle',
    videoTitle: 'title',
    videoDescription: 'desc',
    videoId: null,
    comments: new Array(),
    userComment: 'text your comment',

    open: function( videoId ) {
        var request = gapi.client.youtube.videos.list({
            part: 'snippet,contentDetails',
            id: videoId
        });
        var model = this;
        request.execute(function (response) {
            console.log('response', response);
            console.log('model', model);
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

    player: null,

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
            close: function(){
                videoModel.player.destroy();
            }
        }).data("kendoWindow");

        var player = $("#playerWindow").data("kendoWindow");
        player.center().open();

        this.set('player' , player);

    },
    addComment: function(e){
        if (e.keyCode == 13) {
            arrComments = this.comments;
            arrComments.push = {
                commentText: this.userComment
            };
            this.set('comments', arrComments);
            localStorage.setItem( this.videoId, JSON.stringify(arrComments));
        }
    },
    loadComments: function(){
        if (!localStorageSupport) {
            data = null;
            alert('sorry, comments are unavailable!');
        }
        else
            data = JSON.parse(localStorage.getItem(this.videoId)) || null;
        this.set('comments',  data);
    }
});



//view & layout
var searchPanelView = new kendo.View('searchPanelTpl', { model: searchModel, wrap: false });
var searchResultView = new kendo.View('searchResultTpl', { model: searchModel, wrap: false });
var videoDetailsView = new kendo.View('videoDetailsTpl', { model: videoModel, wrap: false });

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

        router.start();

        localStorageSupport = (('localStorage' in window && window['localStorage'] !== null));
    });
    console.log('gapi client loaded');
}
