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
	require '../lib/app_helpers'


	Browser.router = new Router()
	Backbone.history.start() #pushState: yes
	UpdateLoop()
	@

