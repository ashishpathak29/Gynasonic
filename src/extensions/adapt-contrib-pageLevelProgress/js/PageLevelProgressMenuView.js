define(function(require) {

    var Adapt = require('coreJS/adapt');
    var Backbone = require('backbone');

    var PageLevelProgressMenuView = Backbone.View.extend({

        className: 'page-level-progress-menu-item',
		

        initialize: function() {
            this.listenTo(Adapt, 'remove', this.remove);

            this.ariaText = '';
            if (Adapt.course.get('_globals')._extensions && Adapt.course.get('_globals')._extensions._pageLevelProgress && Adapt.course.get('_globals')._extensions._pageLevelProgress.pageLevelProgressMenuBar) {
                this.ariaText = Adapt.course.get('_globals')._extensions._pageLevelProgress.pageLevelProgressMenuBar + ' ';
				
            }

            this.render();

            _.defer(_.bind(function() {
                this.updateProgressBar();
            }, this));
        },

        events: {
        },

        render: function() {
            var data = this.model.toJSON();
            
			_.extend(data, {
                _globals: Adapt.course.get('_globals')
            });
            var template = Handlebars.templates['pageLevelProgressMenu'];

            this.$el.html(template(data));
			
            return this;
        },
		
        updateProgressBar: function() {
		
		
            if (this.model.get('completedChildrenAsPercentage')) {
				
                var percentageOfCompleteComponents = this.model.get('completedChildrenAsPercentage');
                var completedStats = 'completedState';
				var num = this.model.get('_id').slice(3, 5)
				if (num > 15)
				{
					num = num - 5;
				}
				$(".floatingmenu-inner .menu" + (num / 5)).removeClass("activePageStatus");
				//$(".floatingmenu-inner .menu" + (num / 5)).addClass("floatingMenuButtonVisited");
				
				
			    
				
				
            } else {
                var percentageOfCompleteComponents = 0;
                var completedStats = '';
            }

            // Add percentage of completed components as an aria label attribute
            this.$('.page-level-progress-menu-item-indicator-bar .aria-label').html(this.ariaText + Math.floor(percentageOfCompleteComponents) + '%');
            this.$('.page-level-progress-menu-item-indicator').addClass(completedStats);
			//$(".floatingmenu-inner .menu1").addClass(completedStats);
			
			

        },

    });

    return PageLevelProgressMenuView;

});
