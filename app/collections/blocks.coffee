Block = require '../models/block'

module.exports = class Blocks extends Backbone.Collection
	model: Block

	getBySlug: (slug) ->
		result = null
		@each (b) ->
			result = b if b.get('slug') == slug
		# console.log("get slug ",result)
		result