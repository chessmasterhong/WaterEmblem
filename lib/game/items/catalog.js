ig.module(
    'game.items.catalog'
)
.requires(
    'impact.game'
)
.defines(function() {
   ig.global.ItemCatalog = ig.Class.extend({
        /* FORMAT OF ITEMS: { 
                                name: ' ', 
                                type: 'axe/sword/lance',
                                attack power (atk): #, 
                                weight of weapon (wt): #, 
                                img: new img(path), 
                                critical (crit): #, 
                                hit percentage (HIT): #, 
                                weapon durability (uses): 46, 
                                price of weapon in store (cost): 460 
                            }


        */

        // Swords
        sword1:  { name: 'Iron Sword', iron_sword: new ig.Image('media/weapons/swords/iron_sword.png'), atk: 5, wt: 5, crit: 0, hit: 90, uses: 46, cost: 460},
        sword2:  { name: 'Slim Sword', slim_sword: new ig.Image('media/weapons/swords/slim_sword.png'),atk: 3, wt: 2, crit: 5, hit: 100, uses: 30, cost: 480},
        sword3:  { name: 'Steel Sword', steel_sword: new ig.Image('media/weapons/swords/steel_sword.png'),atk: 8, wt: 10, crit: 0, hit: 75, uses: 30, cost: 600},
        sword4:  { name: 'Silver Sword', silver_sword: new ig.Image('media/weapons/swords/silver_sword.png'), atk: 13, wt: 8, crit: 0, hit: 80, uses: 20, cost: 1500},
        sword5:  { name: 'Iron Blade', iron_blade: new ig.Image('media/weapons/swords/iron_blade.png'), atk: 9, wt: 12, crit: 0, hit: 70, uses: 35, cost: 980},
        sword6:  { name: 'Steel Blade', steel_blade: new ig.Image('media/weapons/swords/steel_blade.png'),atk: 11, wt: 14, crit: 0, hit: 65, uses: 25, cost: 980},
        sword7:  { name: 'Silver Blade', silver_blade: new ig.Image('media/weapons/swords/silver_blade.png'),atk: 14, wt: 13, crit: 0, hit: 60, uses: 15, cost: 1800},
        sword8:  { name: 'Shamshir', shamshir: new ig.Image('media/weapons/swords/shamshir.png'),atk: 8, wt: 5, crit: 35, hit: 75, uses: 20, cost: 1200},
        sword9:  { name: 'Killing Edge', killing_edge: new ig.Image('media/weapons/swords/killing_edge.png'),atk: 9, wt: 7, crit: 30, hit: 75, uses: 20, cost: 1300},
        sword10: { name: 'Audhulma', audhulma: new ig.Image('media/weapons/swords/audhulma.png'),atk: 18, wt: 9, crit: 0, hit: 85, uses: 30, cost: 9001},
        
        // Lances
        lance1: { name: 'Iron Lance', iron_lance: new ig.Image('media/weapons/lances/iron_lance.png'), atk: 7, wt: 9, crit: 0, hit: 80, uses: 45, cost: 360},
        lance2: { name: 'Slim Lance', slim_lance: new ig.Image('media/weapons/lances/slim_lance.png'), atk: 4, wt: 4, crit: 5, hit: 85, uses: 30, cost: 420},
        lance3: { name: 'Steel Lance', steel_lance: new ig.Image('media/weapons/lances/steel_lance.png'), atk: 10, wt: 13, crit: 0, hit: 70, uses: 30, cost: 480},
        lance4: { name: 'Silver Lance', silver_lance: new ig.Image('media/weapons/lances/silver_lance.png'), atk: 14, wt: 10, crit: 0, hit: 75, uses: 20, cost: 1200},
        lance5: { name: 'Killer Lance', killer_lance: new ig.Image('media/weapons/lances/killer_lance.png'), atk: 10, wt: 9, crit: 30, hit: 70, uses: 20, cost: 1200},
        lance6: { name: 'Dragonspear', dragon_spear: new ig.Image('media/weapons/lances/dragon_spear.png'), atk: 10, wt: 8, crit: 0, hit: 70, uses: 30, cost: 4500},
        lance7: { name: 'Vidofnir', vidofnir: new ig.Image('media/weapons/lances/vidofnir.png'), atk: 10, wt: 11, crit: 0, hit: 85, uses: 30, cost: 9001},

        // Axes
        axe1:   { name: 'Iron Axe', iron_axe: new ig.Image('media/weapons/axes/iron_axe.png'), atk: 8, wt: 10, crit: 0, hit: 75, uses: 45, cost: 270},
        axe2:   { name: 'Steel Axe', steel_axe: new ig.Image('media/weapons/axes/steel_axe.png'), atk: 11, wt: 15, crit: 0, hit: 65, uses: 30, cost: 360},
        axe3:   { name: 'Silver Axe', silver_axe: new ig.Image('media/weapons/axes/silver_axe.png'), atk: 15, wt: 12, crit: 0, hit: 70, uses: 20, cost: 1000},
        axe4:   { name: 'Killer Axe', killer_axe: new ig.Image('media/weapons/axes/killer_axe.png'), atk: 11, wt: 11, crit: 30, hit: 65, uses: 20, cost: 1100},
        axe5:   { name: 'Armads', armads: new ig.Image('media/weapons/axes/armads.png'), atk: 20, wt: 13, crit: 0, hit: 75, uses: 30, cost: 9001},
   });
});
