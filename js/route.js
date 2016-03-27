//routing

var router = new kendo.Router();

router.route("/", function( ) {

});

router.route("/video/:id", function( id ) {

    if ( !videoModel.videoId ){
        $('#videoDetails').fadeIn(500);
        $('#welcomeBlock').fadeOut(500);
        $('#loadMoreBtn').show();

    }

    videoModel.open( id );

    $("#playButton").kendoButton({
        icon: "arrowhead-e"
    });

});
