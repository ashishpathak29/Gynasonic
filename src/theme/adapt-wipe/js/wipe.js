define('theme/adapt-wipe/js/wipe',['require','coreJS/adapt','backbone','theme/adapt-wipe/js/wipe-block-view-controller'],function(require) {
	
	var Adapt = require("coreJS/adapt");
    var Backbone = require("backbone");
    var BlockWipeViewController = require('theme/adapt-wipe/js/wipe-block-view-controller');

    Adapt.on('router:page', function(model) {
        if (model.getChildren().length > 1) {
            return;
        }
    	var article = model.getChildren().filter(function(article) {
    		return article.get("_wipe") && article.get("_wipe")._isActive;
    	});
    	new BlockWipeViewController({model:article[0]});
    });

});
