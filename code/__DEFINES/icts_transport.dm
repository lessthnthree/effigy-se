#define SEND_ICTS_SIGNAL(sigtype, arguments...) ( SEND_SIGNAL(SSicts_transport, sigtype, ##arguments) )

// ICTS Signals
#define COMSIG_ICTS_REQUEST "!REQ"

#define COMSIG_ICTS_RESPONSE "!RESP"
#define REQUEST_FAIL "!FAIL"
#define REQUEST_SUCCESS "!ACK"


// ICTS Codes
#define NOT_IN_SERVICE "!NIS"
#define TRANSPORT_IN_USE "!BUSY"
#define INVALID_PLATFORM "!NDEST"
#define PLATFORM_DISABLED "!DIS"
#define NO_CALL_REQUIRED "!NCR"
#define INTERNAL_ERROR "!ERR"

/// ICTS Tram lines
#define TRAMSTATION_LINE_1 "tram_1"
#define HILBERT_LINE_1 "hilb_1"
#define BIRDSHOT_LINE_1 "bird_1"
#define BIRDSHOT_LINE_2 "bird_1"

#define PLATFORM_ACTIVE 1

// Flags for the ICTS Tram VOBC (vehicle on-board computer)

#define CONTROLLER_IDLE (1<<0)
#define DOORS_OPEN (1<<1)

#define ICTS_TYPE_ELEVATOR "icts_elev"
#define ICTS_TYPE_TRAM "icts_tram"

