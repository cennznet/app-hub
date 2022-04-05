/**
 * A utility that return value by key from a map
 *
 * @param {K} key
 * @param {Map<K, V>} map
 * @param {V} defaultValue
 * @return {V}
 */
export default function selectMap<K, V>(
	key: K,
	map: Map<K, V>,
	defaultValue?: V
): V {
	if (!map.has(key)) return defaultValue;
	return map.get(key);
}
