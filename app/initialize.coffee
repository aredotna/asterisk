# App Namespace
# Change `Hipster` to your app's name
@Browser ?= {}
Browser.Routers ?= {}
Browser.Views ?= {}
Browser.Models ?= {}
Browser.Collections ?= {}

@Channel = require 'models/channel'
@Block = require 'models/block'
@User = require 'models/user'

AppView = require 'views/app_view'
Router = require '../routers/app_router'

UpdateLoop = ->
	TWEEN.update()
	requestAnimationFrame(UpdateLoop)
	null

$ ->
	# Load App Helpers
	require '../lib/app_helpers'

	console.log("@",@,Browser)
	Browser.router = new Router()
	Backbone.history.start() #pushState: yes
	UpdateLoop()
	@

