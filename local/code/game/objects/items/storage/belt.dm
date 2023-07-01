/obj/item/storage/belt/utility/full/powertools/rcd/mkii/PopulateContents()
	new /obj/item/screwdriver/power(src)
	new /obj/item/crowbar/power(src)
	new /obj/item/weldingtool/experimental(src)
	new /obj/item/construction/rcd/mkii(src)
	new /obj/item/pipe_dispenser(src)
	new /obj/item/wrench/bolter(src)
	new /obj/item/analyzer/ranged(src)

/*
* Messenger belt bag
*/

/obj/item/storage/belt/mailbelt
	name = "messenger belt bag"
	desc = "A small bag with a belt, worn around the waist. It's just big enough to hold a small stack of letters. This one is postal blue, perfect for standing out!"
	icon = 'packages/clothing/assets/obj/belts.dmi'
	icon_state = "mailbelt"
	worn_icon = 'packages/clothing/assets/mob/belt.dmi'
	worn_icon_state = "mailbelt"
	equip_sound = 'sound/items/equip/toolbelt_equip.ogg'

/obj/item/storage/belt/mailbelt/Initialize(mapload)
	. = ..()
	atom_storage.max_slots = 14
	atom_storage.numerical_stacking = TRUE
	atom_storage.set_holdable(list(
		/obj/item/mail,
		/obj/item/mail/envelope,
		/obj/item/paper
	))

/obj/item/storage/belt/mailbelt/white
	name = "white belt bag"
	desc = "A small bag with a belt, worn around the waist. It's just big enough to hold a small stack of letters. This one is a pearly white."
	icon = 'packages/clothing/assets/obj/belts.dmi'
	icon_state = "mailbelt_white"
	worn_icon = 'packages/clothing/assets/mob/belt.dmi'
	worn_icon_state = "mailbelt_white"
	equip_sound = 'sound/items/equip/toolbelt_equip.ogg'

/obj/item/storage/belt/mailbelt/leather
	name = "leather belt bag"
	desc = "A small bag with a belt, worn around the waist. It's just big enough to hold a small stack of letters. This one is made out of a synthetic leather blend."
	icon = 'packages/clothing/assets/obj/belts.dmi'
	icon_state = "mailbelt_leather"
	worn_icon = 'packages/clothing/assets/mob/belt.dmi'
	worn_icon_state = "mailbelt_leather"
	equip_sound = 'sound/items/equip/toolbelt_equip.ogg'
