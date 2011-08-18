// This registers the name of the application
Ext.regApplication({
	name: "teagrams",
	launch: function(){
		this.views.viewport = new this.views.Viewport();
	}
});