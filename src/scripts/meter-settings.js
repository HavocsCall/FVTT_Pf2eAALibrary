import { MODULE_ID } from "./module-constants.js";

const METER_PANEL_SETTING = "enableMeterPanel";

export function registerMeterSettings() {
    game.settings.register(MODULE_ID, METER_PANEL_SETTING, {
        name: "FVTT_PF2EAALIBRARY.SETTINGS.METERPANEL.NAME",
        hint: "FVTT_PF2EAALIBRARY.SETTINGS.METERPANEL.HINT",
        scope: "world",
        config: true,
        type: Boolean,
        default: true,
        onChange: rerenderOpenActorWindows,
    });
}

export function isMeterPanelEnabled() {
    return game.settings.get(MODULE_ID, METER_PANEL_SETTING) === true;
}

export function rerenderOpenActorWindows() {
    for (const app of Object.values(ui.windows)) {
        if (app.document?.documentName === "Actor") app.render(true);
    }
}
