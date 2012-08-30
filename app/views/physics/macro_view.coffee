WebGLView = require './webgl_view'
ColorUtils = require '/lib/colorutils'
QueueItem = require '/models/queue_item'

module.exports = class MacroView extends Backbone.View
	id: 'app'
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
	mouseX: 0
	mouseY: 0


	childMultiplier:5
	velocityLoopId: 0
	velocitySlowLoopId: 0

	events:
		"mousedown" : "mouseDown"
		"mousemove" : "mouseMove"
		"mouseup" : "mouseUp"

	mouseDown: (e) ->
		document.onselectstart = () -> return false # hack to hide text selection in chrome
		# return unless e.target.id == "app"
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
		@velocity.x *= .9
		@velocity.y *= .9
		if @velocity.x  < .01 && @velocity.y < .01
			clearInterval @velocitySlowLoop

	velocityLoop: =>
		@offset.x += @velocity.x * (1/@renderer.zoom)
		@offset.y += @velocity.y * (1/@renderer.zoom)
		@moveOffset()
		if @velocity.x  < .01 && @velocity.y < .01
			clearInterval @velocityLoopId


	mouseMove: (e) ->
		@cursorMove(e)
		return unless @isDragging
		p = 
			x: e.screenX
			y: e.screenY
		@offset.x += (p.x - @dragStart.x) * (1/@renderer.zoom)
		@offset.y += (p.y - @dragStart.y) * (1/@renderer.zoom)

		@velocity.x += 0.1 * (p.x - @dragStart.x)
		@velocity.y += 0.1 * (p.y - @dragStart.y)

		@moveOffset()
		@dragStart = p

	moveOffset: =>
		return null

	render: =>
		@setup()
		c = @options.channel
		c.set('isRoot',true)
		# c.bind 'reset', @setRoot
		c.bind 'change', @setRoot
		c.fetch() unless c.hasChanged()
		@

	setRoot: (channel) =>
		# console.log("set root",channel)
		centerParticle = @makeParticle(10)
		channel.particle = centerParticle
		center = @getCenter()
		centerParticle.moveTo center
		centerParticle.angleCount = 1
		centerParticle.level = 0
		centerParticle.angleOffset = 0.0
		@loadBlocks(channel)

	loadChannel: (channel) =>
		link = channel.linkParticle
		p = @makeParticle(10,null,link,rad)

		angleVary = (Math.PI * 2) * (1/link.angleCount)

		p.angleOffset = angleVary * (i / count) + offset
		p.angleOffset = link.angleOffset
		p.angleCount = link.angleCount
		rad = 100
		p.moveTo Vector.add(link.pos, new Vector(Math.cos(p.angleOffset) * rad,Math.sin(p.angleOffset) * rad))
		channel.particle = p
		@loadBlocks(channel)


	loadConnections: (block) =>
		count = block.get('connections').length
		particle = block.particle
		count = particle.angleCount

		nextLevel = particle.level + 1

		rad = block.get('connections').length * 3  + 50
		angleVary = (Math.PI * 2) * (1/particle.angleCount) 
		angleVary *= @childMultiplier if particle.angleCount > 1
		offset = particle.angleOffset
		# console.log('load connections',block,count,angleVary,offset)
		i = 0
		for c in block.get('connections')
			if c
				np = particle
				repeat = false
				while(np)
					if np.block && np.block.channel 
						if np.block.channel.get('slug') == c.slug
							repeat = true
					if np.linkParticle
						np = np.linkParticle
					else 
						np = null


				if !repeat && c.slug != block.channel.get('slug')
					channel = new Channel(id: c.slug)
					channel.linkParticle = particle
					colour = ColorUtils.hslToRgb(i / count,1, Math.max(.3,1 - (nextLevel / @maxLevels)))

					p = @makeParticle(5,c,colour,particle,rad)
					p.linkParticle = particle
					p.title = c.title
					p.slug = c.slug
					p.channel = channel
					p.angleOffset = angleVary * (i / count) + offset
					p.colour = ColorUtils.hslToRgb(i/count,1,.5)
					p.level = nextLevel
					p.angleCount = count
					p.moveTo Vector.add(block.particle.pos, new Vector(Math.cos(p.angleOffset) * rad,Math.sin(p.angleOffset) * rad))
					channel.particle = p
					channel.bind('change',@loadConnectionComplete)
					i+=1
					@addToQueue(channel)


	loadBlocks: (channel)=>
		count = channel.get('blocks').length
		particle = channel.particle
		particle.setRadius(count)
		rad = count * 3  + 50
		# rad = 100

		i = 0

		nextLevel = particle.level + 1

		angleVary = (Math.PI * 2) * (1/particle.angleCount)
		angleVary *= @childMultiplier if particle.angleCount > 1

		offset = particle.angleOffset
		offset -= angleVary / 2


		# console.log('load children',channel.get('slug'),count,angleVary,offset)
		channel.get('blocks').each (b) =>
			colour = ColorUtils.hslToRgb(i / count , 1, Math.max(.3,1 - (nextLevel / @maxLevels)) )
			p = @makeParticle(5,b,colour,particle,rad)
			p.linkParticle = particle			
			p.level = nextLevel
			p.title = b.get('title')
			p.slug = channel.get('slug')
			p.block = b
			b.channel = channel
			p.angleOffset = angleVary * (i / count) + offset
			p.angleCount = count + particle.angleCount
			p.moveTo Vector.add(channel.particle.pos, new Vector(Math.cos(p.angleOffset) * rad,Math.sin(p.angleOffset) * rad))
			b.particle = p
			@loadConnections(b) if b.get('connections')

			i+=1

	makeParticle: (radius,block,colour=null,centerParticle=null,spacing=50,stiffness=0.001) ->
		p = new Particle(radius)		
		p.colour = colour if colour

		# p.setBlock(block)
		# stiffness = 0
		
		p.setRadius(p.mass)
		# p.colour = [1,1,1]
		p.moveTo @getRandomPosition()
		# @collide.pool.push p
		# p.behaviours.push @collide
		# p.behaviours.push @bounds
		# p.bounds = @bounds
		# wander = new Wander 0.05, 100.0, 0.02
		# p.behaviours.push wander
		if centerParticle
			s = new Spring(centerParticle, p, spacing, stiffness)
			p.spring = s
			@physics.springs.push s
		@physics.particles.push p
		@renderer.addParticle(p)


		p


	# makeParticleLinks: (particle, block) ->
	# 	if block && block instanceof Block
	# 		particle.block = block
	# 		childCount = block.get('connections').length



	# 		for c in block.get('connections')
	# 			if c and c.slug != @options.channel.get('slug')
	# 				channel = new Channel(id: c.slug)
	# 				channel.linkParticle = p
	# 				p.childCount = childCount
	# 				channel.bind('change',@loadConnectionComplete)
	# 				channel.
	# 				@addToQueue(channel)

		



	############# QUEUE ####################################

	queue: []
	queueRunning: false
	queueCount: 0
	queueLimit: 500
	maxLevels: 10

	addToQueue: (o) =>
		return if @queueCount >= @queueLimit
		@queueCount +=1
		
		@queue.push(o)
		@queueStart()

	queueStart: =>
		return if @queueRunning
		@queueRunning = true
		@queueLoad()

	queueLoad: =>
		if @queue.length
			r = Math.floor(Math.random() * @queue.length * .5)
			o = @queue[r]
			@queue.splice(r,1)
			o.fetch()
		else
			@queueRunning = false

	loadConnectionComplete: (e) =>
		@loadBlocks(e)
		@queueLoad()

	############# HELPERS ####################################


	getRandomPosition: =>
		new Vector (Random @width), (Random @height)

	getCenter: =>
		new Vector @width/2 , @height/2


	############# RENDERER ####################################

	setup: =>
		return if @isSetup

		console.log('setup')
		@isSetup = true
		@physics = new Physics()
		@renderTime = 0
		@counter = 0
		@width = 640
		@height = 480
		# @width = $(@el).width()
		# @height = $(@el).height()
		@renderer = new WebGLView()
		@renderer.offset = @offset

		$(@el).html @renderer.domElement
		$(@el).append "<div id='label'></div>"
		$(@renderer.domElement).css("background","#000")


		@physics.integrator = new Verlet()

		min = new Vector 0.0, 0.0
		max = new Vector @width, @height
		@collide = new Collision(false)
		@bounds = new EdgeBounce min, max


		@renderer.init @physics

		@mouse = new Particle(5)
		@mouse.setRadius(5)
		@mouse.colour = [0,0,0]
		@mouse.fixed = true
		@physics.particles.push @mouse
		@renderer.addParticle(@mouse)

		$(window).resize @resize
		$(window).dblclick @dblClick
		$(window).mousewheel (e,d,dx,dy) =>
			e.preventDefault()
			tx = (@mouseX)  * (1 / @renderer.zoom)
			ty = (@mouseY) * (1 / @renderer.zoom)
			a = d * .1
			@renderer.zoom *= 1 + a
			@renderer.offset.x -= tx * a
			@renderer.offset.y -= ty * a

		
		@resize()


		# for i in [0..20]
		# 	@makeParticle(5)

		@update()

	dblClick: (e) =>
		window.open(@currentLink) if @currentLink

	cursorMove: (event) =>
		# null

		@mouseX = event.clientX
		@mouseY = event.clientY

		@mouse.pos.set (event.clientX * (1/ @renderer.zoom) - @offset.x ) , (event.clientY* (1/ @renderer.zoom) - @offset.y ) 
		x = @mouse.pos.x
		y = @mouse.pos.y

		d = new Vector()
		o = @mouse

		closestDist = 999
		closest = null

		for p in @physics.particles
			if o isnt p
				# if Math.abs(x - p.pos.x) + Math.abs(y - p.pos.y) < 10 #hacky efficient way to limit the loops
				(d.copy o.pos).sub p.pos
				distSq = d.magSq()
				radii = p.radius + o.radius
				if distSq <= radii * radii
					dist = Math.sqrt distSq
					# overlap = (p.radius + o.radius) - dist
					if dist < closestDist
						closest = p
						closestDist = dist
						# console.log('overlap',p,overlap,dist)

		if closest
			if closest.channel
				m = closest.channel
			else if closest.block
				m = closest.block	

			if m
				t = "Untitled"

				if p.title
					t = p.title

				@currentLink = "http://are.na/#/" + closest.slug
				t += " ( "+ @currentLink + " ) "

				np = closest
				while(np)
					if np.linkParticle
						t = t + "<br/>" + np.linkParticle.title
						np = np.linkParticle
					else 
						np = null

				# if closest.block
					# @currentLink = "http://are.na/#/" + closest.block.channel.get('slug')
				# else if closest.channel
				

				$('#label').html t
		else
			$('#label').html ""

		return null

	step: =>
		# @physics.step()

		if @renderer.gl?
			@renderer.render @physics 

	update: =>
		requestAnimationFrame(@update)
		@step()	

	resize: =>
		@width = $(window).width()
		@height = $(window).height()
		@bounds.max.x = @width
		@bounds.max.y = @height
		@renderer.setSize @width, @height if @renderer.gl?
		return null
