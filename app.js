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