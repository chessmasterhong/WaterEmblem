/**
 *  Button Plugin
 *  -----
 *  A button entity for Impact.js.
 */

ig.module(
    'plugins.button.button'
)
.requires(
    'impact.entity',
    'impact.font',
    'plugins.font-sugar.font'
)
.defines(function() {
    ig.Button = ig.Entity.extend({
        size: {x: 100, y: 32},

        text: [],
        textPos: {x: 0, y: 0},
        textAlign: ig.Font.ALIGN.CENTER,

        // Begin custom edits --------------------------------------------------
        iconLeft: null,
        iconLeftPos: {x: 0, y: 0},

        textRight: [],
        textRightPos: {x: 0, y: 0},
        textRightAlign: ig.Font.ALIGN.RIGHT,
        // End custom edits ----------------------------------------------------

        font: new ig.Font('media/fonts/04b03_16.font.png', {
            fontColor: '#000000',
            letterSpacing: -1
        }),
        animSheet: new ig.AnimationSheet('media/gui/button.png', 100, 32),
        clickSFX: new ig.Sound('media/sounds/sfx/trimmedselect.*'),

        state: 'idle',

        _oldPressed: false,
        _startedIn: false,
        _actionName: 'leftClick',

        init: function(x, y, settings) {
            this.parent(x, y, settings);

            this.addAnim('idle', 1, [0]);
            this.addAnim('active', 0.10, [1]);
            this.addAnim('deactive', 0.10, [2]);

            // Begin custom edits ----------------------------------------------
            // Align all default button text to horizontal and vertical center for arbitrary button sizes
            this.textPos = {x: this.size.x / 2, y: this.size.y / 4};

            // Align all right button text flushed right and vertical center for arbitrary button sizes
            this.textRightPos = {x: this.size.x - 10, y: this.size.y / 4};

            // Align all left button icons flushed left and vertical center for arbitrary button sizes
            //if(this.iconLeft !== null)
                //this.iconLeftPos = {x: 10, y: (this.size.y - this.iconLeft.) / 2};

            // Clamp button to screen horizontally
            //if(this.pos.x + this.size.x > ig.game.screen.x + ig.system.width)
            //    this.pos.x = ig.game.screen.x + ig.system.width - this.size.x;

            // Clamp button to screen vertically
            //if(this.pos.y + this.size.y > ig.game.screen.y + ig.system.height)
            //    this.pos.y = ig.game.screen.y + ig.system.height - this.size.y;
            // End custom edits ------------------------------------------------

            if(this.text.length > 0 && this.font === null) {
                if(ig.game.buttonFont !== null)
                    this.font = ig.game.buttonFont;
                else
                    console.error('If you want to display text, you should provide a font for the button.');
            }
        },

        update: function() {
            if(this.state !== 'hidden') {
                var _clicked = ig.input.state(this._actionName);

                if(!this._oldPressed && _clicked && this._inButton()) {
                    this._startedIn = true;
                }

                if(this._startedIn && this.state !== 'deactive' && this._inButton()) {
                    if(_clicked && !this._oldPressed) { // down
                        this.setState('active');
                        this.pressedDown();
                    } else if(_clicked) { // pressed
                        this.setState('active');
                        this.pressed();
                    } else if(this._oldPressed) { // up
                        this.setState('idle');
                        this.pressedUp();
                    }
                } else if(this.state === 'active') {
                    this.setState('idle');
                }

                if(this._oldPressed && !_clicked) {
                    this._startedIn = false;
                }

                this._oldPressed = _clicked;
            }
        },

        draw: function() {
            if(this.state !== 'hidden') {
                this.parent();

                if(this.font !== null) {
                    for(var i = 0; i < this.text.length; i++) {
                        this.font.draw(
                            this.text[i],
                            this.pos.x + this.textPos.x - ig.game.screen.x,
                            this.pos.y + ((this.font.height + 2) * i) + this.textPos.y - ig.game.screen.y,
                            this.textAlign
                        );
                    }

                    // Begin custom edits --------------------------------------
                    if(this.iconLeft !== null) {
                        this.iconLeft.draw(
                            //this.pos.x + this.iconLeftPos.x - ig.game.screen.x,
                            //this.pos.y + this.iconLeftPos.y - ig.game.screen.y
                            this.pos.x + 10 - ig.game.screen.x,
                            this.pos.y + 8 - ig.game.screen.y
                        );
                    }

                    for(var i = 0; i < this.textRight.length; i++) {
                        this.font.draw(
                            this.textRight[i],
                            this.pos.x + this.textRightPos.x - ig.game.screen.x,
                            this.pos.y + ((this.font.height + 2) * i) + this.textRightPos.y - ig.game.screen.y,
                            this.textRightAlign
                        );
                    }
                    // End custom edits ----------------------------------------
                }
            }
        },

        setState: function(s) {
            this.state = s;
            if (this.state !== 'hidden') {
                this.currentAnim = this.anims[ this.state ];
            }
        },

        pressedDown: function() {},
        pressed: function() {            
            this.clickSFX.volume = 0.9;
            this.clickSFX.play();},
        pressedUp: function() {},

        _inButton: function() {
            return ig.input.mouse.x + ig.game.screen.x > this.pos.x &&
                   ig.input.mouse.x + ig.game.screen.x < this.pos.x + this.size.x &&
                   ig.input.mouse.y + ig.game.screen.y > this.pos.y &&
                   ig.input.mouse.y + ig.game.screen.y < this.pos.y + this.size.y;
        }
    });
});