module.exports = class ColorUtils

	@rgbToHsl: (r, g, b) ->
		r /= 255
		g /= 255
		b /= 255

		max = Math.max(r, g, b)
		min = Math.min(r, g, b)
		h = undefined
		s = undefined
		l = (max + min) / 2
		if max is min
			h = s = 0
		else
			d = max - min
			s = (if l > 0.5 then d / (2 - max - min) else d / (max + min))
			switch max
				when r
					h = (g - b) / d + (if g < b then 6 else 0)
				when g
					h = (b - r) / d + 2
				when b
					h = (r - g) / d + 4
			h /= 6
		[ h, s, l ]



	@hslToHex: (color) ->
		@rgbToHex(@hslToRgb(color[0],color[1],color[2]))

	@hsvToHex: (color) ->
		@rgbToHex(@hsvToRgb(color[0],color[1],color[2]))

	@componentToHex: (c) ->
		hex = c.toString(16)
		(if hex.length is 1 then "0" + hex else hex)

	@rgbToHex: (color) ->
		@componentToHex(Math.floor(color[0])) + @componentToHex(Math.floor(color[1])) + @componentToHex(Math.floor(color[2]))

	@hslToRgb: (h, s, l) ->

		r = undefined
		g = undefined
		b = undefined
		if s is 0
			r = g = b = l
		else
			hue2rgb = (p, q, t) ->
				t += 1  if t < 0
				t -= 1  if t > 1
				return p + (q - p) * 6 * t  if t < 1 / 6
				return q  if t < 1 / 2
				return p + (q - p) * (2 / 3 - t) * 6  if t < 2 / 3
				p
			q = (if l < 0.5 then l * (1 + s) else l + s - l * s)
			p = 2 * l - q
			r = hue2rgb(p, q, h + 1 / 3)
			g = hue2rgb(p, q, h)
			b = hue2rgb(p, q, h - 1 / 3)
		# [ r * 255, g * 255, b * 255 ]
		[r,g,b]

	@rgbToHsv: (r, g, b) ->
		r = r / 255
		g = g / 255
		b = b / 255

		max = Math.max(r, g, b)
		min = Math.min(r, g, b)
		h = undefined
		s = undefined
		v = max
		d = max - min
		s = (if max is 0 then 0 else d / max)
		if max is min
			h = 0
		else
			switch max
				when r
					h = (g - b) / d + (if g < b then 6 else 0)
				when g
					h = (b - r) / d + 2
				when b
					h = (r - g) / d + 4
			h /= 6
		[ h, s, v ]

	@hsvToRgb: (h, s, v) ->
		r = undefined
		g = undefined
		b = undefined
		i = Math.floor(h * 6)
		f = h * 6 - i
		p = v * (1 - s)
		q = v * (1 - f * s)
		t = v * (1 - (1 - f) * s)
		switch i % 6
			when 0
				r = v
				g = t
				b = p
			when 1
				r = q
				g = v
				b = p
			when 2
				r = p
				g = v
				b = t
			when 3
				r = p
				g = q
				b = v
			when 4
				r = t
				g = p
				b = v
			when 5
				r = v
				g = p
				b = q
		[ r * 255, g * 255, b * 255 ]