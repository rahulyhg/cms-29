var Firebase = require('firebase')
var models = require('../../models')

var dataRef = new Firebase('https://entries.firebaseIO.com/data/')

module.exports = {
	template: require('./entries.html'),
	data: function () {
		return {
			entries: null
		}
	},
	computed: {
		path: function () {
			return this.$route.params.model
		},
		model: function () {
			return models[this.$route.params.model]
		},
		fields: function () {
			return this.model.fields.filter(function (filter) {
				return filter.listed
			})
		},
		entriesRef: function () {
			return dataRef.child(this.model.property)
		}
	},
	watch: {
		path: {
			immediate: true,
			handler: function () {
				this.entries = null
				this.entriesRef.once('value', function (snapshot) {
					this.entries = snapshot.val()
				}.bind(this))
			}
		}
	}
}
