Fire Emblem - Chronicles of the Abyss
=====================================

What is Fire Emblem?
--------------------
Fire Emblem is a turn-based strategy role-playing game (TBSRPG), made by
Nintendo and Intelligent Systems. The whole draw of Fire Emblem is the ability
for a player to control an army of units, thrown into a medival world overun by
nations and demons bent on destroying the world. To this day, there are Fire
Emblem games on various gaming consoles, but none that are web-based.


What is this game?
------------------
Fire Emblem - Chronicles of the Abyss is a web-based version of Fire Emblem -
Blazing Sword for the Game Boy Advanced (GBA), although with a different plot
twist (and a different main character). This game is built entirely in
JavaScript (using the ImpactJS) Game Engine, purely for educational purposes
under the City College of New York chapter of Association for Computing
Machinery's Game Development Club. On top of that, this game is built for the
sake of re-creating a well-loved game, as well as pushing the ImpactJS Game
Engine to its limits.


Disclaimer
----------
This game is built **purely for education purposes**. As such, this is a
**non-profit** project, and is **not meant for wide distribution**. All included
graphics are copyright of Nintendo and Intelligent Systems (except for the
custom title screen art and game music). These copyrighted resources include:
all animation sprites, map sprites, map tiles, character images and names,
weapons/items along with their corresponding animations, all graphical user
interfaces (stats screen, character modals, battle animation interfaces), as
well as the gameplay concepts. These resources are **solely used for the sake of
a realistic remake of a well-known game**.


Progress
--------
Fire Emblem games in general can be broken down into several major components.
Of these components, the list  below shows the current systems that have been
implemented within Fire Emblem - Chronicles of the Abyss.

* Core battle system
    * Battle grid system
        * Multiple controllable player units
        * Unit pathfinding using A* search algorithm
        * Enemy AI algorithm to determine best unit to attack
        * Mouse "point-and-click" for unit movement
        * Non-collision nearby unit detection
        * Attackable enemy units
        * Healable player units
        * Terrain system
        * Camera system to focus on active unit
    * Battle animation system
    * Melee and ranged battle animations
    * Animation queue for initial, counter, and second attacks
    * Animation handling for normal, magic, and critical attacks
* Map objectives
* Map scripts
* Cutscene system and dialogs
* Character development system
    * Level and experience system
    * Base stats
    * Derived stats
    * Stat growth system
* Items
    * Unit inventory system
        * Weapon durability
        * Consumable items
        * Item quantity and usage
        * Enemy item drops
    * Unit equipment system
        * Melee, ranged, and magic weapons
        * Weapon stats system
    * Trade system
    * Shop system
* Graphical user interface (along with all their corresponding functionalities)
    * Mouse-driven menu interaction
    * Battle animation screen
    * Attack/Heal interface
    * Battle quick-summary
    * Unit stats screen
    * Inventory menu
    * Trade menu
    * Shop screen
    * Dialog screen
    * Game settings configuration screen


Contributors
------------
* Kevin Chan
* David Leonard
* Wan Kim Mok
* Jeremy Neiman
* Enan Rahman
* Christopher Zhang
