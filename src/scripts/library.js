import { registerMeterHooks } from "./meter-sheet.js";
import { registerMeterSettings } from "./meter-settings.js";
import { registerHooks as registerFormerAncestryHooks } from "./former-ancestry-hooks.js";
import { registerSettings as registerFormerAncestrySettings } from "./former-ancestry-settings.js";

Hooks.once("init", () => {
    registerMeterSettings();
    registerFormerAncestrySettings();
});

registerMeterHooks();
registerFormerAncestryHooks();
