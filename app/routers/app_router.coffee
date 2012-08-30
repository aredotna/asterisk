AppView = require '../views/app_view'
MacroView = require '../views/physics/macro_view'
# Channel = require 'models/channel'

module.exports = class AppRouter extends Backbone.Router
	defaultChannel: 'semblance'

	routes:
		# ':slug' : "channel"
		':slug' : 'macro'
		'': "index"
		# '' : 'macro'

	route: (route, name, cb) ->
		console.log('route yo ',route,name)
		super route, name, cb
		# EventBus.removeEventListener 'displayChange'

	connect: (uri) ->
		ar = uri.split('/')

		channelSlug = ar[0]
		connectionSlug = ar[1]

		@view.addConnection(connectionSlug)

	channel: (slug) ->
		return if slug == @current_channel
		@current_channel = slug

		@model = new Channel id:slug
		@view = new AppView(channel:@model)
		@render @view.render().el
		@

	macro: (slug) =>
		return if slug == @current_channel
		@current_channel = slug
		@model = new Channel id:slug
		@view = new MacroView(channel:@model)

		@render @view.el
		@view.render()

	index: =>
		# @navigate(@defaultChannel,true)
		@macro(@defaultChannel)

	render: (el) ->
		$('#body').html el