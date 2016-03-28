//routing

var router = new kendo.Router();

router.route("/", function( ) {
    var welcomeTpl = $("#welcomeMsgTpl").html();
    $('#app > div').append(welcomeTpl);
    searchModel.one("removeWelcomeMsg", function(){
        $('.welcome-block').remove();
    })
});

router.route("/video/:id", function( id ) {

    if ( !videoModel.videoId ){
        $('#videoDetails').fadeIn(500);
        $('#welcomeBlock').fadeOut(500);
        $('#loadMoreBtn').show();

    }

    videoModel.open( id );

});
