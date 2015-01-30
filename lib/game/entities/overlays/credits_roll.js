/**
* credits_roll.js
* ----
* Entity used for displaying contents for the credits screen.
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

        maxY: -1,

        draw: function() {
            this.parent();

            var x1 = this.pos.x + 120, // column 1 x-position
                x2 = this.pos.x + 360, // column 2 x-position
                dy = 60, // column y-position delta
                y1 = 0, // column 1 y-position iteration index
                y2 = 0; // column 2 y-position iteration index

            this.font.draw('Project Lead', x1, this.pos.y + dy * y1++, ig.Font.ALIGN.LEFT);
            this.font.draw('_____', x2, this.pos.y + dy * y2++, ig.Font.ALIGN.LEFT);
            this.font.draw('_____', x2, this.pos.y + dy * y2++, ig.Font.ALIGN.LEFT);

            y1 = y2;
            this.font.draw('Lead Developers', x1, this.pos.y + dy * y1++, ig.Font.ALIGN.LEFT);
            this.font.draw('_____', x2, this.pos.y + dy * y2++, ig.Font.ALIGN.LEFT);
            this.font.draw('_____', x2, this.pos.y + dy * y2++, ig.Font.ALIGN.LEFT);

            y1 = y2;
            this.font.draw('Developers', x1, this.pos.y + dy * y1++, ig.Font.ALIGN.LEFT);
            this.font.draw('_____', x2, this.pos.y + dy * y2++, ig.Font.ALIGN.LEFT);
            this.font.draw('_____', x2, this.pos.y + dy * y2++, ig.Font.ALIGN.LEFT);

            y1 = y2;
            this.font.draw('Artwork', x1, this.pos.y + dy * y1++, ig.Font.ALIGN.LEFT);
            this.font.draw('_____', x2, this.pos.y + dy * y2++, ig.Font.ALIGN.LEFT);

            y1 = y2;
            this.font.draw('Music', x1, this.pos.y + dy * y1++, ig.Font.ALIGN.LEFT);
            this.font.draw('_____', x2, this.pos.y + dy * y2++, ig.Font.ALIGN.LEFT);

            y1 = y2;
            this.font.draw('Graphics Editing', x1, this.pos.y + dy * y1++, ig.Font.ALIGN.LEFT);
            this.font.draw('_____', x2, this.pos.y + dy * y2++, ig.Font.ALIGN.LEFT);

            y1 = y2;
            this.font.draw('Special Thanks', x1, this.pos.y + dy * y1++, ig.Font.ALIGN.LEFT);
            this.font.draw('_____', x2, this.pos.y + dy * y2++, ig.Font.ALIGN.LEFT);
            this.font.draw('_____', x2, this.pos.y + dy * y2++, ig.Font.ALIGN.LEFT);

            if(this.maxY < 0) {
                this.maxY = dy * y2 + y2;
            }
        }
    });
});
