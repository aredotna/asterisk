ChannelShow = require './channels/show_view'


module.exports = class AppView extends Backbone.View
	id: 'app'
	connectionCount: 0
	template: require './templates/index'
	offset:
		x: 0
		y: 0
	targetOffset:
		x: 0
		y: 0
	dragStart:
		x: 0
		y: 0
	velocity:
		x: 0
		y: 0
	
	velocityLoopId: 0
	velocitySlowLoopId: 0

	events:
		"mousedown" : "mouseDown"
		"mousemove" : "mouseMove"
		"mouseup" : "mouseUp"


	mouseDown: (e) ->
		document.onselectstart = () -> return false # hack to hide text selection in chrome
		return unless e.target.id == "app"
		@isDragging = true
		@dragStart =
			x: e.screenX
			y: e.screenY

		@velocity.x = 0
		@velocity.y = 0
		clearInterval @velocityLoopId
		clearInterval @velocitySlowLoopId
		@velocitySlowLoopId = setInterval @velocitySlowLoop, 1000 / 60
			
		$(window).mouseup @mouseUp
		@$el.addClass "grabbed"

	mouseUp: (e) =>
		document.onselectstart = () -> return true # hack to hide text selection in chrome
		return unless @isDragging
		@velocityLoopId = setInterval @velocityLoop, 1000 / 60
		@isDragging = false
		@$el.removeClass "grabbed"

	velocitySlowLoop: =>
		@velocity.x *= .95
		@velocity.y *= .95
		if @velocity.x  < .01 && @velocity.y < .01
			clearInterval @velocitySlowLoop

	velocityLoop: =>
		@offset.x += @velocity.x
		@offset.y += @velocity.y
		@moveOffset()
		if @velocity.x  < .01 && @velocity.y < .01
			clearInterval @velocityLoopId


	mouseMove: (e) ->
		return unless @isDragging
		p = 
			x: e.screenX
			y: e.screenY
		@offset.x += p.x - @dragStart.x
		@offset.y += p.y - @dragStart.y

		@velocity.x += 0.1 * (p.x - @dragStart.x)
		@velocity.y += 0.1 * (p.y - @dragStart.y)

		@moveOffset()
		@dragStart = p


	initialize: ->
		EventBus.addEventListener('center',@center)
		@

	center: (e) =>
		@targetOffset =
			x: e.target.x
			y: e.target.y

		p =
			x: -e.target.x
			y: -e.target.y
		
		new TWEEN.Tween(@offset).to(p,1000).onUpdate(@moveOffset).start()

	moveOffset: =>
		@$('#offset').css 'left', @offset.x
		@$('#offset').css 'top', @offset.y

	render:->
		@$el.html @template
		channel = @options.channel
		channel.set('isRoot',true)

		@rootView = new ChannelShow(model:channel)
		@rootView.position.z = @connectionCount += 1000
		@rootView.showRoot = true
		channel.fetch() unless channel.hasChanged()

		@$('#offset').append @rootView.render().el
		@

	addConnection: (slug) ->
		originalBlock = @options.channel.get('blocks').getBySlug(slug)
		model = new Channel id:slug
		model.originalBlock = originalBlock

		@connectionCount += 1000

		originalBlock.view.position.z += @connectionCount
		originalBlock.view.updateZ()
		originalBlock.view.showLoader()
		model.fetch
			success: () -> originalBlock.view.hideLoader()

		originalBlock.nestedModel = model
		view = new ChannelShow(model:model)
		model.view = view
		view.position.x = @targetOffset.x
		view.position.y = @targetOffset.y
		view.position.z = @connectionCount
		@$('#offset').append view.render().el

		@