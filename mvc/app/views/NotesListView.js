NotesApp.views.NotesListView = Ext.extend(Ext.Panel, {
	
	notesStore: Ext.emptyFn,
	notesList: Ext.emptyFn,
	
	layout: 'fit',
	
	initComponent: function () {
		
		this.newButton = new Ext.Button({
			text: 'New',
			ui: 'action',
			handler: this.onNewNote,
			scope: this
		});
		
		this.topToolBar = new Ext.Toolbar({
			title: 'My Notes',
			items: [
				{ xtype: 'spacer' },
				this.newButton
			]
		});
		
		this.dockedItems = [this.topToolBar];
		
		this.notesList = new Ext.List({
			store: this.notesStore,
			grouped: true,
			emptyText: '<div style="margin:5px;">No notes cached.</div>',
			onItemDisclosure: true,
			itemTpl: '<div class="list-item-title">{title}</div><div class="list-item-narrative">{narrative}</div>'
		});
		
		this.notesList.on('disclose', function (record, index, evt) {
			this.onEditNote(record, index);
		}, this);
		
		this.items = [this.notesList];
		
		NotesApp.views.NotesListView.superclass.initComponent.call(this);
	},
	
	onNewNote: function () {
		Ext.dispatch({
			controller: NotesApp.controllers.notesController,
			action: 'newnote'
		});
	},
	
	onEditNote: function (record, index) {
		Ext.dispatch({
			controller: NotesApp.controllers.notesController,
			action: 'editnote',
			note: record
		});
	},
	
	refreshList: function () {
		this.notesList.refresh();
	}
});

