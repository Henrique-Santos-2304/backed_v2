export const INJECTOR_REPOS = {
  BASE: "repo_base",
  PIVOT: "repo_pivot",
  STATE: "repo_state",
  STATE_VARIABLES: "repo_state_variables",
  SCHEDULINGS: "repo_schedulings",
};

export const INJECTOR_COMMONS = {
  IOT_HANDLER_MESSAGE: "iot_handler_message",
  IOT_CONFIG: "iot_config",
  SERVER: "server",
  APP_DATE: "app_date",
  APP_LOGS: "app_logs",
  APP_ENCRYPTER: "app_encrypter",
  APP_TOKEN: "app_token",
  APP_HASH: "app_hash",
};

export const INJECTOR_CASES = {
  COMMONS: {
    RECEIVED_STATUS: "cases_received_status",
    GET_INITIAL_DATA: "cases_get_initial_data",
    SCHEDULE_MANAGER: "schedule_manager",
  },
  USERS: {
    CREATE: "case_user_create",
    DELETE: "case_user_delete",
    PUT: "case_user_update",
    AUTH: "case_user_auth",
    GET_ALL: "case_user_get_all",
  },
  FARMS: {
    CREATE: "case_farm_create",
    DELETE: "case_farm_delete",
    PUT: "case_farm_update",
    ADD_USER: "case_farm_get_user",
    GET_BY_USER: "case_farm_get_by_user",

    GET_BY_DEALER: "case_farm_get_by_dealer",
    GET_USERS: "case_farm_get_users",
    GET_ONE: "case_farm_get_one",

    GET_ALL: "case_farm_get_all",
  },

  PIVOTS: {
    CREATE: "case_pivot_create",
    DELETE: "case_pivot_delete",
    PUT: "case_pivot_update",
    SAVE_LAST_STATE: "case_pivot_save_last_state",

    GET_FULL: "case_pivot_get_full",
    GET_ALL_FULL: "case_pivot_get_all_full",

    GET_ALL: "case_pivot_get_all",
  },

  STATES: {
    CREATE: "case_state_create",
    ACTION: "case_state_create_action",

    GET_ALL: "case_state_get_all",
    GET_HISTORY: "case_state_get_history",
  },

  STATE_VARIABLES: {
    CREATE: "case_state_variables_create",
    GET_ALL: "case_state_variables_get_all",
  },

  RADIO_VARIABLES: {
    SEND: "cases_send_radio_variables",
    SAVE: "cases_save_radio_variables",
  },
  SCHEDULE: {
    SAVE: "cases_save_schedule",
    INIT_DATE: "cases_schedule_by_date",
    INIT_ANGLE: "cases_schedule_by_angle",

    CREATE: "cases_create_schedule",
    GET_ALL: "cases_get_all_schedule",
    UPDATE: "cases_update_schedule",
    DELETE: "cases_delete_schedule",
  },
};

export const INJECTOR_CONTROLS = {
  USERS: {
    CREATE: "control_user_create",
    DELETE: "control_user_delete",
    PUT: "control_user_update",
    AUTH: "control_user_auth",
    GET_ALL: "control_user_get_all",
  },

  FARMS: {
    CREATE: "control_farm_create",
    DELETE: "control_farm_delete",
    PUT: "control_farm_update",
    ADD_USER: "control_farm_get_user",
    GET_BY_USER: "control_farm_get_by_user",

    GET_BY_DEALER: "control_farm_get_by_dealer",
    GET_USERS: "control_farm_get_users",
    GET_ONE: "control_farm_get_one",

    GET_ALL: "control_farm_get_all",
  },

  PIVOTS: {
    CREATE: "control_pivot_create",
    DELETE: "control_pivot_delete",
    PUT: "control_pivot_update",
    SAVE_LAST_STATE: "control_pivot_save_last_state",

    GET_FULL: "control_pivot_get_full",
    GET_ALL_FULL: "control_pivot_get_all_full",

    GET_ALL: "control_pivot_get_all",
  },

  STATES: {
    GET_HISTORY: "controls_state_get_history",
    ACTION: "controls_state_create_action",
  },

  RADIO_VARIABLES: {
    SEND: "controls_send_radio_variables",
  },

  SCHEDULE: {
    CREATE: "controls_create_schedule",
    GET_ALL_BY_DATE: "controls_get_all_by_date_schedule",
    GET_ALL_BY_ANGLE: "controls_get_all_by_angle_schedule",
    GET_ALL: "controls_get_all_schedule",

    UPDATE: "controls_update_schedule",
    DELETE: "controls_delete_schedule",
  },
};

export const INJECTOR_OBSERVABLES = {
  GATEWAY_COMM: "gateway_communication",
  ACTION: "create_action_observer",
  SCHEDULE: "scheduling_action",
  ANGLE_JOB: "schedule_angle",
};
