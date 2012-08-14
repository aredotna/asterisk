AppView = require '../views/app_view'
# Channel = require 'models/channel'

module.exports = class AppRouter extends Backbone.Router
	defaultChannel: 'semblance'

	routes:
		':slug' : "channel"
		'': "index"

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
		console.log('BOOO BOOO ',slug)
		return if slug == @current_channel
		@current_channel = slug

		console.log('rout index',slug)

		@model = new Channel id:slug
		@view = new AppView(channel:@model)
		@render @view.render().el
		@

	index: () =>
		@navigate(@defaultChannel,true)

	render: (el) ->
		$('#body').html el