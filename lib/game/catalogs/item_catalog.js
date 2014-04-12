ig.module(
    'game.catalogs.item_catalog'
)
.requires(
    'impact.game'
)
.defines(function() {
    "use strict";

    ig.global.ItemCatalog = ig.Class.extend({
        /* FORMAT OF ITEMS:
            itemReferenceName: {
                name: 'item_name',
                type: 'equip/use'
                affinity: 'axe/sword/lance',
                range: #,
                item image (icon): new ig.Image('path/to/image/'),
                attack power (atk): #,
                weight of weapon (wt): #,
                critical (crit): #,
                hit percentage (HIT): #,
                weapon durability (uses): #,
                price of weapon in store (cost): #,
                desc: 'item_description'
                effect: function(entity) { ... },
            }
        */

        // Swords
        sword1:  { name: 'Iron Sword',   type: 'equip', affinity: 'sword', range: 1, icon: new ig.Image('media/weapons/swords/iron_sword.png'),   atk:  5, wt:  5, crit:  0, hit: 90,  uses: 46, cost:  460, desc: '' },
        sword2:  { name: 'Slim Sword',   type: 'equip', affinity: 'sword', range: 1, icon: new ig.Image('media/weapons/swords/slim_sword.png'),   atk:  3, wt:  2, crit:  5, hit: 100, uses: 30, cost:  480, desc: '' },
        sword3:  { name: 'Steel Sword',  type: 'equip', affinity: 'sword', range: 1, icon: new ig.Image('media/weapons/swords/steel_sword.png'),  atk:  8, wt: 10, crit:  0, hit: 75,  uses: 30, cost:  600, desc: '' },
        sword4:  { name: 'Silver Sword', type: 'equip', affinity: 'sword', range: 1, icon: new ig.Image('media/weapons/swords/silver_sword.png'), atk: 13, wt:  8, crit:  0, hit: 80,  uses: 20, cost: 1500, desc: '' },
        sword5:  { name: 'Iron Blade',   type: 'equip', affinity: 'sword', range: 1, icon: new ig.Image('media/weapons/swords/iron_blade.png'),   atk:  9, wt: 12, crit:  0, hit: 70,  uses: 35, cost:  980, desc: '' },
        sword6:  { name: 'Steel Blade',  type: 'equip', affinity: 'sword', range: 1, icon: new ig.Image('media/weapons/swords/steel_blade.png'),  atk: 11, wt: 14, crit:  0, hit: 65,  uses: 25, cost:  980, desc: '' },
        sword7:  { name: 'Silver Blade', type: 'equip', affinity: 'sword', range: 1, icon: new ig.Image('media/weapons/swords/silver_blade.png'), atk: 14, wt: 13, crit:  0, hit: 60,  uses: 15, cost: 1800, desc: '' },
        sword8:  { name: 'Shamshir',     type: 'equip', affinity: 'sword', range: 1, icon: new ig.Image('media/weapons/swords/shamshir.png'),     atk:  8, wt:  5, crit: 35, hit: 75,  uses: 20, cost: 1200, desc: '' },
        sword9:  { name: 'Killing Edge', type: 'equip', affinity: 'sword', range: 1, icon: new ig.Image('media/weapons/swords/killing_edge.png'), atk:  9, wt:  7, crit: 30, hit: 75,  uses: 20, cost: 1300, desc: '' },
        sword10: { name: 'Audhulma',     type: 'equip', affinity: 'sword', range: 1, icon: new ig.Image('media/weapons/swords/audhulma.png'),     atk: 18, wt:  9, crit:  0, hit: 85,  uses: 30, cost: 9001, desc: '' },

        // Lances
        lance1: { name: 'Iron Lance',   type: 'equip', affinity: 'lance', range: 1, icon: new ig.Image('media/weapons/lances/iron_lance.png'),   atk:  7, wt:  9, crit:  0, hit: 80, uses: 45, cost:  360, desc: '' },
        lance2: { name: 'Slim Lance',   type: 'equip', affinity: 'lance', range: 1, icon: new ig.Image('media/weapons/lances/slim_lance.png'),   atk:  4, wt:  4, crit:  5, hit: 85, uses: 30, cost:  420, desc: '' },
        lance3: { name: 'Steel Lance',  type: 'equip', affinity: 'lance', range: 1, icon: new ig.Image('media/weapons/lances/steel_lance.png'),  atk: 10, wt: 13, crit:  0, hit: 70, uses: 30, cost:  480, desc: '' },
        lance4: { name: 'Silver Lance', type: 'equip', affinity: 'lance', range: 1, icon: new ig.Image('media/weapons/lances/silver_lance.png'), atk: 14, wt: 10, crit:  0, hit: 75, uses: 20, cost: 1200, desc: '' },
        lance5: { name: 'Killer Lance', type: 'equip', affinity: 'lance', range: 1, icon: new ig.Image('media/weapons/lances/killer_lance.png'), atk: 10, wt:  9, crit: 30, hit: 70, uses: 20, cost: 1200, desc: '' },
        lance6: { name: 'Dragonspear',  type: 'equip', affinity: 'lance', range: 1, icon: new ig.Image('media/weapons/lances/dragon_spear.png'), atk: 10, wt:  8, crit:  0, hit: 70, uses: 30, cost: 4500, desc: '' },
        lance7: { name: 'Vidofnir',     type: 'equip', affinity: 'lance', range: 1, icon: new ig.Image('media/weapons/lances/vidofnir.png'),     atk: 10, wt: 11, crit:  0, hit: 85, uses: 30, cost: 9001, desc: '' },

        // Axes
        axe1: { name: 'Iron Axe',   type: 'equip', affinity: 'axe', range: 1, icon: new ig.Image('media/weapons/axes/iron_axe.png'),   atk:  8, wt: 10, crit:  0, hit: 75, uses: 45, cost:  270, desc: '' },
        axe2: { name: 'Steel Axe',  type: 'equip', affinity: 'axe', range: 1, icon: new ig.Image('media/weapons/axes/steel_axe.png'),  atk: 11, wt: 15, crit:  0, hit: 65, uses: 30, cost:  360, desc: '' },
        axe3: { name: 'Silver Axe', type: 'equip', affinity: 'axe', range: 1, icon: new ig.Image('media/weapons/axes/silver_axe.png'), atk: 15, wt: 12, crit:  0, hit: 70, uses: 20, cost: 1000, desc: '' },
        axe4: { name: 'Killer Axe', type: 'equip', affinity: 'axe', range: 1, icon: new ig.Image('media/weapons/axes/killer_axe.png'), atk: 11, wt: 11, crit: 30, hit: 65, uses: 20, cost: 1100, desc: '' },
        axe5: { name: 'Armads',     type: 'equip', affinity: 'axe', range: 1, icon: new ig.Image('media/weapons/axes/armads.png'),     atk: 20, wt: 13, crit:  0, hit: 75, uses: 30, cost: 9001, desc: '' },

        // Bows
        bow1: { name: 'Iron Bow',   type: 'equip', affinity: 'bow', range: 2, icon: new ig.Image('media/weapons/bows/iron_bow.png'),   atk:  6, wt: 5, crit:  0, hit: 85, uses: 45, cost:  540, desc: '' },
        bow2: { name: 'Steel Bow',  type: 'equip', affinity: 'bow', range: 2, icon: new ig.Image('media/weapons/bows/steel_bow.png'),  atk:  9, wt: 9, crit:  0, hit: 70, uses: 30, cost:  720, desc: '' },
        bow3: { name: 'Silver Bow', type: 'equip', affinity: 'bow', range: 2, icon: new ig.Image('media/weapons/bows/silver_bow.png'), atk: 13, wt: 6, crit:  0, hit: 75, uses: 20, cost: 1600, desc: '' },
        bow4: { name: 'Killer Bow', type: 'equip', affinity: 'bow', range: 2, icon: new ig.Image('media/weapons/bows/killer_bow.png'), atk:  9, wt: 7, crit: 30, hit: 75, uses: 20, cost: 1400, desc: '' },
        bow5: { name: 'Short Bow',  type: 'equip', affinity: 'bow', range: 2, icon: new ig.Image('media/weapons/bows/short_bow.png'),  atk:  5, wt: 3, crit: 10, hit: 85, uses: 22, cost: 1760, desc: '' },

        // Tomes
        tome1: { name: 'Fimbulvetr', type: 'equip', affinity: 'anima', range: 2, icon: new ig.Image('media/weapons/tomes/fimbulvetr.png'), atk:  8, wt: 3, crit: 0, hit: 75, uses: 30, cost:  900, desc: '' },
        tome2: { name: 'Forblaze',   type: 'equip', affinity: 'anima', range: 2, icon: new ig.Image('media/weapons/tomes/forblaze.png'),   atk: 20, wt: 3, crit: 0, hit: 90, uses: 20, cost: 9001, desc: '' },
        tome3: { name: 'Excalibur',  type: 'equip', affinity: 'anima', range: 2, icon: new ig.Image('media/weapons/tomes/excalibur.png'),  atk:  5, wt: 3, crit: 0, hit: 120, uses: 20, cost: 900, desc: '' },

        // Staffs
        staff1: { name: 'Heal Staff', type: 'equip', affinity: 'staff', range: 1, icon: new ig.Image('media/weapons/staffs/healStaff.png'), atk: 0, wt: 3, crit: 0, hit: 0, uses: 45, heal: 5, cost: 200, desc: '' , bonus: 17, effect: function(entity){ entity.exp_curr += this.bonus+Math.floor(entity.stat.mag/2) } },

         // Healing items
        item1: { name: 'Vulnerary', type: 'consumable', affinity: 'potion', icon: new ig.Image('media/weapons/items/vulnerary.png'), uses: 3, cost:  100, desc: '', effect: function(entity){ entity.receiveDamage(-5, this) } },
        item2: { name: 'Elixir',    type: 'consumable', affinity: 'potion', icon: new ig.Image('media/weapons/items/elixir.png'),    uses: 3, cost: 1300, desc: '', effect: function(entity){ entity.receiveDamage(-10, this) } },

        // Items
        item3: { name: 'Energy Drop',  type: 'consumable', affinity: 'item', icon: new ig.Image('media/weapons/items/energy_drop.png'),  uses: 1, cost: 0, desc: '', effect: function(entity){ entity.stat.str += 2 } },
        item4: { name: 'Angelic Robe', type: 'consumable', affinity: 'item', icon: new ig.Image('media/weapons/items/angelic_robe.png'), uses: 1, cost: 0, desc: '', effect: function(entity){ entity.health_max += 7 } }
    });
});
