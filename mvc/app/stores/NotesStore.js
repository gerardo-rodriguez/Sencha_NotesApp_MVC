Ext.regStore('NotesStore', {
	model: 'NoteModel',
	sorters: [{
		property: 'date',
		direction: 'DESC'
	}],
	proxy: {
		type: 'localstorage',
		id: 'notes-app-store'
	},
	getGroupString: function (record) {
		if( record && record.data.date ) {
			return record.get('date').toDateString();
		} else {
			return '';
		}
	}
});

NotesApp.stores.notesStore = Ext.StoreMgr.get('NotesStore');