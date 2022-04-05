/**
 * A utility that return value by key from a map
 *
 * @param {K} key
 * @param {Map<K, V> | Record<K, V>} object
 * @param {V} defaultValue
 * @return {V}
 */
export default function selectMap<K extends string | number | symbol, V>(
	key: K,
	object: Partial<Record<K, V>>,
	defaultValue?: V
): V {
	const map: Map<K, V> = new Map(Object.entries(object) as [K, V][]);
	if (!map.has(key)) return defaultValue;
	return map.get(key);
}
