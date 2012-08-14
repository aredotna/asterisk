BlockShow = require '../blocks/show_view'

module.exports = class ChannelsShow extends Backbone.View
	blocks: []
	position:
		x: 0
		y: 0
		z: 1000

	openChannel: (e) ->
		console.log('open channel', e)

	initialize: ->
		@model.bind 'reset', @render
		@model.bind 'change', @render
		@

	render: =>
		return @ unless @model.hasChanged()
		@$el.html ""

		blocks = @model.get('blocks')
		count = blocks.length
		i = 0
		rad = count * 10 + 200
		blocks.each (b) =>
			@add(b, i, count, rad)
			i+=1


		if @showRoot
			@add(@model,1,1,0)

		@

	close: ->
		blocks = @model.get('blocks')
		blocks.each (b) =>
			b.view.fadeOut()

	add: (m, i, count, rad) =>
		maxRandom = 20
		view = new BlockShow(model:m)
		angle =  Math.PI * 2 * i / count
		view.position =
			angle: angle
			x: @position.x + Math.cos(angle) * rad
			y: @position.y + Math.sin(angle) * rad
			radius: rad
			z: @position.z - i
			delay: i * 100
		view.startPosition = @position
		m.view = view
		@$el.append view.render().el