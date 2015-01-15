/**
 *  @fileOverview Debug module for the Impact Atmospheric System Plugin.
 *  @author Kevin Chan {@link https://github.com/chessmasterhong|(chessmasterhong)}
 *  @license {@link https://github.com/chessmasterhong/impact-atmosphere/blob/master/LICENCE|MIT License}
 */


ig.module(
    'plugins.atmosphere.atmosphere-debug'
)
.requires(
    'plugins.atmosphere'
)
.defines(function() {
    'use strict';

    ig.Atmosphere.inject({

        debug: true,

        draw: function() {
            this.parent();

            if(this.debug) {
                var x = 0,
                    y = 0;

                ig.system.context.fillStyle = 'rgba(0, 0, 0, 0.25)';
                ig.system.context.fillRect(
                    x += 5,
                    y += 5,
                    ig.system.realWidth - 2 * x,
                    255
                );

                ig.system.context.font = '11px monospace';
                ig.system.context.textBaseline = 'top';
                ig.system.context.fillStyle = '#ffffff';

                ig.system.context.fillText('========== Impact Atmospheric System Plugin ==========', x += 5, y += 5);

                ig.system.context.fillText('Timescale: ' + this.timescale + 'x real time', x, y += 15);
                ig.system.context.fillText('Update rate: ' + this.update_rate + (this.update_rate <= 1 ? ' second' : ' seconds'), x, y += 10);

                ig.system.context.fillText('Geographical coordinates: (Lat: ' + this.geo_coords.latitude + ', Lng: ' + this.geo_coords.longitude + ')', x, y += 15);

                ig.system.context.fillStyle = '#ffff00';
                ig.system.context.fillText('Current: ' + this.convertJulianToGregorian(this.julianDate).toString() + ' | ' + this.julianDate.toFixed(8) + ' JD', x, y += 15);
                ig.system.context.fillText('Sun state: The sun ' + (
                    this.sun_state === 0 ? 'is rising' :
                    this.sun_state === 1 ? 'has risen' :
                    this.sun_state === 2 ? 'is setting' :
                    this.sun_state === 3 ? 'has set' :
                    '<invalid sun state>'
                ), x, y += 15);

                ig.system.context.fillText('Ambient illumination color: (r: ' + this.sky.r.toFixed(4) + ', g: ' + this.sky.g.toFixed(4) + ', b: ' + this.sky.b.toFixed(4) + ', a: ' + this.sky.a.toFixed(4) + ')', x, y += 15);

                ig.system.context.fillStyle = '#ffffff';
                ig.system.context.fillText('Sunrise: ' + this.convertJulianToGregorian(this.solar.sunrise.date).toString() + ' | ' + this.solar.sunrise.date.toFixed(8) + ' JD', x, y += 15);
                ig.system.context.fillText('Sunset : ' + this.convertJulianToGregorian(this.solar.sunset.date).toString() + ' | ' + this.solar.sunset.date.toFixed(8) + ' JD', x, y += 10);

                ig.system.context.fillText('Next sunriset update: ' + this.convertJulianToGregorian(this.solar.next_update).toString(), x, y += 15);

                ig.system.context.fillStyle = '#ffff00';
                ig.system.context.fillText('Season state: ' + (
                    this.season_state === 0 ? 'Spring/Vernal' :
                    this.season_state === 1 ? 'Summer/Estival' :
                    this.season_state === 2 ? 'Autumn/Autumnal' :
                    this.season_state === 3 ? 'Winter/Hibernal' :
                    '<invalid season state>'
                ), x, y += 15);

                ig.system.context.fillStyle = '#ffffff';
                ig.system.context.fillText('Spring : ' + this.convertJulianToGregorian(this.season.vernal_equinox).toString() + ' | ' + this.season.vernal_equinox.toFixed(8) + ' JD', x, y += 15);
                ig.system.context.fillText('Summer : ' + this.convertJulianToGregorian(this.season.estival_solstice).toString() + ' | ' + this.season.estival_solstice.toFixed(8) + ' JD', x, y += 10);
                ig.system.context.fillText('Autumn : ' + this.convertJulianToGregorian(this.season.autumnal_equinox).toString() + ' | ' + this.season.autumnal_equinox.toFixed(8) + ' JD', x, y += 10);
                ig.system.context.fillText('Winter : ' + this.convertJulianToGregorian(this.season.hibernal_solstice).toString() + ' | ' + this.season.hibernal_solstice.toFixed(8) + ' JD', x, y += 10);

                var wc = 'Clear';
                if(this.weather_condition.rain || this.weather_condition.snow || this.weather_condition.fog) {
                    wc = '';
                    if(this.weather_condition.rain)      { wc += 'Rain ';      }
                    if(this.weather_condition.snow)      { wc += 'Snow ';      }
                    if(this.weather_condition.lightning) { wc += 'Lightning '; }
                    if(this.weather_condition.fog)       { wc += 'Fog ';       }
                }

                ig.system.context.fillStyle = '#ffff00';
                ig.system.context.fillText('Weather condition: ' + wc, x, y += 15);

                ig.system.context.fillStyle = '#ffffff';
                ig.system.context.fillText('Maximum Particle Count: ' + this.particles_max, x, y += 15);
                ig.system.context.fillText('Current Particle Count: ' + this.particles_curr, x, y += 10);

                //if(this.weather_condition.fog) {
                //    ig.system.context.fillText('Fog block size: ' + size + 'px * ' + size + 'px', x, y += 15);
                //    ig.system.context.fillText('Fog block iterations: ' + Math.ceil(ig.system.width / size) + ' * ' + Math.ceil(ig.system.height / size) + ' = ' + Math.ceil((ig.system.width * ig.system.height) / (size * size)), x, y += 10);
                //}
            }
        }
    });
});
