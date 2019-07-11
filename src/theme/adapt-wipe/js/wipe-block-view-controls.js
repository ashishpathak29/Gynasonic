define('theme/adapt-wipe/js/wipe-block-view-controls',['require','backbone','coreJS/adapt'],function(require) {
    
    var Backbone = require('backbone');
    var Adapt = require('coreJS/adapt');

    var BlockViewControls = Backbone.View.extend({

        initialize: function() {
            this.listenTo(Adapt, 'remove', this.remove);
        },

    	events: {
    		'click .wipe-control-up':'triggerWipeUp',
    		'click .wipe-control-down':'triggerWipeDown'
    	},

    	triggerWipeUp: function(event) {
    		event.preventDefault();
    		Adapt.trigger("wipe:wipeUp", this.model);
    	},

    	triggerWipeDown: function(event) {
    		event.preventDefault("triggerWipeDown");
    		Adapt.trigger("wipe:wipeDown", this.model);
    	}

    });

    return BlockViewControls;

});
