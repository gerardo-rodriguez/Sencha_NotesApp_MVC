// App written following this tutorial: http://miamicoder.com/2011/writing-a-sencha-touch-application-part-1/
// Instantiate an application
var App = new Ext.Application({
	name: 'NotesApp',
	useLoadMask: true,
	launch: function () {
		
		Ext.regModel('Note', {
			idProperty: 'id',
			fields: [
				{ name: 'id', type: 'int' },
				{ name: 'date', type: 'date', dateFormat: 'c' },
				{ name: 'title', type: 'string' },
				{ name: 'narrative', type: 'string' }
			],
			validations: [
				{ type: 'presence', field: 'id' },
				{ type: 'presence', field: 'title', message: 'Please enter a title for this note.' }
			]
		});
		
		Ext.regStore('NotesStore', {
			model: 'Note',
			sorters: [{
				property: 'date',
				direction: 'DESC'
			}],
			proxy: {
				type: 'localstorage',
				id: 'notes-app-localstorage'
			},
			getGroupString: function (record) {
				if (record && record.data.date) {
					return record.get('date').toDateString();
				} else {
					return '';
				}
			}
		});
		
		NotesApp.views.noteEditorTopToolbar = new Ext.Toolbar({
			title: 'Edit Note',
			items: [
				{
					text: 'home',
					ui: 'back',
					handler: function () {
						// transition to the notes list view
						NotesApp.views.viewport.setActiveItem('notesListContainer', { type: 'slide', direction: 'right' });
					}
				},
				{ xtype: 'spacer' },
				{
					text: 'Save',
					ui: 'action',
					handler: function () {
						// save current note
						var noteEditor = NotesApp.views.noteEditor;
						
						var currentNote = noteEditor.getRecord();
						// Update the note with the values in the form fields.
						noteEditor.updateRecord(currentNote);
						
						var errors = currentNote.validate();
						if (!errors.isValid()) {
							Ext.Msg.alert("Wait!", errors.getByField('title')[0].message, Ext.emptyFn);
							return
						}
						
						var notesList = NotesApp.views.notesList;
						var notesStore = notesList.getStore();
						
						if (notesStore.findRecord('id', currentNote.data.id) === null) {
							notesStore.add(currentNote);
						}
						
						notesStore.sync();
						notesStore.sort([{ property: 'date', direction: 'DESC' }]);
						
						notesList.refresh();
						
						NotesApp.views.viewport.setActiveItem('notesListContainer', { type: 'slide', direction: 'right' });
					}
				}
			]
		});
		
		NotesApp.views.noteEditorBottomToolbar = new Ext.Toolbar({
			dock: 'bottom',
			items: [
				{ xtype: 'spacer' },
				{
					iconCls: 'trash',
					iconMask: true,
					handler: function () {
						// Delete current note
						var currentNote = NotesApp.views.noteEditor.getRecord();
						var notesList = NotesApp.views.notesList;
						var notesStore = notesList.getStore();
						
						if (notesStore.findRecord('id', currentNote.data.id)) {
							notesStore.remove(currentNote);
						}
						
						notesStore.sync();
						
						notesList.refresh();
						NotesApp.views.viewport.setActiveItem('notesListContainer', { type: 'slide', direction: 'right' });
					}
				}
			]
		});
		
		NotesApp.views.noteEditor = new Ext.form.FormPanel({
			id: 'noteEditor',
			items: [
				{
					xtype: 'textfield',
					name: 'title',
					label: 'Title',
					required: true
				},
				{
					xtype: 'textareafield',
					name: 'narrative',
					label: 'Narrative'
				}
			],
			dockedItems: [
				NotesApp.views.noteEditorTopToolbar,
				NotesApp.views.noteEditorBottomToolbar
			]
		});
		
		NotesApp.views.notesList = new Ext.List({
			id: 'notesList',
			store: 'NotesStore',
			grouped: true,
			emptyText: '<div style="margin: 5px;">No notes cached.</div>',
			itemTpl: '<div class="list-item-title">{title}</div><div class="list-item-narrative">{narrative}</div>',
			onItemDisclosure: function (record) {
				// render selected note in note editor
				var selectedNote = record;
				NotesApp.views.noteEditor.load(selectedNote);
				NotesApp.views.viewport.setActiveItem('noteEditor', { type: 'slide', direction: 'left' });
			},
			listeners: {
				'render': function (thisComponent) {
					thisComponent.getStore().load();
				}
			}
		});
		
		NotesApp.views.notesListToolbar = new Ext.Toolbar({
			id: 'notesListToolbar',
			title: 'My Notes',
			layout: 'hbox',
			items: [
				{ xtype: 'spacer' },
				{
					id: 'newNoteButton',
					text: 'New',
					ui: 'action',
					handler: function () {
						
						// creates new note and brings in view
						var now = new Date();
						var noteId = now.getTime();
						var note = Ext.ModelMgr.create({
							id: noteId,
							date: now,
							title: '',
							narrative: ''
						}, 'Note');
						
						NotesApp.views.noteEditor.load(note);
						NotesApp.views.viewport.setActiveItem('noteEditor', { type: 'slide', direction: 'left' });
					}
				}
			]
		});
		
		NotesApp.views.notesListContainer = new Ext.Panel({
			id: 'notesListContainer',
			layout: 'fit',
			html: 'This is the notes list container',
			dockedItems: [NotesApp.views.notesListToolbar],
			items: [NotesApp.views.notesList]
		});
		
		NotesApp.views.viewport = new Ext.Panel({
			fullscreen: true,
			layout: 'card',
			cardAnimation: 'slide',
			items: [
				NotesApp.views.notesListContainer, 
				NotesApp.views.noteEditor
			]
		});
	}
});