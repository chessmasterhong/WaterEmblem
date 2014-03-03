ig.module(
    'game.items.catalog'
)
.requires(
    'impact.game'
)
.defines(function() {
   ig.global.ItemCatalog = ig.Class.extend({
        Item1: { name: 'Silver Sword', atk: 10, mag: 0, skl: 0, def: 0, res: 0, spd: 0, luk: 0, mov: 0 },
        Item2: { name: 'Bronze Sword', atk: 3 },
   });
});
