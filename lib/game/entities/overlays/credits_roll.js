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

        x0: -1, // center column x-position
        xL: -1, // left column x-position
        xR: -1, // right column x-position
        dx: 25, // x-position delta from center column to left or right columns
        dy: 30, // column y-position delta
        s: 4, // section spacer index

        init: function(x, y, settings) {
            this.parent(x, y, settings);

            this.x0 = this.pos.x + ig.system.width / 2;
            this.xL = this.x0 - this.dx;
            this.xR = this.x0 + this.dx;
        },

        draw: function() {
            this.parent();

            var y = 0; // y-position iteration index

            this.font.draw('Project Lead', this.x0, this.pos.y + this.dy * ++y, ig.Font.ALIGN.CENTER);
            this.font.draw('_____', this.x0, this.pos.y + this.dy * ++y, ig.Font.ALIGN.CENTER); // 1
            this.font.draw('_____', this.x0, this.pos.y + this.dy * ++y, ig.Font.ALIGN.CENTER); // 2

            y += this.s;
            this.font.draw('Lead Programmer', this.x0, this.pos.y + this.dy * ++y, ig.Font.ALIGN.CENTER);
            this.font.draw('_____', this.x0, this.pos.y + this.dy * ++y, ig.Font.ALIGN.CENTER); // 1
            this.font.draw('_____', this.x0, this.pos.y + this.dy * ++y, ig.Font.ALIGN.CENTER); // 1

            y += this.s;
            this.font.draw('Programmer', this.x0, this.pos.y + this.dy * ++y, ig.Font.ALIGN.CENTER);
            this.font.draw('_____', this.x0, this.pos.y + this.dy * ++y, ig.Font.ALIGN.CENTER); // 3
            this.font.draw('_____', this.x0, this.pos.y + this.dy * ++y, ig.Font.ALIGN.CENTER); // 4

            y += this.s;
            this.font.draw('Artwork', this.x0, this.pos.y + this.dy * ++y, ig.Font.ALIGN.CENTER);
            this.font.draw('_____', this.xL, this.pos.y + this.dy * ++y, ig.Font.ALIGN.RIGHT ); // 1
            this.font.draw('_____', this.xR, this.pos.y + this.dy *   y, ig.Font.ALIGN.LEFT  );
            this.font.draw('_____', this.xL, this.pos.y + this.dy * ++y, ig.Font.ALIGN.RIGHT ); // 2
            this.font.draw('_____', this.xR, this.pos.y + this.dy *   y, ig.Font.ALIGN.LEFT  );

            y += this.s;
            this.font.draw('Music', this.x0, this.pos.y + this.dy * ++y, ig.Font.ALIGN.CENTER);
            this.font.draw('_____', this.xL, this.pos.y + this.dy * ++y, ig.Font.ALIGN.RIGHT ); // 1
            this.font.draw('_____', this.xR, this.pos.y + this.dy *   y, ig.Font.ALIGN.LEFT  );
            this.font.draw('_____', this.xL, this.pos.y + this.dy * ++y, ig.Font.ALIGN.RIGHT ); // 2
            this.font.draw('_____', this.xR, this.pos.y + this.dy *   y, ig.Font.ALIGN.LEFT  );
            this.font.draw('_____', this.xL, this.pos.y + this.dy * ++y, ig.Font.ALIGN.RIGHT ); // 3
            this.font.draw('_____', this.xR, this.pos.y + this.dy *   y, ig.Font.ALIGN.LEFT  );

            y += this.s;
            this.font.draw('Graphics Editing', this.x0, this.pos.y + this.dy * ++y, ig.Font.ALIGN.CENTER);
            this.font.draw('_____', this.x0, this.pos.y + this.dy * ++y, ig.Font.ALIGN.CENTER); // 1

            y += this.s;
            this.font.draw('Special Thanks', this.x0, this.pos.y + this.dy * ++y, ig.Font.ALIGN.CENTER);
            this.font.draw('_____', this.x0, this.pos.y + this.dy * ++y, ig.Font.ALIGN.CENTER); // 1
            this.font.draw('_____', this.x0, this.pos.y + this.dy * ++y, ig.Font.ALIGN.CENTER); // 2

            if(this.maxY < 0) {
                this.maxY = this.dy * y + y;
            }
        }
    });
});
