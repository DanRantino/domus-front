export function findSelectedHousehold<T extends { id: string }>(
  households: readonly T[],
  selectedId: string | null | undefined,
): T | undefined {
  return households.find((household) => household.id === selectedId) ?? households[0]
}
