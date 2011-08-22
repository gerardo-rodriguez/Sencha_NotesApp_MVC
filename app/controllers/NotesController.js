Ext.regController('NotesController', {
	
	'index': function (options) {
		if (!NotesApp.views.mainView) {
			NotesApp.views.mainView = new NotesApp.views.MainView();
		}
		
		NotesApp.views.mainView.setActiveItem( NotesApp.views.notesListView );
	},
	
	'newnote': function (options) {
		
		var now = new Date();
		var noteId = now.getTime();
		var note = Ext.ModelMgr.create(
			{ 
				id: noteId, 
				date: now, 
				title: '', 
				narrative: ''
			}, 'NoteModel');
			
			
		NotesApp.views.noteEditorView.load(note);
		NotesApp.views.mainView.setActiveItem(
			NotesApp.views.noteEditorView,
			{ type: 'slide', direction: 'left' }
		);
	},
	
	'editnote': function (options) {
		
		NotesApp.views.noteEditorView.load(options.note);
		NotesApp.views.mainView.setActiveItem(
			NotesApp.views.noteEditorView,
			{ type: 'slide', direction: 'left' }
		);
	},
	
	'savenote': function (options) {
		
		var currentNote = NotesApp.views.noteEditorView.getRecord();
		
		NotesApp.views.noteEditorView.updateRecord(currentNote);
		
		var errors = currentNote.validate();
		if (!errors.isValid()) {
			Ext.Msg.alert('Wait!', errors.getByField('title')[0].message, Ext.emptyFn);
			return;
		}
		
		if (null == NotesApp.stores.notesStore.findRecord('id', currentNote.data.id)) {
			NotesApp.stores.notesStore.add(currentNote);
		}
		
		NotesApp.stores.notesStore.sync();
		
		NotesApp.stores.notesStore.sort([{ property: 'date', direction: 'DESC'}]);
		
		NotesApp.views.notesListView.refreshList();
		
		NotesApp.views.mainView.setActiveItem(
			NotesApp.views.notesListView,
			{ type: 'slide', direction: 'right' }
		);
	},
	
	'deletenote': function (options) {
		
		var currentNote = NotesApp.views.noteEditorView.getRecord();
		
		if (NotesApp.stores.notesStore.findRecord('id', currentNote.data.id)) {
			NotesApp.stores.notesStore.remove(currentNote);
		}
		
		NotesApp.stores.notesStore.sync();
		NotesApp.views.notesListView.refreshList();
		
		NotesApp.views.mainView.setActiveItem(
			NotesApp.views.notesListView,
			{ type: 'slide', direction: 'right' }
		);
	},
	
	'canceledit': function (options) {
		
		NotesApp.views.mainView.setActiveItem(
			NotesApp.views.notesListView,
			{ type: 'slide', direction: 'right' }
		);
	}
});

NotesApp.controllers.notesController = Ext.ControllerManager.get('NotesController');