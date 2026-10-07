import { getActorAccursedAncestry } from "./ancestry-registry.js";
import { adjustMeterCurrent, getMeterState } from "./meter-state.js";
import { isMeterPanelEnabled } from "./meter-settings.js";

export function refreshMeterPanel(app, root) {
    const accursed = getActorAccursedAncestry(app.actor);
    if (!isMeterPanelEnabled() || !accursed?.profile.meter) {
        root.querySelector(".fvtt-aa-meter-panel")?.remove();
        return;
    }
    const replacement = createPanel(app.actor, accursed.profile.meter, getMeterState(app.actor, accursed.profile.meter));
    const existing = root.querySelector(".fvtt-aa-meter-panel");
    if (existing) return existing.replaceWith(replacement);
    const anchor = root.querySelector("aside .hitpoints") ?? root.querySelector("aside");
    if (anchor) anchor.insertAdjacentElement("afterend", replacement);
    else root.querySelector("form")?.prepend(replacement);
}

export function hasMeterPanel(root) {
    return Boolean(root.querySelector(".fvtt-aa-meter-panel"));
}

function createPanel(actor, meter, state) {
    const panel = document.createElement("section");
    panel.className = "fvtt-aa-meter-panel";
    const dots = Array.from({ length: state.max }, (_, index) => {
        const value = index + 1;
        const active = value <= state.current ? " fvtt-aa-meter-panel__dot--active" : "";
        const severity = state.thresholds ? ` fvtt-aa-meter-panel__dot--${getDotSeverity(value, state.thresholds)}` : "";
        return `<i class="fa-${value <= state.current ? "solid" : "regular"} fa-circle fvtt-aa-meter-panel__dot${active}${severity}"></i>`;
    }).join("");
    panel.innerHTML = `<a class="condition-pips fvtt-aa-meter-panel__track${actor.isOwner ? " fvtt-aa-meter-panel__track--editable" : ""}" data-action="adjust-meter"><span class="sidebar_label">${game.i18n.localize(meter.label)}</span><span class="pips fvtt-aa-meter-panel__meter">${dots || `<span class="fvtt-aa-meter-panel__empty">${game.i18n.localize(meter.empty)}</span>`}</span></a>`;
    if (!actor.isOwner) return panel;
    const track = panel.querySelector("[data-action='adjust-meter']");
    track?.addEventListener("click", async (event) => { event.preventDefault(); await adjustMeterCurrent(actor, meter, 1); });
    track?.addEventListener("contextmenu", async (event) => { event.preventDefault(); await adjustMeterCurrent(actor, meter, -1); });
    return panel;
}

function getDotSeverity(value, thresholds) {
    if (value >= thresholds.death) return "death";
    if (value >= thresholds.confused) return "confused";
    if (value >= thresholds.drained) return "drained";
    return "safe";
}
