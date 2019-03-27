export const TOGGLE_SETTINGS = 'action:toggle_settings';


export const toggleSettings = (name, isOn) => ({
  type: TOGGLE_SETTINGS,
  payload: {
    name,
    isOn,
  },
});
