import { JS_MODE_SETTING } from "./former-ancestry-constants.js";
import { reconcileFormerAncestryMode } from "./former-ancestry-sync.js";
import { MODULE_ID } from "./module-constants.js";

export function registerSettings() {
    game.settings.register(MODULE_ID, JS_MODE_SETTING, {
        name: "FVTT_PF2EAALIBRARY.SETTINGS.FORMERANCESTRYMODE.NAME",
        hint: "FVTT_PF2EAALIBRARY.SETTINGS.FORMERANCESTRYMODE.HINT",
        scope: "world",
        config: true,
        type: Boolean,
        default: true,
        onChange: () => {
            if (!game.user?.isGM) return;
            void reconcileFormerAncestryMode();
        },
    });
}
