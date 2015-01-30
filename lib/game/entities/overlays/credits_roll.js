/**
* credits_roll.js
* ----
* Entity used for display contents for the credits screen.
*
*/

ig.module(
    'game.entities.overlays.credits_roll'
)
.requires(
    'impact.entity',
    'impact.font',
    'plugins.font-sugar.font'
)
.defines(function() {
    'use strict';

    ig.global.EntityCredits_roll = ig.Entity.extend({
        font: new ig.Font('media/04b03_20.font.png', { fontColor: '#FFFFFF' }),

        init: function(x, y, settings) {
            this.parent(x, y, settings);

            this.size.x = ig.system.width;
            this.size.y = ig.system.height;
        },

        update: function() {
            this.parent();
        },

        draw: function() {
            this.parent();

            var x1 = this.pos.x + 150, // column 1 x-position
                x2 = this.pos.x + 400, // column 2 x-position
                dy = 40, // column y-position delta
                y1 = 0, // column 1 y-position iteration index
                y2 = 0; // column 2 y-position iteration index

            this.font.draw('_____', x1, this.pos.y + dy * y1++, ig.Font.ALIGN.LEFT);
            this.font.draw('_____', x1, this.pos.y + dy * y1++, ig.Font.ALIGN.LEFT);
            this.font.draw('_____', x1, this.pos.y + dy * y1++, ig.Font.ALIGN.LEFT);
            this.font.draw('_____', x1, this.pos.y + dy * y1++, ig.Font.ALIGN.LEFT);
            this.font.draw('_____', x1, this.pos.y + dy * y1++, ig.Font.ALIGN.LEFT);
            this.font.draw('_____', x1, this.pos.y + dy * y1++, ig.Font.ALIGN.LEFT);

            this.font.draw('_____', x2, this.pos.y + dy * y2++, ig.Font.ALIGN.RIGHT);
            this.font.draw('_____', x2, this.pos.y + dy * y2++, ig.Font.ALIGN.RIGHT);
            this.font.draw('_____', x2, this.pos.y + dy * y2++, ig.Font.ALIGN.RIGHT);
            this.font.draw('_____', x2, this.pos.y + dy * y2++, ig.Font.ALIGN.RIGHT);
            this.font.draw('_____', x2, this.pos.y + dy * y2++, ig.Font.ALIGN.RIGHT);
            this.font.draw('_____', x2, this.pos.y + dy * y2++, ig.Font.ALIGN.RIGHT);
        }
    });
});
