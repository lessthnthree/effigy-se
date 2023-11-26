#define PREFERENCES_FILEPATH "data/player_saves/"

/client/proc/import_json_to_preferences()
	set category = "Debug"
	set name = "Import Prefs JSON"
	set desc = "Load someone's exported preferences file from another server."
	var/input_ckey = tgui_input_text(src, message = "Account CKEY to import preferences", title = "Character preferences data import", max_length = 64, multiline = FALSE, encode = TRUE, timeout = 0, ui_state = GLOB.always_state)
	var/input_data = file2text(input(usr, "Input Preferences JSON File") as file|null)
	var/destination_ckey = ckey(input_ckey)

	if(isnull(destination_ckey))
		to_chat(src, "Not a ckey!")
		CRASH("Not a ckey!")

	message_admins("Destination ckey is [destination_ckey]")
	var/player_prefix = truncate(destination_ckey, 2)
	var/player_directory = "[PREFERENCES_FILEPATH][player_prefix]/[ckey]"
	message_admins("Player prefix is [player_prefix]")
	message_admins("Player directory is [player_directory]")

	if(isnull(input_data))
		to_chat(src, "Not JSON data!")
		CRASH("Not JSON data!")

	if(!rustg_json_is_valid(input_data))
		to_chat(src, "JSON not valid!")
		CRASH("JSON not valid!")

	var/list/decoded_data = safe_json_decode(input_data)
	var/prefs_path = "[player_directory]/preferences.json"
	var/backup_path = "[player_directory]/preferences_autobackup.bak"

	if(!rustg_file_exists(prefs_path))
		to_chat(src, "Could not find old preferences, check the ckey and try again.")
		CRASH("Could not find old preferences, check the ckey and try again.")

	if(!fcopy(prefs_path, backup_path))
		to_chat(src, "Failed to backup player preferences file.")
		CRASH("Failed to backup player preferences file.")

	if(!WRITE_FILE(prefs_path, json_encode(decoded_data)))
		to_chat(src, "Failed to write new preferences file to [prefs_path].")
		CRASH("Failed to write new preferences file to [prefs_path]")

	to_chat(src, "Import preferences to [prefs_path] complete!")

#undef PREFERENCES_FILEPATH
