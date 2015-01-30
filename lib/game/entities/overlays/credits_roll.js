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

            var x0 = this.pos.x + ig.system.width / 2,
                x1 = x0 - 40, // column 1 x-position
                x2 = x0 + 40, // column 2 x-position
                dy = 50, // column y-position delta
                y = 0, // y-position iteration index
                s = 1; // section spacer index

            this.font.draw('Project Lead', x0, this.pos.y + dy * ++y, ig.Font.ALIGN.CENTER);
            this.font.draw('_____', x0, this.pos.y + dy * ++y, ig.Font.ALIGN.CENTER);
            this.font.draw('_____', x0, this.pos.y + dy * ++y, ig.Font.ALIGN.CENTER);

            y += s;
            this.font.draw('Lead Programmer', x0, this.pos.y + dy * ++y, ig.Font.ALIGN.CENTER);
            this.font.draw('_____', x0, this.pos.y + dy * ++y, ig.Font.ALIGN.CENTER);
            this.font.draw('_____', x0, this.pos.y + dy * ++y, ig.Font.ALIGN.CENTER);

            y += s;
            this.font.draw('Programmer', x0, this.pos.y + dy * ++y, ig.Font.ALIGN.CENTER);
            this.font.draw('_____', x0, this.pos.y + dy * ++y, ig.Font.ALIGN.CENTER);
            this.font.draw('_____', x0, this.pos.y + dy * ++y, ig.Font.ALIGN.CENTER);

            y += s;
            this.font.draw('Artwork', x0, this.pos.y + dy * ++y, ig.Font.ALIGN.CENTER);
            this.font.draw('_____', x1, this.pos.y + dy * ++y, ig.Font.ALIGN.RIGHT);
            this.font.draw('_____', x2, this.pos.y + dy * y, ig.Font.ALIGN.LEFT);

            y += s;
            this.font.draw('Music', x0, this.pos.y + dy * ++y, ig.Font.ALIGN.CENTER);
            this.font.draw('_____', x1, this.pos.y + dy * ++y, ig.Font.ALIGN.RIGHT);
            this.font.draw('_____', x2, this.pos.y + dy * y, ig.Font.ALIGN.LEFT);

            y += s;
            this.font.draw('Graphics Editing', x0, this.pos.y + dy * ++y, ig.Font.ALIGN.CENTER);
            this.font.draw('_____', x0, this.pos.y + dy * ++y, ig.Font.ALIGN.CENTER);

            y += s;
            this.font.draw('Special Thanks', x0, this.pos.y + dy * ++y, ig.Font.ALIGN.CENTER);
            this.font.draw('_____', x0, this.pos.y + dy * ++y, ig.Font.ALIGN.CENTER);
            this.font.draw('_____', x0, this.pos.y + dy * ++y, ig.Font.ALIGN.CENTER);

            if(this.maxY < 0) {
                this.maxY = dy * y + y;
            }
        }
    });
});
