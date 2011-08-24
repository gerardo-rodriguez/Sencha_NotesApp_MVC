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
				{ type: 'presence', field: 'title' }
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
			data: [
				{ id: 1, date: new Date(), title: 'Test Note', narrative: 'This is simply a test note.' }
			]
		});
		
		NotesApp.views.notesList = new Ext.List({
			id: 'notesList',
			store: 'NotesStore',
			itemTpl: '<div class="list-item-title">{title}</div><div class="list-item-narrative">{narrative}</div>'
		});
		
		NotesApp.views.notesListToolbar = new Ext.Toolbar({
			id: 'notesListToolbar',
			title: 'My Notes'
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
			items: [NotesApp.views.notesListContainer]
		});
	}
});