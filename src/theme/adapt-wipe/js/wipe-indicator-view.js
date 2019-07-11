define('theme/adapt-wipe/js/wipe-indicator-view',['require','coreJS/adapt','backbone'],function(require) {
	
	var Adapt = require("coreJS/adapt");
    var Backbone = require("backbone"); 

    var WipeIndicatorView = Backbone.View.extend({

        initialize: function(options) {        
            this.indicatorCount = options.indicatorCount || 0;
            this.setup();             
            this.listenTo(Adapt, 'remove', this.remove);            
            this.listenTo(Adapt, "wipe:wipeComplete", this.setIndicatorSelected);
            this.listenTo(Adapt, "device:resize", this.setup);
        },

        events: {
            'click .wipe-indicator':'triggerWipe'
        },

        setup: function() {
            
            var wipeOptions = this.model.get('_wipe');
            
            if(wipeOptions.type === "graphic") {                
                
                var mt = parseInt($('.wipe-indicators').css('marginTop'));
                var height = $(window).height() - $('.navigation').height() - mt*2 ;
                $('.wipe-indicator').css('height',height/this.indicatorCount);                      
            }
            else {
                var height = this.$el.height();
                this.$el.css({marginTop:-height/2 + "px"});
            }
        },

        triggerWipe: function(event) {
            event.preventDefault();
            var $currentTarget = $(event.currentTarget);
            var id = $currentTarget.attr("data-id");
            var index = $(".wipe-indicator").index($currentTarget);
            var indicator = {
                id: id,
                index: index 
            }
            Adapt.trigger("wipe:wipeToIndex", indicator);
        },

        setIndicatorSelected: function(index) {
            $(".wipe-indicator").removeClass("wipe-selected");
            $(".wipe-indicator").eq(index).addClass("wipe-selected");
        }

    });

    return WipeIndicatorView;

});
