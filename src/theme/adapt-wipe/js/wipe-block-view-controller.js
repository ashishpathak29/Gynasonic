define('theme/adapt-wipe/js/wipe-block-view-controller',['require','backbone','coreJS/adapt','theme/adapt-wipe/js/wipe-indicator-view','theme/adapt-wipe/js/wipe-block-view-controls'],function(require) {
    
    var Backbone = require('backbone');
    var Adapt = require('coreJS/adapt');
    var WipeIndicatorView = require('theme/adapt-wipe/js/wipe-indicator-view');
    var BlockViewControls = require('theme/adapt-wipe/js/wipe-block-view-controls');

    // TODO:
    // Make non-tranlsatable variables have an underscore


    var BlockWipeViewController = Backbone.View.extend({

    	initialize: function() {
            this.collection = this.model.getChildren();            
            this.currentIndex = 0;            
            this.listenTo(Adapt, 'remove', this.remove);
            this.listenTo(Adapt, "articleView:postRender", this.indicatorSetup);
            this.listenTo(Adapt, "articleView:postRender wipe:wipeComplete", this.checkIndicatorVisibility);
            this.listenTo(Adapt, "articleView:postRender", this.articleSetup);
            this.listenTo(Adapt, "blockView:preRender", this.preBlockSetup);
            this.listenTo(Adapt, "blockView:postRender", this.blockSetup);
            this.listenTo(Adapt, "wipe:wipeUp", this.wipeUp);
            this.listenTo(Adapt, "wipe:wipeDown", this.wipeDown);
            this.listenTo(Adapt, "wipe:wipeToIndex", this.handleExternalEvent);
            this.listenTo(Adapt,'page:scrollTo', this.handleScrollToEvent);
            this.listenTo(Adapt, "device:resize", this.handleResize);            
    	},

        indicatorSetup: function() {
            this.indicatorCount = 0;                        
            _.each(this.model.attributes._children.models, function(model) {
                this.indicatorCount += model.get('wipe-indicators')._hide ? 0 : 1;
            }, this);             
            new WipeIndicatorView({el: "." + this.model.get("_id") + " .wipe-indicators", model : this.model, indicatorCount: this.indicatorCount});
            Adapt.trigger("wipe:wipeComplete", this.currentIndex);
        },
        
        checkIndicatorVisibility : function() {            
            var currentBlockModel = this.collection.at(this.currentIndex);
            var wipeIndicatorOptions = currentBlockModel.get('wipe-indicators');
            if(!wipeIndicatorOptions || wipeIndicatorOptions._hide) {
                $('.wipe-indicators').addClass('disabled');
            }
            else {
                $('.wipe-indicators').removeClass('disabled');
            }
            //temporary fix for adapt 100
            if(wipeIndicatorOptions._animate)
            {
                var id = currentBlockModel.get("_id");
                $('.wipe-indicators').addClass('animateShow');                        
            }
            else{
                $('.wipe-indicators').removeClass('animateShow');                        
            }
            
        },

    	articleSetup: function(view) {
    		var that = this;
    		this.model.set({
    			height: $(window).height() - $(".navigation").height()
    		});
    		$("." + this.model.get("_id")).css({
    			height: this.model.get("height") + "px",
    			overflow: "hidden"
    		});
    	},

    	preBlockSetup: function(view) {
    		view.model.set({
    			_wipe:{_isActive:true}
    		});
    		this.configureBlockControls(view.model);
    	},

    	blockSetup: function(view) {
    		this.resizeBlock(view);
    		new BlockViewControls({
    			model:view.model, el:"." + view.model.get("_id") + " .wipe-controls"
    		});
            var index = _.indexOf(this.collection.models, view.model);
            if (index !== 0) {
                _.each(view.model.getChildren().models, function(model) {
                    this.setupComponents(model);
                }, this);
            }
    	},

        setupComponents: function(component) {
            $("." + component.get("_id")).css({
                marginTop:100 + "px",
                opacity:0
            });
        },

    	configureBlockControls: function(model) {
            var wipe = model.get("_wipe");
    		var index = _.indexOf(this.collection.models, model);
    		if (index == 0) {
                wipe._isInitial = true;
            } 
    		if (index == this.collection.models.length - 1) {
                wipe._isFinal = true;
            }
            model.set("wipe", wipe);
    	},

    	resizeBlock: function(view) {
    		$("." + view.model.get("_id")).css({
    			width: 100 + "%",
    			height: this.model.get("height") + "px"
    		});
            $("." + view.model.get("_id")).addClass("wipe-isActive");
    	},

    	wipeUp: function(model) {
    		var index = _.indexOf(this.collection.models, model) - 1;
            this.currentIndex = index;
            var currentBlock = this.collection.models[index + 1];
    		this.wipe(index);
            this.wipeUpComponents(currentBlock);
            this.wipeUpCover(currentBlock);
            this.resetOverflow();
    	},

    	wipeDown: function(model) {
    		var index = _.indexOf(this.collection.models, model) + 1;
            this.currentIndex = index;
            var nextBlock = this.collection.models[index];
    		this.wipe(index);
            this.wipeDownComponents(nextBlock);
            this.wipeDownCover(nextBlock);
            this.resetOverflow();
    	},

    	wipe: function(index) {
    		var marginTop = this.model.get("height") * index;
    		$("." + this.model.get("_id") + " .article-inner").stop(true, true).animate({
    			marginTop: -marginTop + "px"
    		}, function() {
                Adapt.trigger("wipe:wipeComplete", index);
            });
    	},

        wipeUpComponents: function(currentBlock) {
            _.each(currentBlock.getChildren().models, function(component) {
                $("." + component.get("_id")).stop(true, true).animate({
                    marginTop:100 + "px",
                    opacity:0
                }, 1400);
            }, this);
        },

        wipeDownComponents: function(nextBlock) {
            _.each(nextBlock.getChildren().models, function(component) {
                $("." + component.get("_id")).stop(true, true).animate({
                    marginTop:0,
                    opacity:1
                }, 1400);
            }, this);
        },

        wipeUpCover: function(currentBlock) {
            $("." + currentBlock.get("_id") + " .wipe-cover").stop(true, true).animate({
                top:0,
                opacity:1
            }, 800);
        },

        wipeDownCover: function(nextBlock) {
            $("." + nextBlock.get("_id") + " .wipe-cover").stop(true, true).animate({
                top:-100 + "%",
                opacity:0
            }, 800);
        },

        resetOverflow: function() {
            $(".block").stop(true, true).animate({ scrollTop: 0 }, 800);
        },

        handleExternalEvent: function(indicator) {
            this.wipe(indicator.index);
            _.each(this.collection.models, function(model) {
                var index = _.indexOf(this.collection.models, model);
                if (index <= indicator.index) {
                    this.wipeDownComponents(model);
                    this.wipeDownCover(model);
                } else if (index > indicator.index){
                    this.wipeUpComponents(model);
                    this.wipeUpCover(model);
                }
            }, this);
            this.currentIndex = indicator.index;
        },
        
        handleScrollToEvent : function(componentSelector){               
            componentSelector = componentSelector.replace(/[.]/g,'');                                                
            var componentModel = Adapt.components.findWhere({_id:componentSelector});
            var blockModel = componentModel.getParent();
            var index = _.indexOf(this.collection.models, blockModel );
            this.handleExternalEvent({id: componentSelector, index : index});            
        },

        handleResize: function() {
            this.articleSetup();
            $(".block.wipe-isActive").css({
                width: 100 + "%",
                height: this.model.get("height") + "px"
            });
            this.wipe(this.currentIndex);
        },

    });

    return BlockWipeViewController;

});
