/*

multi-color-font 0.0
https://github.com/docmarionum1/impact-multi-color-font

Jeremy Neiman 
jeremyneiman.com

The functions draw and _drawChar are almost exactly the same as 
Dominic Szablewski's original code in Impact's Font class.

*/

ig.module(
	'plugins.multi-color-font'
)
.requires(
	'impact.font'
)
.defines(function() {

ig.Font.inject({
	colors: {},
	defaultColor: null,
	
	init: function(path, colors) {
		colors = typeof colors !== 'undefined' ? colors : ["FFFFFF"];
		
		for (var i = 0; i < colors.length; i++) {
			this.colors[colors[i]] = null;
		}
		this.defaultColor = colors[0];
		this.parent(path);
	},
	
	onload: function( ev ) {
		this._loadMetrics( this.data );
		this._loadColors( this.data );
		this.parent( ev );
	},
	
	draw: function( text, x, y, align, color) {
		color = typeof color !== 'undefined' ? color : this.defaultColor;
		
		if( typeof(text) != 'string' ) {
			text = text.toString();
		}
		
		// Multiline?
		if( text.indexOf('\n') !== -1 ) {
			var lines = text.split( '\n' );
			var lineHeight = this.height + this.lineSpacing;
			for( var i = 0; i < lines.length; i++ ) {
				this.draw( lines[i], x, y + i * lineHeight, align );
			}
			return;
		}
		
		if( align == ig.Font.ALIGN.RIGHT || align == ig.Font.ALIGN.CENTER ) {
			var width = this._widthForLine( text );
			x -= align == ig.Font.ALIGN.CENTER ? width/2 : width;
		}
		

		if( this.alpha !== 1 ) {
			ig.system.context.globalAlpha = this.alpha;
		}

		for( var i = 0; i < text.length; i++ ) {
			var c = text.charCodeAt(i);
			x += this._drawChar( c - this.firstChar, x, y, color );
		}

		if( this.alpha !== 1 ) {
			ig.system.context.globalAlpha = 1;
		}
		ig.Image.drawCount += text.length;
	},	
	
	_drawChar: function( c, targetX, targetY, color ) {
		if( !this.loaded || c < 0 || c >= this.indices.length ) { return 0; }
		
		var scale = ig.system.scale;
		
		var charX = this.indices[c] * scale;
		var charY = 0;
		var charWidth = this.widthMap[c] * scale;
		var charHeight = (this.height-2) * scale;		
		
		ig.system.context.drawImage( 
			this.colors[color].data,
			charX, charY,
			charWidth, charHeight,
			ig.system.getDrawPos(targetX), ig.system.getDrawPos(targetY),
			charWidth, charHeight
		);
		
		return this.widthMap[c] + this.letterSpacing;
	},
	
	_loadColors: function(image) {
		var canvas = ig.$new('canvas');
		canvas.width = image.width;
		canvas.height = image.height;
		var ctx = canvas.getContext('2d');
		ctx.drawImage( image, 0, 0 );
		var px = ctx.getImageData(0, 0, canvas.width, canvas.height);
		
		for (var color in this.colors) {
			var r = parseInt(color.substring(0,2), 16);
			var g = parseInt(color.substring(2,4), 16);
			var b = parseInt(color.substring(4,6), 16);
			
			for (var i = 0; i < px.data.length; i += 4) {
				if (px.data[i+3] != 0) {
					px.data[i] = r;
					px.data[i+1] = g;
					px.data[i+2] = b;
				}
			}
			
			ctx.putImageData(px, 0, 0);
			this.colors[color] = new ig.Image(canvas.toDataURL());
		}
	}
});

});
