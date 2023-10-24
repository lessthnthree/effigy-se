/obj/item/clothing/suit
	name = "suit"
	icon = 'icons/obj/clothing/suits/default.dmi'
	lefthand_file = 'icons/mob/inhands/clothing/suits_lefthand.dmi'
	righthand_file = 'icons/mob/inhands/clothing/suits_righthand.dmi'
	supports_variations_flags = CLOTHING_DIGITIGRADE_VARIATION // EffigyEdit Add
	var/fire_resist = T0C+100
	allowed = list(
		/obj/item/tank/internals/emergency_oxygen,
		/obj/item/tank/internals/plasmaman,
		/obj/item/tank/jetpack/oxygen/captain,
		/obj/item/storage/belt/holster,
		)
	armor_type = /datum/armor/none
	drop_sound = 'sound/items/handling/cloth_drop.ogg'
	pickup_sound = 'sound/items/handling/cloth_pickup.ogg'
	slot_flags = ITEM_SLOT_OCLOTHING
	var/blood_overlay_type = "suit"
	limb_integrity = 0 // disabled for most exo-suits

/obj/item/clothing/suit/Initialize(mapload)
	. = ..()
	setup_shielding()

// EffigyEdit Change START (Customization)
// /obj/item/clothing/suit/worn_overlays(mutable_appearance/standing, isinhands = FALSE) // ORIGINAL
/obj/item/clothing/suit/worn_overlays(mutable_appearance/standing, isinhands = FALSE, file2use = null, mutant_styles = NONE)
// EffigyEdit Change END
	. = ..()
	if(isinhands)
		return

	if(damaged_clothes)
		// EffigyEdit Change START (Customization)
		//. += mutable_appearance('icons/effects/item_damage.dmi', "damaged[blood_overlay_type]") //ORIGINAL
		var/damagefile2use = (mutant_styles & STYLE_TAUR_ALL) ? 'local/icons/obj/mob/64x32_item_damage.dmi' : 'icons/effects/item_damage.dmi'
		. += mutable_appearance(damagefile2use, "damaged[blood_overlay_type]")
	if(GET_ATOM_BLOOD_DNA_LENGTH(src))
		//. += mutable_appearance('icons/effects/blood.dmi', "[blood_overlay_type]blood") //ORIGINAL
		var/bloodfile2use = (mutant_styles & STYLE_TAUR_ALL) ? 'local/icons/obj/mob/64x32_blood.dmi' : 'icons/effects/blood.dmi'
		. += mutable_appearance(bloodfile2use, "[blood_overlay_type]blood")
		// EffigyEdit Change END

	var/mob/living/carbon/human/wearer = loc
	if(!ishuman(wearer) || !wearer.w_uniform)
		return
	var/obj/item/clothing/under/undershirt = wearer.w_uniform
	if(!istype(undershirt) || !LAZYLEN(undershirt.attached_accessories))
		return

	var/obj/item/clothing/accessory/displayed = undershirt.attached_accessories[1]
	if(displayed.above_suit)
		. += undershirt.modify_accessory_overlay() // EffigyEdit Change - ORIGINAL: . += undershirt.accessory_overlay

/obj/item/clothing/suit/update_clothes_damaged_state(damaged_state = CLOTHING_DAMAGED)
	..()
	if(ismob(loc))
		var/mob/M = loc
		M.update_worn_oversuit()

/**
 * Wrapper proc to apply shielding through AddComponent().
 * Called in /obj/item/clothing/Initialize().
 * Override with an AddComponent(/datum/component/shielded, args) call containing the desired shield statistics.
 * See /datum/component/shielded documentation for a description of the arguments
 **/
/obj/item/clothing/suit/proc/setup_shielding()
	return
