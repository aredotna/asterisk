(() ->
	# Tell Swag where to look for partials
	Swag.Config.partialsPath = '../views/templates/'

	# IIFE to avoid collisions with other variables
	(->
		# Make it safe to do console.log() always.
		console = window.console = window.console or {}
		method = undefined
		dummy = ->
		methods = ('assert,count,debug,dir,dirxml,error,exception,
				   group,groupCollapsed,groupEnd,info,log,markTimeline,
				   profile,profileEnd,time,timeEnd,trace,warn').split ','

		console[method] = console[method] or dummy while method = methods.pop()
	)()

	String.prototype.capitalize = () ->
		@replace /(^|\s)([a-z])/g , (m,p1,p2) -> p1+p2.toUpperCase() 

	String.prototype.clip = (n) ->
		@substr(0, n - 1) + (if @length > n then "&hellip;" else "")

	String.prototype.truncate = (count) ->
		len = 120
		count = 20 unless count

		ar = @split(' ')
		nar = []
		for a in ar
			nar.push a.clip(count)
		str = nar.join(' ')

		trunc = str
		if trunc.length > len
			trunc = trunc.substring(0, len)
			trunc = trunc.replace(/\w+$/, "")
			trunc += " ..."
		trunc

	# Extend Backbone Views
	Backbone.View::template = ->

	Backbone.View::getRenderData = ->
		@model?.toJSON()

	Backbone.View::render = ->
		console.debug "Rendering #{@constructor.name}", @
		@$el.html @template @getRenderData()
		@afterRender()
		@

	Backbone.View::afterRender = ->
		# console.debug "Rendered #{@constructor.name}", @

	# Put your handlebars.js helpers here.
)()
