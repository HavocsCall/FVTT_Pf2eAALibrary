const DEFAULT_STATE = Object.freeze({ current: 0, baseMax: 7, maxModifier: 0 });

export function getMeterState(actor, meter) {
	const stored = actor?.getFlag(meter.moduleId, meter.flag) ?? {};
	return sanitizeMeterState(stored, meter);
}

export async function adjustMeterCurrent(actor, meter, delta) {
	const state = getMeterState(actor, meter);
	return setMeterState(actor, meter, { ...state, current: state.current + delta });
}

export async function setMeterCurrent(actor, meter, value) {
	const state = getMeterState(actor, meter);
	return setMeterState(actor, meter, { ...state, current: value });
}

export async function setMeterState(actor, meter, state) {
	const next = sanitizeMeterState(state, meter);
	await actor.update({ [`flags.${meter.moduleId}.${meter.flag}`]: toStoredState(next) });
	return next;
}

function sanitizeMeterState(state, meter) {
	const defaults = meter.getDefaults?.() ?? {};
	const defaultMax = clampNumber(defaults.baseMax ?? meter.defaultMax, DEFAULT_STATE.baseMax, { min: 0 });
	const baseMax = clampNumber(state?.baseMax, defaultMax, { min: 0 });
	const maxModifier = clampNumber(state?.maxModifier, DEFAULT_STATE.maxModifier);
	const baseThresholds = sanitizeThresholds(defaults.baseThresholds);
	const thresholdModifiers = sanitizeThresholds(state?.thresholdModifiers, { drained: 0, confused: 0, death: 0 });
	const thresholds = deriveThresholds(baseThresholds, thresholdModifiers);
	const max = thresholds ? thresholds.death : Math.max(0, baseMax + maxModifier);
	const current = clampNumber(state?.current, DEFAULT_STATE.current, { min: 0, max });
	return { current, baseMax, maxModifier, max, baseThresholds, thresholdModifiers, thresholds };
}

function sanitizeThresholds(value, fallback = null) {
	if (!value && !fallback) return null;
	const source = value ?? fallback;
	return {
		drained: clampNumber(source.drained, fallback?.drained ?? 0, { min: 0 }),
		confused: clampNumber(source.confused, fallback?.confused ?? 0, { min: 0 }),
		death: clampNumber(source.death, fallback?.death ?? 0, { min: 0 }),
	};
}

function deriveThresholds(base, modifiers) {
	if (!base) return null;
	const drained = Math.max(0, base.drained + modifiers.drained);
	const confused = Math.max(drained, base.confused + modifiers.confused);
	const death = Math.max(confused, base.death + modifiers.death);
	return { drained, confused, death };
}

function toStoredState(state) {
	const stored = { current: state.current, baseMax: state.baseMax, maxModifier: state.maxModifier };
	if (state.thresholds) stored.thresholdModifiers = foundry.utils.deepClone(state.thresholdModifiers);
	return stored;
}

function clampNumber(value, fallback, { min = -Infinity, max = Infinity } = {}) {
	const numeric = Number(value);
	return Number.isFinite(numeric) ? Math.min(max, Math.max(min, Math.trunc(numeric))) : fallback;
}
