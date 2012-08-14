module.exports = class BlocksShow extends Backbone.View
	template: require "../templates/blocks/show"
	className: "block"
	position:
		x: 0
		y: 0
		z: 0
		angle: 0
		radius:0
		delay: 0
	startPosition:
		x:0
		y:0
	shadow:
		alpha:0
		maxAlpha:.2
	useAnimation: true

	events:
		"mouseenter .container" 		: "mouseEnter"
		"mouseleave .container" 		: "mouseLeave"
		"click a.channel" 				: "openChannel"


	openImage: (e) ->
		e.preventDefault()

	openChannel: (e) ->
		e.preventDefault()

		if @isOpen
			@close()
			return null

		@isOpen = true
		pos = @zoomIn () =>
			Browser.router.connect(channelJson.slug+'/'+e.target.dataset.slug)
		EventBus.dispatch("center", pos)
		channelJson = @model.collection.model.toJSON()
		
		return null

		target = $(e.target).parents('.block')
		console.log(target.offset())
		EventBus.dispatch("center",target.position())

	close: ->
		@isOpen = false
		@$el.animate
			'left': @position.x
			'top': @position.y

		EventBus.dispatch("center",@position)
		@model.nestedModel.view.close()
		@

	zoomIn: (onComplete) =>
		rad = 600
		p =
			x: @position.x + Math.cos(@position.angle) * rad
			y: @position.y + Math.sin(@position.angle) * rad

		@$el.animate
			'left': p.x
			'top': p.y
		,1000, onComplete
		return p


	mouseEnter: =>
		@$el.css 'z-index', 100001

	mouseLeave: =>
		@$el.css 'z-index', @position.z

	render: ->
		console.log(@model.toJSON())
		@$el.html @template( model: @model.toJSON() )

		console.log(@model.get('title').truncate()) if @model.get('title')

		@$('a.lightbox').lightBox()
		@updateZ()
		@animateIn()
		@animateShadow()
		@ 

	updateZ: =>
		@$el.css 'z-index', @position.z

	animateIn: ->
		@$el.css 'top', @startPosition.y
		@$el.css 'left', @startPosition.x

		if @useAnimation
			setTimeout () =>
				@$el.animate
					'top': @position.y
					'left': @position.x
				, 1000
			, @position.delay
		else
			@$el.css 'top', @position.y
			@$el.css 'left', @position.x

	animateShadow: ->
		shadowDiv = @$('.shadow')
		tween = new TWEEN.Tween( @shadow ).to({alpha:@shadow.maxAlpha},2000).delay(@position.delay).onUpdate( () =>
			shadowDiv.css 'box-shadow', '0 0 50px rgba(0,0,0,'+@shadow.alpha+')'
		).start()

	fadeOut: ->
		@$el.fadeOut()

	showLoader: ->
		@$('.loader').fadeIn()

	hideLoader: ->
		@$('.loader').fadeOut()
