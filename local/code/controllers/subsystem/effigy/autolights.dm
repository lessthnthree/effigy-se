SUBSYSTEM_DEF(autolights)
	name = "Auto Lights"
	wait = 14 SECONDS
	flags = SS_POST_FIRE_TIMING | SS_BACKGROUND
	runlevels = RUNLEVEL_GAME
	init_order = INIT_ORDER_AUTO_LIGHTING
	init_stage = INITSTAGE_MAX

	var/list/active_areas = list()

/datum/controller/subsystem/autolights/Initialize()
	for(var/area/autolights_area in GLOB.areas)
		if(autolights_area.auto_lights_current == AUTO_LIGHTS_ENABLED)
			active_areas += autolights_area

	return SS_INIT_SUCCESS

/datum/controller/subsystem/autolights/fire(resumed)
	for(var/area/autolights_area in active_areas)
		autolights_area.check_auto_lights()

/datum/controller/subsystem/autolights/proc/post_setup()
	for(var/area/autolights_area in active_areas)
		autolights_area.init_auto_lights()

/datum/controller/subsystem/ticker/PostSetup()
	. = ..()
	SSautolights.post_setup()
