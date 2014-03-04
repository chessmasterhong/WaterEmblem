ig.module(
    'game.items.catalog'
)
.requires(
    'impact.game'
)
.defines(function() {
   ig.global.ItemCatalog = ig.Class.extend({
        // FORMAT OF ITEMS: { name: ' ', attack power (atk): #, weight of weapon (wt): #, img: new img(path), critical (crit): #, 
        //                     weapon durability (uses): 46, price of weapon in store (cost): 460  }
        // Swords

        //Item1: { name: 'Silver Sword', ragnell: new ig.Image('media/weapons/Ragnell.png'), atk: 10, mag: 0, skl: 0, def: 0, res: 0, spd: 0, luk: 0, mov: 0 },
        //Item2: { name: 'Bronze Sword', ragnell: new ig.Image('media/weapons/Ragnell.png'), atk: 3 },

        Item1: { name: 'Iron Sword', atk: 5, wt: 5, crit: 0, uses: 46, cost: 460},
        Item2: { name: 'Slim Sword', atk: 3, wt: 2, crit: 5, uses: 30, cost: 480},
   });
});
