// THis app was created following this tutorial: http://css.dzone.com/articles/writing-sencha-touch-mvc
// This registers the name of the application
Ext.regApplication({
	name: "NotesApp",
	useLoadMask: true,
	
	launch: function () {
		Ext.dispatch({
			controller: NotesApp.controllers.notesController,
			action: 'index'
		});
	}
});