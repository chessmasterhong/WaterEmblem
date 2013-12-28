/*******************************************************************************
  ScreenFader Plugin
  -----
  Original Author: Jesse Oliveira (jmo84)
  Original Source: https://github.com/jmo84/ScreenFader--A-screen-fading-plugin-for-ImpactJS

  Make your game screen fade to black (or any other color you choose) with this
  simple yet versatile screen fading plugin.

  Official Page:
  http://impactjs.com/forums/code/screenfader-a-screen-fading-plugin
*******************************************************************************/

ig.module(
    'plugins.screen-fader.screen-fader'
)
.requires(
    'impact.timer',
    'impact.animation'
)
.defines(function() {
    ig.ScreenFader = ig.Class.extend({
        defaultOptions: {
            color: { r: 0, g: 0, b: 0, a: 1 },
            fade: 'in',
            speed: 1,
            screenWidth: 0,
            screenHeight: 0,
            waitUntilLoaded: true,
            visible: true
        },

        init: function(options) {
            this._setOptions(options);

            var isFadingIn = this.options.fade != 'out';
            this._alpha = isFadingIn ? 0 : 1; // set the initial alpha value
            this._alphaChange = isFadingIn ? 1 : -1;  // set the direction in which alpha changes each frame

            // check if an image is defined. It will be "tiled" across the screen
            if (this.options.tileImagePath) {
                if (isNaN(this.options.tileWidth)) {
                    throw new Error("ScreenFader option for tileWidth is invalid");
                } else if (isNaN(this.options.tileHeight)) {
                    throw new Error("ScreenFader option for tileHeight is invalid");
                }

                // Create a 1 cell animation of the tile image, using width and height
                this._sheet = new ig.AnimationSheet(this.options.tileImagePath, this.options.tileWidth, this.options.tileHeight);
                this._anim = new ig.Animation(this._sheet, 1.0, [0]); // Use a 1 cell animation
                this._anim.alpha = this._alpha; // set the initial alpha of the animation
            }

            if (!isNaN(this.options.delayBefore)) {
                var delayTime = this.options.delayBefore <= 0 ? 0 : this.options.delayBefore;
                if (delayTime > 0) {
                    this.timerDelayBefore = new ig.Timer(delayTime);
                }
            }
        },

        draw: function() {
            if (this.timerDelayAfter && this.timerDelayAfter.delta() > 0) {
                delete this.timerDelayAfter;
                this._callUserCallback();
            }

            if (this.timerDelayBefore) {
                if (this.timerDelayBefore.delta() < 0) {
                    return;
                } else {
                    delete this.timerDelayBefore;
                }
            }

            if (!this.options.visible) {
                return;
            }

            if (!this.isFinished && (!this._sheet || (this._sheet.image.loaded || !this.options.waitUntilLoaded))) {
                this._fadeAlphaValue();
            }

            if (this._alpha <= 0) {
                return;
            }

            if (this._anim) {
                this.drawImageTiledOnScreen();
            } else {
                this.drawColorOnScreen();
            }

        },

        drawImageTiledOnScreen: function() {
            var tileX = 0, tileY = 0, totalWidth = this.options.screenWidth, totalHeight = this.options.screenHeight;
            var tileWidth = this.options.tileWidth, tileHeight = this.options.tileHeight;

            while (tileY < totalHeight) {
                tileX = 0;
                while (tileX < totalWidth) {
                    this._anim.draw(tileX, tileY);
                    tileX += tileWidth;
                }

                tileY += tileHeight;
            }
        },

        drawColorOnScreen: function() {
            ig.system.clear(this.getColorCssValue());
        },

        getColorCssValue: function(rgbaObject) {
            var color = rgbaObject || this.options.color;
            var a = ((typeof color.a != 'undefined') ? color.a : 1) * this._alpha;
            if (a < 0) {
                a = 0;
            } else if (a > 1) {
                a = 1;
            }
            return 'rgba(' + color.r + ',' + color.g + ',' + color.b + ',' + a + ')';
        },

        finish: function() {
            if (this.isFinished) {
                return;
            }

            if (this._alphaChange > 0) {
                this._alpha = 1;
            } else {
                this._alpha = 0;
            }

            if (this._anim) {
                this._anim.alpha = this._alpha;
            }

            this.isFinished = true;

            if (typeof this.options.callback == 'function') {
                var delayTime = isNaN(this.options.delayAfter) ? 0 : this.options.delayAfter;
                if (delayTime > 0) {
                    this.timerDelayAfter = new ig.Timer(delayTime);
                } else {
                    this._callUserCallback();
                }
            }

        },

        _callUserCallback: function() {
            this.options.callback.call(this.options.context || (ig.ScreenFader.globalGameIsContext ? ig.game : this));
        },

        _fadeAlphaValue: function() {
            this._alpha += (this._alphaChange * this.options.speed * ig.system.tick * ig.ScreenFader.globalSpeedFactor);

            if ((this._alphaChange > 0 && this._alpha >= 1) || (this._alphaChange < 0 && this._alpha <= 0) ) {
                this.finish();
            }

            if (this._anim) {
                this._anim.alpha = this._alpha;
            }
        },

        _setOptions: function(userOptions) {
            this.options = ig.copy(this.defaultOptions);

            if (isNaN(this.options.screenWidth) || this.options.screenWidth <= 0) {
                this.options.screenWidth = ig.system.width;
            }

            if (isNaN(this.options.screenHeight) || this.options.screenHeight <= 0) {
                this.options.screenHeight = ig.system.height;
            }

            if (userOptions) {
                ig.merge(this.options, userOptions);
            }
        },
    });

    ig.ScreenFader.globalSpeedFactor = 2 / 3;
    ig.ScreenFader.globalGameIsContext = true;
});
