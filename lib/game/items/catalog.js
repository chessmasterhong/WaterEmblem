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

        //Item1: { name: 'Silver Sword', ragnell: new ig.Image('media/weapons/Ragnell.png'), atk: 10, mag: 0, skl: 0, def: 0, res: 0, spd: 0, luk: 0, mov: 0 },
        //Item2: { name: 'Bronze Sword', ragnell: new ig.Image('media/weapons/Ragnell.png'), atk: 3 },

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
   });
});
