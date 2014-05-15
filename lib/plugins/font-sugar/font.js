/*
 * @author   Jonathan Commins
 * @email    joncom@gmail.com
 * @url      https://github.com/Joncom/impact-font-sugar/
 */
ig.module('plugins.font-sugar.font')
.requires('impact.font')
.defines(function() {

    "use strict";

    ig.Font.inject({

        fontColor: null,
        borderColor: null,
        borderSize: 1,
        fillCorners: false, // When false, creates a decent "slim" look, but only when borderSize is 1.
        letterSpacing: -2,

        fontCanvas: null,
        borderCanvas: null,
        lineCanvas: null,

        reversionCanvas: null,
        alternateFont: null,

        staticInstantiate: function(path, settings) {
            // Load in settings, regardless of whether or not we are going to use this object or reference
            // an existing one, because these settings have an impact on the generation of the path.
            if(typeof settings === 'object') ig.merge(this, settings);
            // Check if the path already exists in cache.
            return this.parent(this._getNewPath(path));
        },

        init: function(path) {
            // Load path which was not found in the cache.
            this.parent(this._getNewPath(path));
        },

        onload: function(event) {

            // Calculate metrics for the font.
            this.parent(event);

            // Remove illegal sized character if present, which
            // is caused by image having an extra space at the end.
            if(this.widthMap[this.widthMap.length-1] === 0) {
                this.widthMap.pop();
                this.indices.pop();
            }

            if(this.fontColor || (this.borderColor && this.borderSize >= 1)) {
                // "this.data" must be a canvas so we can work with it.
                this._ensureDataIsCanvas();
            }

            if(this.fontColor) {
                var canvas = this.data;
                this._convertNonAlphaPixelsInCanvasToColor(canvas, this.fontColor);
            }

            if(this.borderColor && this.borderSize >= 1) {

                this.fontLayer = this._createFontLayer();
                this.borderLayer = this._createBorderLayer();
                this.lineLayer = this._createLineLayer();

                // Merge font, border and line into a single canvas.
                var canvas = ig.$new('canvas');
                canvas.width = this.borderLayer.data.width;
                canvas.height = this.borderLayer.data.height;
                var context = canvas.getContext('2d');
                context.drawImage(this.borderLayer.data, 0, 0);
                context.drawImage(this.lineLayer.data, 0, 0);
                context.drawImage(this.fontLayer.data, 0, 0);

                this.data = canvas;
            }

            this.reversionCanvas = this.data;
        },

        draw: function( text, x, y, align ) {
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

            var skipCount = 0;

            for( var i = 0; i < text.length; i++ ) {
                var c = text.charCodeAt(i);

                if(c === 91) { // Check for "["
                    var color = this.getColorAtStartOfString(text.substr(i+1));
                    if(color) {
                        var skip = ('[' + color + ' ').length;
                        this.setFontColor(color);
                        skipCount += skip;
                        i += skip - 1;
                        continue;
                    }
                }

                if(c === 93) { // Check for "]"
                    this.revertFontColor();
                    skipCount += (']').length;
                    continue;
                }

                x += this._drawChar( c - this.firstChar, x, y );
            }

            if( this.alpha !== 1 ) {
                ig.system.context.globalAlpha = 1;
            }
            ig.Image.drawCount += text.length - skipCount;
        },

        getBasePath: function() {
            var stop = this.path.indexOf('?');
            var path = (stop === -1 ? this.path : this.path.substr(0, stop));
            return path;
        },

        setFontColor: function(color) {
            var path = this.getBasePath();
            var settings = { fontColor: color };
            if(this.borderSize) settings.borderSize = this.borderSize;
            if(this.borderColor) settings.borderColor = this.borderColor;
            this.alternateFont = new ig.Font(path, settings);
            this.data = this.alternateFont.data;
        },

        revertFontColor: function() {
            this.data = this.reversionCanvas;
        },

        getColorAtStartOfString: function(string) {
            var regExp = /#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})/;
            var match = string.match(regExp);
            if(match && match.index === 0) {
                var color = match[0];
                return color;
            } else {
                return null;
            }
        },

        _widthForLine: function(text) {
            var width = 0;
            for (var i = 0; i < text.length; i++) {
                var c = text.charCodeAt(i);
                if(c === 91) { // Check for "["
                    var subText = text.substr(i+1);
                    var color = this.getColorAtStartOfString(subText);
                    if(color) {
                        var skip = ('[' + color + ' ').length;
                        i += skip - 1;
                        continue;
                    }
                }
                if(c === 93) { // Check for "]"
                    continue;
                }
                width += this.widthMap[c - this.firstChar] + this.letterSpacing;
            }
            return width;
        },

        _addSpaceForBorders: function() {
            var canvas = ig.$new('canvas');
            canvas.width = this._getNewFontWidth();
            canvas.height = this._getNewFontHeight();

            var newContext = canvas.getContext('2d');
            var oldContext = this.data.getContext('2d');

            // Loop through every character in the original font.
            for (var c = 0; c < this.widthMap.length; c++) {
                var x = this.indices[c] * ig.system.scale;
                var y = 0;
                var width = this.widthMap[c] * ig.system.scale;
                var height = (this.height - 2) * ig.system.scale; // -2 because bottom lines contain no font.
                var offsetX = ((c + 1) * this.borderSize * ig.system.scale) + (c * this.borderSize * ig.system.scale);
                var offsetY = this.borderSize * ig.system.scale;
                var charData = oldContext.getImageData(x, y, width, height);
                newContext.putImageData(charData, x + offsetX, y + offsetY);
            }
            this.data = canvas;
        },

        _rebuildMetrics: function() {
            // indices
            for(var i=0; i<this.indices.length; i++) {
                this.indices[i] += (i * this.borderSize * 2);
            }
            // widthMap
            for(var w=0; w<this.widthMap.length; w++) {
                this.widthMap[w] += (this.borderSize * 2);
            }
            this.width += (this.widthMap.length * this.borderSize * 2);
            this.height += (this.borderSize * 2);
        },

        _createFontLayer: function() {
            var path = this.getBasePath() +
                       '?layer=font' +
                       '&size=' + this.borderSize;
            if(this.fontColor) {
                path += '&color=' + this._makeHexSafe(this.fontColor);
            }
            if(ig.Image.cache[path]) {
                var image = ig.Image.cache[path];
                this.data = image.data;
                this._rebuildMetrics();
                return image;
            } else {
                this._addSpaceForBorders();
                this._rebuildMetrics();
                return new ig.ImageFromCanvas(path, this.data);
            }
        },

        _createLineLayer: function() {
            var path = this.getBasePath() + '?layer=line&size=' + this.borderSize;
            if(ig.Image.cache[path]) {
                return ig.Image.cache[path];
            }
            var canvas = ig.$new('canvas');
            canvas.width = this.data.width;
            canvas.height = this.data.height;
            var context = canvas.getContext('2d');
            var newData = context.getImageData(0, 0, canvas.width, canvas.height);

            // Loop through every character in the font.
            for (var c = 0; c < this.widthMap.length; c++) {
                var x = this.indices[c] * ig.system.scale;
                var y = 0;
                var width = this.widthMap[c] * ig.system.scale;
                var offsetX = ((c + 1) * this.borderSize * ig.system.scale) + (c * this.borderSize * ig.system.scale);
                var first = x + offsetX - (this.borderSize * ig.system.scale);
                var last = x + offsetX + width + (this.borderSize * ig.system.scale);
                for (var i = first; i < last; i++) {
                    newData.data[((newData.width * (newData.height - 1)) + i) * 4] = 255; // red
                    newData.data[((newData.width * (newData.height - 1)) + i) * 4 + 1] = 0; // green
                    newData.data[((newData.width * (newData.height - 1)) + i) * 4 + 2] = 0; // blue
                    newData.data[((newData.width * (newData.height - 1)) + i) * 4 + 3] = 255; // alpha
                }
            }

            context.putImageData(newData, 0, 0);

            var image = new ig.ImageFromCanvas(path, canvas);
            return image;
        },

        _createBorderLayer: function() {
            var path = this.getBasePath() +
                       '?layer=border&size=' + this.borderSize +
                       '&color=' + this._makeHexSafe(this.borderColor);
            if(ig.Image.cache[path]) {
                return ig.Image.cache[path];
            }
            var canvas = ig.$new('canvas');
            canvas.width = this.data.width;
            canvas.height = this.data.height;

            var newContext = canvas.getContext('2d');
            var oldContext = this.data.getContext('2d');

            var thickness = this.borderSize * ig.system.scale;

            for(var x = 1; x <= thickness; x++) {
                newContext.drawImage(oldContext.canvas, -x, 0);
                newContext.drawImage(oldContext.canvas, x, 0);
            }
            for(var y = 1; y <= thickness; y++) {
                newContext.drawImage(oldContext.canvas, 0, -y);
                newContext.drawImage(oldContext.canvas, 0, y);
            }
            if(this.fillCorners) {
                for(var y = 1; y <= thickness; y++) {
                    for(var x = 1; x <= thickness; x++) {
                        newContext.drawImage(oldContext.canvas, -x, y);
                        newContext.drawImage(oldContext.canvas, -x, -y);
                        newContext.drawImage(oldContext.canvas, x, y);
                        newContext.drawImage(oldContext.canvas, x, -y);
                    }
                }
            }

            this._convertNonAlphaPixelsInCanvasToColor(canvas, this.borderColor);

            var image = new ig.ImageFromCanvas(path, canvas);
            return image;
        },

        _ensureDataIsCanvas: function() {
            if(ig.system.scale === 1) {
                this.resize(ig.system.scale);
            }
        },

        _convertNonAlphaPixelsInCanvasToColor: function(canvas, color) {
            var context = canvas.getContext('2d');
            context.globalCompositeOperation = 'source-in';
            context.fillStyle = color;
            context.fillRect(0, 0, canvas.width, canvas.height);
        },

        // Create unique path based on border and font color, and border size.
        _getNewPath: function(path) {
            var newPath = path;
            if(this.fontColor) {
                newPath += '?color=' + this._makeHexSafe(this.fontColor);
            }
            if(this.borderColor && this.borderSize >= 1) {
                newPath += (!this.fontColor ? '?' : '&');
                newPath += 'border=' + this._makeHexSafe(this.borderColor) +
                           '&size=' + this.borderSize;
            }
            return newPath;
        },

        // Converts shorthand hexes into standard form and ensures a # prefix.
        _makeHexSafe: function(hex) {
            if(hex.charAt(0) === '#') hex = hex.substring(1); // Strip # prefix.
            if(hex.length === 3) hex = hex.charAt(0) + hex.charAt(0) + hex.charAt(1) + hex.charAt(1) + hex.charAt(2) + hex.charAt(2);
            hex = '#' + hex; // Add # prefix.
            return hex;
        },

        _getRGBFromHex: function(hex) {
            // Concern hex to standard form.
            hex = this._makeHexSafe(hex);
            // Trim '#'.
            if (hex.charAt(0) === '#') hex = hex.substring(1);
            // Get RGB values.
            var r = parseInt(hex.substring(0, 2), 16);
            var g = parseInt(hex.substring(2, 4), 16);
            var b = parseInt(hex.substring(4, 6), 16);
            return { r: r, g: g, b: b };
        },

        // Returns the new width after accounting for borders.
        _getNewFontWidth: function() {
            var widthFromBorders = this.widthMap.length * (this.borderSize * 2);
            var widthFromSpacing = (this.widthMap.length - 1);
            var widthFromFont = 0;
            for(var i=0; i<this.widthMap.length; i++) widthFromFont += this.widthMap[i];
            return (widthFromBorders + widthFromFont + widthFromSpacing) * ig.system.scale;
        },

        // Returns the new height after accounting for borders.
        _getNewFontHeight: function() {
            return (this.height + this.borderSize * 2) * ig.system.scale;
        }

    });

    ig.ImageFromCanvas = ig.Image.extend({
        init: function(path, canvas) {
            this.loaded = true;
            this.path = path;
            this.data = canvas;
            this.width = this.data.width / ig.system.scale;
            this.height = this.data.height / ig.system.scale;
            ig.Image.cache[this.path] = this;
        }
    });

});