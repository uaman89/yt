//models
var searchModel = kendo.observable( SearchModel );
var videoModel = kendo.observable( VideoModel );



//view & layout
var searchPanelView = new kendo.View('searchPanelTpl', { model: searchModel, wrap: false });
var searchResultView = new kendo.View('searchResultTpl', { model: searchModel, wrap: false });
var videoDetailsView = new kendo.View('videoDetailsTpl', { model: videoModel, wrap: false, evalTemplate: true });

var layout = new kendo.Layout('appLayout');



// variable to check localStorage support
var localStorageSupport = false;



//init app
function appInit() {
    gapi.client.load('youtube', 'v3', function(){

        //console.log('youtube client loaded');

        gapi.client.setApiKey('AIzaSyCYvoN4eLABsyKaG1nS8T1GSHMKL5Us3BA');

        //clear "welcome message"
        $("#app").html('');

        //render page
        layout.render($("#app"));
        layout.showIn("#searchPanel", searchPanelView);
        layout.showIn("#searchResult", searchResultView);
        layout.showIn("#videoDetails", videoDetailsView);


        localStorageSupport = (('localStorage' in window && window['localStorage'] !== null));


        //init autocomplete widget
        $('#searchQuery').kendoAutoComplete({
            select: function(e) {
                var dataItem = this.dataItem(e.item.index());
                router.navigate('/video/' + dataItem.id);

            },
            filtering: function(e) {
                //get filter descriptor
                //console.log('e.filter:', e.filter);
                searchModel.set('query',this.value());
                searchModel.search();
                this.suggest(this.value());
                this.setDataSource(searchModel.autocompleteData);
                // handle the event
            },
            dataTextField: "title",
            placeholder: "Enter your query"
        });
        var autocomplete = $("#searchQuery").data("kendoAutoComplete");
        autocomplete.focus();

        $('.sidebar, .video-details').mCustomScrollbar({
            theme: "rounded-dark",
            snapOffset: 20,
            callbacks:{
                //remove tabindex for better user experience
                onInit:function(){
                    var res = $('.sidebar > .mCustomScrollBox').removeAttr('tabindex');
                }
            }
        });

        router.start();
    });
}


function convertYoutubeDate( strDate ){
    var publishedAt = strDate.split('T')[0].split('-');
    var converted = publishedAt[2] + ' ' + arrMonthNames[ publishedAt[1] - 1 ] + ' ' + publishedAt[0];
    return converted;
}

var arrMonthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];