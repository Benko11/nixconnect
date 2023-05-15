export function usePreferences(preferences, id) {
    if (typeof id === "number")
        return preferences.filter((p) => p.id === id)[0].pivot.value;

    return preferences.filter((p) => p.slug === id)[0].pivot.value;
}
