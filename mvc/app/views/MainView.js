NotesApp.views.MainView = Ext.extend(Ext.Panel, {
	fullscreen: true,
	layout: 'card',
	cardSwitchAnimation: 'slide',
	initComponent: function () {
		
		Ext.apply(NotesApp.views, {
			notesListView: new NotesApp.views.NotesListView({ notesStore: NotesApp.stores.notesStore}),
			noteEditorView: new NotesApp.views.NoteEditorView()
		});
		
		this.items = [
			NotesApp.views.notesListView,
			NotesApp.views.noteEditorView
		];
		
		NotesApp.views.MainView.superclass.initComponent.call(this);
		
		this.on('render', function () {
			NotesApp.stores.notesStore.load();
		});
	}
});