Blocks = require '../collections/blocks'

module.exports = class Channel extends Backbone.Model
	urlRoot: 'http://are.na/api/v2/channels/'

	initialize: ->
		@isParsed = false

	parse: (o) ->
		return if @isParsed || !o
		@isParsed = true

		@attributes.blocks = new Blocks() unless @attributes.blocks

		i = -1
		if o.contents 
			for c in o.contents
				if c.object
					@attributes.blocks.add(c.object)
				else
					@attributes.blocks.add(c)

		@attributes.blocks.model = @ if @attributes.blocks
		super o
