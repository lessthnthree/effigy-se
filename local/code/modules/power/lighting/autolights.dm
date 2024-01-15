/area
	var/auto_lights_default = AUTO_LIGHTS_DISABLED
	var/auto_lights_current = AUTO_LIGHTS_DISABLED
	var/auto_lights_delay = 90 SECONDS
	COOLDOWN_DECLARE(AUTO_LIGHTS_TIMER)

/area/Initialize(mapload)
	. = ..()
	if(auto_lights_current != auto_lights_default)
		auto_lights_current = auto_lights_default

/area/LateInitialize(mapload)
	. = ..()
	if(!mapload && auto_lights_current == AUTO_LIGHTS_ENABLED)
		SSautolights.active_areas += src

/area/proc/init_auto_lights()
	if(!auto_lights_current == AUTO_LIGHTS_ENABLED)
		CRASH("Auto lights init requested in [src.name] but auto lights status is [auto_lights_current]")

	for(var/mob/living/occupant in contents)
		if(istype(occupant, /mob/living/carbon) || istype(occupant, /mob/living/silicon))
			if(!lightswitch)
				lightswitch = TRUE
				power_change()
				COOLDOWN_START(src, AUTO_LIGHTS_TIMER, rand(auto_lights_delay, auto_lights_delay + 45 SECONDS))
				return

	if(lightswitch)
		lightswitch = FALSE
		power_change()

/area/proc/check_auto_lights()
	if(!auto_lights_current == AUTO_LIGHTS_ENABLED)
		CRASH("Auto lights init requested in [src.name] but auto lights status is [auto_lights_current]")

	if(COOLDOWN_FINISHED(src, AUTO_LIGHTS_TIMER))
		for(var/mob/living/occupant in contents)
			if(istype(occupant, /mob/living/carbon) || istype(occupant, /mob/living/silicon))
				if(!lightswitch)
					lightswitch = TRUE
					power_change()
				COOLDOWN_START(src, AUTO_LIGHTS_TIMER, auto_lights_delay)
				return

		if(lightswitch)
			lightswitch = FALSE
			power_change()

/area/Entered(atom/movable/arrived, area/old_area)
	. = ..()
	if(auto_lights_current == AUTO_LIGHTS_ENABLED && (istype(arrived, /mob/living/carbon) || istype(arrived, /mob/living/silicon)))
		if(!lightswitch)
			lightswitch = TRUE
			COOLDOWN_START(src, AUTO_LIGHTS_TIMER, auto_lights_delay)
			power_change()
