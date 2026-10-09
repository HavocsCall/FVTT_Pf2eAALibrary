const profiles = new Map();

export function registerAncestryProfile(profile) {
	const slug = profile?.slug?.trim();
	if (!slug) throw new Error("An accursed ancestry profile requires a slug.");
	if (profiles.has(slug)) throw new Error(`An accursed ancestry profile is already registered for "${slug}".`);

	const normalized = Object.freeze({ ...profile, slug });
	profiles.set(slug, normalized);
	Hooks.callAll("FVTT_Pf2eAALibrary.profileRegistered", normalized);
	return normalized;
}

export function getAncestryProfile(item) {
	if (item?.type !== "ancestry") return null;
	return profiles.get(item.system?.slug) ?? null;
}

export function getAncestryProfileBySlug(slug) {
	return profiles.get(slug) ?? null;
}

export function getAncestryProfiles() {
	return profiles.values();
}

export function isRegisteredAncestrySlug(slug) {
	return profiles.has(slug);
}

export function getActorAccursedAncestry(actor) {
	if (actor?.type !== "character") return null;
	const item = actor.items.find((candidate) => getAncestryProfile(candidate));
	return item ? { item, profile: getAncestryProfile(item) } : null;
}

export function isRegisteredAncestry(actor, slug) {
	return getActorAccursedAncestry(actor)?.profile.slug === slug;
}
