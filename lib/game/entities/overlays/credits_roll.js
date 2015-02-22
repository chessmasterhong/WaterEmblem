/**
* credits_roll.js
* ----
* Entity used for displaying contents for the credits screen.
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
        fontTitle:     new ig.Font('media/fonts/verdana_36b.font.png', { fontColor: '#E5E5E5' }),
        fontSection:   new ig.Font('media/fonts/verdana_20.font.png',  { fontColor: '#BBFFBB' }),
        fontContent16: new ig.Font('media/fonts/verdana_18.font.png',  { fontColor: '#E5E5E5' }),
        fontContent20: new ig.Font('media/fonts/verdana_20.font.png',  { fontColor: '#E5E5E5' }),

        maxY: -1, // maximum container size

        dx: 25, // x-position delta from center column to left or right columns
        dy: 35, // column y-position delta
        s : 2,  // section spacer index

        init: function(x, y, settings) {
            this.parent(x, y, settings);

            this.x0 = this.pos.x + ig.system.width / 2; // center column x-position
            this.xL = this.x0 - this.dx; // left column x-position
            this.xR = this.x0 + this.dx; // right column x-position
        },

        draw: function() {
            this.parent();

            var y = 0; // y-position iteration index

            this.fontTitle.draw('Fire Emblem',             this.x0, this.pos.y + this.dy * ++y, ig.Font.ALIGN.CENTER);
            y += y * 0.8;
            this.fontTitle.draw('Chronicles of the Abyss', this.x0, this.pos.y + this.dy * ++y, ig.Font.ALIGN.CENTER);

            y += this.s * 7.5;
            this.fontSection.draw('Project Lead',    this.x0, this.pos.y + this.dy * ++y, ig.Font.ALIGN.CENTER);
            this.fontContent20.draw('Kevin Chan',    this.x0, this.pos.y + this.dy * ++y, ig.Font.ALIGN.CENTER); // 1
            this.fontContent20.draw('David Leonard', this.x0, this.pos.y + this.dy * ++y, ig.Font.ALIGN.CENTER); // 2

            y += this.s;
            this.fontSection.draw('Project Architect', this.x0, this.pos.y + this.dy * ++y, ig.Font.ALIGN.CENTER);
            this.fontContent20.draw('Kevin Chan',      this.x0, this.pos.y + this.dy * ++y, ig.Font.ALIGN.CENTER); // 1

            y += this.s;
            this.fontSection.draw('Technical Lead',  this.x0, this.pos.y + this.dy * ++y, ig.Font.ALIGN.CENTER);
            this.fontContent20.draw('Kevin Chan',    this.x0, this.pos.y + this.dy * ++y, ig.Font.ALIGN.CENTER); // 1
            this.fontContent20.draw('David Leonard', this.x0, this.pos.y + this.dy * ++y, ig.Font.ALIGN.CENTER); // 2

            y += this.s;
            this.fontSection.draw('Programming',         this.x0, this.pos.y + this.dy * ++y, ig.Font.ALIGN.CENTER);
            this.fontContent20.draw('Kevin Chan',        this.x0, this.pos.y + this.dy * ++y, ig.Font.ALIGN.CENTER); // 1
            this.fontContent20.draw('David Leonard',     this.x0, this.pos.y + this.dy * ++y, ig.Font.ALIGN.CENTER); // 2
            this.fontContent20.draw('Wan Kim Mok',       this.x0, this.pos.y + this.dy * ++y, ig.Font.ALIGN.CENTER); // 3
            this.fontContent20.draw('Jeremy Neiman',     this.x0, this.pos.y + this.dy * ++y, ig.Font.ALIGN.CENTER); // 4
            this.fontContent20.draw('Christopher Zhang', this.x0, this.pos.y + this.dy * ++y, ig.Font.ALIGN.CENTER); // 5

            y += this.s;
            this.fontSection.draw('Artwork',            this.x0, this.pos.y + this.dy * ++y, ig.Font.ALIGN.CENTER);
            this.fontContent20.draw('Title Screen',     this.xL, this.pos.y + this.dy * ++y, ig.Font.ALIGN.RIGHT ); // 1
            this.fontContent20.draw('Enan Rahman',      this.xR, this.pos.y + this.dy *   y, ig.Font.ALIGN.LEFT  );
            this.fontContent20.draw('Game Over Screen', this.xL, this.pos.y + this.dy * ++y, ig.Font.ALIGN.RIGHT ); // 2
            this.fontContent20.draw('Enan Rahman',      this.xR, this.pos.y + this.dy *   y, ig.Font.ALIGN.LEFT  );

            y += this.s;
            this.fontSection.draw('Music',                        this.x0, this.pos.y + this.dy * ++y, ig.Font.ALIGN.CENTER);
            this.fontContent20.draw('"Companions"',               this.xL, this.pos.y + this.dy * ++y, ig.Font.ALIGN.RIGHT ); // 1
            this.fontContent20.draw('Christopher Zhang',          this.xR, this.pos.y + this.dy *   y, ig.Font.ALIGN.LEFT  );
            this.fontContent20.draw('"Strange Encounter"',        this.xL, this.pos.y + this.dy * ++y, ig.Font.ALIGN.RIGHT ); // 2
            this.fontContent20.draw('AxemJinx',                   this.xR, this.pos.y + this.dy *   y, ig.Font.ALIGN.LEFT  );
            this.fontContent20.draw('"Wind Across Plains"',       this.xL, this.pos.y + this.dy * ++y, ig.Font.ALIGN.RIGHT ); // 3
            this.fontContent20.draw('AxemJinx',                   this.xR, this.pos.y + this.dy *   y, ig.Font.ALIGN.LEFT  );
            this.fontContent20.draw('"Awakening"',                this.xL, this.pos.y + this.dy * ++y, ig.Font.ALIGN.RIGHT ); // 4
            this.fontContent20.draw('CrispyYoshi',                this.xR, this.pos.y + this.dy *   y, ig.Font.ALIGN.LEFT  );
            this.fontContent20.draw('"Battle for Whose Sake"',    this.xL, this.pos.y + this.dy * ++y, ig.Font.ALIGN.RIGHT ); // 5
            this.fontContent20.draw('CrispyYoshi',                this.xR, this.pos.y + this.dy *   y, ig.Font.ALIGN.LEFT  );
            this.fontContent20.draw('"Augustine Army"',           this.xL, this.pos.y + this.dy * ++y, ig.Font.ALIGN.RIGHT ); // 6
            this.fontContent20.draw('Gamma V',                    this.xR, this.pos.y + this.dy *   y, ig.Font.ALIGN.LEFT  );
            this.fontContent20.draw('"Inescapable Fate"',         this.xL, this.pos.y + this.dy * ++y, ig.Font.ALIGN.RIGHT ); // 7
            this.fontContent20.draw('Gamma V',                    this.xR, this.pos.y + this.dy *   y, ig.Font.ALIGN.LEFT  );
            this.fontContent20.draw('"Light and Darkness"',       this.xL, this.pos.y + this.dy * ++y, ig.Font.ALIGN.RIGHT ); // 8
            this.fontContent20.draw('Gamma V',                    this.xR, this.pos.y + this.dy *   y, ig.Font.ALIGN.LEFT  );
            this.fontContent20.draw('"Everything Into the Dark"', this.xL, this.pos.y + this.dy * ++y, ig.Font.ALIGN.RIGHT ); // 9
            this.fontContent20.draw('Jimmy52905',                 this.xR, this.pos.y + this.dy *   y, ig.Font.ALIGN.LEFT  );
            this.fontContent20.draw('"Rise Above"',               this.xL, this.pos.y + this.dy * ++y, ig.Font.ALIGN.RIGHT ); // 10
            this.fontContent20.draw('Jimmy52905',                 this.xR, this.pos.y + this.dy *   y, ig.Font.ALIGN.LEFT  );
            this.fontContent20.draw('"Rise To the Challenge"',    this.xL, this.pos.y + this.dy * ++y, ig.Font.ALIGN.RIGHT ); // 11
            this.fontContent20.draw('swordjosh7',                 this.xR, this.pos.y + this.dy *   y, ig.Font.ALIGN.LEFT  );
            this.fontContent20.draw('"Land of Promise"',          this.xL, this.pos.y + this.dy * ++y, ig.Font.ALIGN.RIGHT ); // 12
            this.fontContent20.draw('0rangaStang',                this.xR, this.pos.y + this.dy *   y, ig.Font.ALIGN.LEFT  );

            y += this.s;
            this.fontSection.draw('Level Design',    this.x0, this.pos.y + this.dy * ++y, ig.Font.ALIGN.CENTER);
            this.fontContent20.draw('David Leonard', this.x0, this.pos.y + this.dy * ++y, ig.Font.ALIGN.CENTER); // 1

            y += this.s;
            this.fontSection.draw('Graphics Editing', this.x0, this.pos.y + this.dy * ++y, ig.Font.ALIGN.CENTER);
            this.fontContent20.draw('David Leonard',  this.x0, this.pos.y + this.dy * ++y, ig.Font.ALIGN.CENTER); // 1
            this.fontContent20.draw('Wan Kim Mok',    this.x0, this.pos.y + this.dy * ++y, ig.Font.ALIGN.CENTER); // 1

            y += this.s;
            this.fontSection.draw('Audio Editing',   this.x0, this.pos.y + this.dy * ++y, ig.Font.ALIGN.CENTER);
            this.fontContent20.draw('David Leonard', this.x0, this.pos.y + this.dy * ++y, ig.Font.ALIGN.CENTER); // 1

            y += this.s;
            this.fontSection.draw('Special Thanks',                 this.x0, this.pos.y + this.dy * ++y, ig.Font.ALIGN.CENTER);
            this.fontContent20.draw('Dominic Szablewski',           this.x0, this.pos.y + this.dy * ++y, ig.Font.ALIGN.CENTER); // 1
            this.fontContent16.draw('for the ImpactJS Game Engine', this.x0, this.pos.y + this.dy * ++y, ig.Font.ALIGN.CENTER);
            y++;
            this.fontContent20.draw('The ImpactJS community',         this.x0, this.pos.y + this.dy * ++y, ig.Font.ALIGN.CENTER); // 2
            this.fontContent16.draw('for their invaluable resources', this.x0, this.pos.y + this.dy * ++y, ig.Font.ALIGN.CENTER);
            y++;
            this.fontContent20.draw('Nintendo and Intelligent Systems', this.x0, this.pos.y + this.dy * ++y, ig.Font.ALIGN.CENTER); // 3
            this.fontContent16.draw('for creating Fire Emblem',         this.x0, this.pos.y + this.dy * ++y, ig.Font.ALIGN.CENTER);

            y += this.s * 2;
            this.fontContent16.draw('Fire Emblem: Chronicles of the Abyss is a non-profit,',          this.x0, this.pos.y + this.dy * ++y, ig.Font.ALIGN.CENTER);
            this.fontContent16.draw('fan-made game created strictly for educational purposes and to', this.x0, this.pos.y + this.dy * ++y, ig.Font.ALIGN.CENTER);
            this.fontContent16.draw('push the boundaries of ImpactJS. All animations, map tiles,',    this.x0, this.pos.y + this.dy * ++y, ig.Font.ALIGN.CENTER);
            this.fontContent16.draw('characters, sound effects, and gameplay mechanics are property', this.x0, this.pos.y + this.dy * ++y, ig.Font.ALIGN.CENTER);
            this.fontContent16.draw('of both Nintendo and Intelligent Systems.',                      this.x0, this.pos.y + this.dy * ++y, ig.Font.ALIGN.CENTER);

            y += this.s * 7;
            this.fontContent20.draw('Thank you for playing!',                this.x0, this.pos.y + this.dy * ++y, ig.Font.ALIGN.CENTER);
            this.fontContent20.draw('We hope you enjoyed playing this game', this.x0, this.pos.y + this.dy * ++y, ig.Font.ALIGN.CENTER);
            this.fontContent20.draw('as much as it was for us to make it.',  this.x0, this.pos.y + this.dy * ++y, ig.Font.ALIGN.CENTER);

            if(this.maxY < 0) {
                this.maxY = this.dy * y - y * 2.75;
            }
        }
    });
});
