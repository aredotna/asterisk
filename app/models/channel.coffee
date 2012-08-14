Blocks = require '../collections/blocks'

module.exports = class Channel extends Backbone.Model
	urlRoot: 'http://are.na/api/v2/channels/'

	initialize: ->
		@isParsed = false

	parse: (o) ->
		console.log('parse',o,@isParsed)
		return if @isParsed || !o.channel
		@isParsed = true

		@attributes.blocks = new Blocks() unless @attributes.blocks

		i = -1
		for c in o.channel.contents
			if c.object
				@attributes.blocks.add(c.object)
			else
				@attributes.blocks.add(c)

		@attributes.blocks.model = @ if @attributes.blocks
		super o.channel
