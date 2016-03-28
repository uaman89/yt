SearchModel = {

    query: '',

    searchResultItems: new Array(),

    nextPageToken: null,

    autocompleteData: new Array(),

    search: function( pageToken ){
        //console.log('try find "' + this.query + '"');

        //clear welcome msg (executed only once)
        this.trigger('removeWelcomeMsg');

        var searchParams = {
            q: this.query,
            part: 'snippet',
            type: 'video',
            maxResults: 20,
        };

        if ( pageToken ){
            searchParams.pageToken = pageToken;
        }

        var request = gapi.client.youtube.search.list( searchParams );

        var self = this;

        request.execute( function( response ){
            //console.log('response:', response);
            self.set('nextPageToken',  response.nextPageToken );
            var resultItems = new Array();
            var autocompleteData = new Array;

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
                autocompleteData.push( { "id":  value.id.videoId, "title": info.title } );
            });

            //check previous results. if it was empty before - we need show result Panel now.
            if ( self.searchResultItems.length == 0 ) $('#app').addClass('show-result-panel');

            self.set('searchResultItems', resultItems);
            self.set('autocompleteData', autocompleteData );

        });
    },

    loadNextPageResult: function(){
        this.search(this.nextPageToken);
    }

};
//--- end SearchModel --------------------------------------------------------------------------------------------------


VideoModel = {
    imageSource: '',
    imageAlt: '',
    videoTitle: '',
    videoDescription: '',
    videoViewCount: '',
    videoAuthor: '',
    videoPublishedAt: '',
    videoId: '',
    userComment: '',
    noCommentsMsg: '',

    open: function( videoId ) {

        var request = gapi.client.youtube.videos.list({
            part: 'snippet,statistics',
            id: videoId
        });
        var self = this;
        request.execute(function (response) {
            //console.log('response', response);
            //console.log('model', model);
            var info = response.items[0].snippet;
            imgSrc = info.thumbnails.high.url;
            self.set('imageSource', imgSrc);
            self.set('imageAlt', info.title);
            self.set('videoTitle', info.title);
            self.set('videoDescription', info.description);
            self.set('videoPublishedAt', convertYoutubeDate( info.publishedAt ));
            self.set('videoAuthor', info.channelTitle);
            self.set('videoViewCount', response.items[0].statistics.viewCount);
            //self.set('videoUrl', 'http://www.youtube.com/v/' + videoId + '?fs=1&autoplay=1') //flash
            self.set('videoUrl', 'http://www.youtube.com/embed/' + videoId + '?fs=1&autoplay=1'); //html5
        });

        this.set('videoId', videoId);
        this.loadComments();
    },

    play: function() {

        $.fancybox({
            'padding'		: 0,
            'autoScale'		: false,
            'transitionIn'	: 'fade',
            'transitionOut'	: 'fade',
            'title'			: this.videoTitle,
            'href'			: this.videoUrl,
            'type'			: 'iframe', //'swf' - for flash
            //'swf'			: {
            //    'wmode'				: 'transparent',
            //    'allowfullscreen'	: 'true'
            //}
        });

        /* kendoWindow is lagging...
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
                $('#playerWindow').html(''); //cause destroy doesn't want to work
            }
        }).data("kendoWindow");

        var player = $("#playerWindow").data("kendoWindow");
        player.center().open();
        */

    },

    comments: null,

    addComment: function(e){
        console.log('e',e);

        var isEnterPressed = (e.keyCode == 13 && e.shiftKey === false) ? true : false;
        var isAddBtnCliked = (e.type == 'click' && e.target.className == 'add-comment-btn') ? true : false;

        if ( isEnterPressed || isAddBtnCliked ) {

            //handle user comment
            var comment = this.userComment;

            if ( comment == '' ) {
                alert('we don\'t add empty comments ;-)');
                return;
            }
            comment = comment.replace(/^(?=\n)$|^\s*|\s*$|\n\n+/gm,"");
            console.log('comment', '['+comment+']');

            arrComments = this.comments;
            for ( key in arrComments ){
                if ( arrComments[ key ]['commentText'] == comment ){
                    alert("That comment already exists.\nBe more creative!");

                    return;
                }
            }



            //console.log('new comment: ', this.userComment);
            arrComments.push({
                commentText: comment,
                commentDateTime: new Date().toLocaleString(),
            });

            //console.log('new arrComments:',arrComments);

            this.set('comments', arrComments);

            localStorage.setItem( this.videoId, JSON.stringify(arrComments));
            //console.log('localStorage:', localStorage);

            this.set('noCommentsMsg', '');
        }
    },
    loadComments: function(){
        //console.log('loadComments invoke');
        var data = new Array();
        if (localStorageSupport)
            data = JSON.parse(localStorage.getItem(this.videoId)) || new Array();
        //console.log('data:', data);

        //var msg = ;
        this.set('noCommentsMsg',  data.length == 0  ? 'there is no comments yet...' : '');

        this.set('comments',  data);
        //console.log('this.comments:', this.comments);
    }
};
