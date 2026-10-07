import { hasMeterPanel, refreshMeterPanel } from "./meter-panel.js";

const sheetObservers = new WeakMap();

export function registerMeterHooks() {
	Hooks.on("renderCharacterSheetPF2e", (app, html) => {
		refreshMeterPanel(app, html[0] ?? html);
		ensureSheetObserver(app);
	});
	Hooks.on("updateActor", (actor, changed) => {
		if (!foundry.utils.hasProperty(changed, "flags")) return;
		for (const app of Object.values(actor.apps ?? {})) {
			const root = app.element?.[0];
			if (root && app.actor?.type === "character") refreshMeterPanel(app, root);
		}
	});
	Hooks.on("closeCharacterSheetPF2e", (app) => {
		sheetObservers.get(app)?.disconnect();
		sheetObservers.delete(app);
	});
}

function ensureSheetObserver(app) {
	const root = app.element?.[0];
	if (!root) return;
	sheetObservers.get(app)?.disconnect();
	const observer = new MutationObserver(() => {
		const currentRoot = app.element?.[0];
		if (currentRoot && !hasMeterPanel(currentRoot)) refreshMeterPanel(app, currentRoot);
	});
	observer.observe(root, { childList: true, subtree: true });
	sheetObservers.set(app, observer);
}
