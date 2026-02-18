// ============================================================
// Helpers SDK — alignés avec le comportement réel de HorusPay
// ============================================================
//
// COMPORTEMENT SDK (source confirmé) :
//   - _retrieve()  → retourne déjà l'objet (object[className])
//   - _create()    → retourne déjà l'objet (object[className])
//   - _update()    → retourne déjà l'objet (object[className])
//   - _all()       → retourne HorusPayObject | HorusPayObject[]
//                    (peut être array direct OU { data: [...], pagination: {...} })
//
// Les propriétés sont dynamiques sur HorusPayObject → cast via Object.assign
// ============================================================

/**
 * Extrait les informations d'erreur d'une exception SDK HorusPay.
 * L'erreur est une instance de ApiConnectionError ou InvalidRequest.
 */
export function extractError(e: unknown): {
  error: string;
  details?: Record<string, string[]>;
} {
  if (e && typeof e === 'object') {
    const err = e as Record<string, unknown>;

    // Message d'erreur API (ex: "Email already taken")
    const message =
      (err['errorMessage'] as string) ||
      (err['message'] as string) ||
      'Une erreur inattendue est survenue';

    // Erreurs de validation (ex: { email: ["is invalid"] })
    const details = err['errors'] as Record<string, string[]> | undefined;

    return { error: message, details };
  }
  return { error: 'Erreur inconnue' };
}

/**
 * Extrait un objet unique retourné par retrieve/create/update.
 * Le SDK retourne déjà l'objet métier directement (après extraction de object[className]).
 * On convertit le HorusPayObject dynamique en objet JS pur via sérialisation.
 */
export function extractObject<T>(raw: unknown): T {
  if (!raw || typeof raw !== 'object') return raw as T;

  // HorusPayObject a des propriétés dynamiques — on les collecte
  const result: Record<string, unknown> = {};
  const obj = raw as Record<string, unknown>;

  for (const key of Object.keys(obj)) {
    const val = obj[key];
    if (typeof val !== 'function') {
      result[key] = val;
    }
  }

  return result as T;
}

/**
 * Extrait une liste retournée par .all().
 * Le SDK peut retourner :
 *   - un array directement → [item1, item2, ...]
 *   - un objet wrapper    → { data: [...], pagination: {...} }
 *   - un objet unique (rare)
 */
export function extractList<T>(raw: unknown): T[] {
  if (!raw) return [];

  // Cas 1 : array direct
  if (Array.isArray(raw)) {
    return raw.map((item) => extractObject<T>(item));
  }

  // Cas 2 : objet wrapper { data: [...] }
  const obj = raw as Record<string, unknown>;
  if (obj['data'] && Array.isArray(obj['data'])) {
    return (obj['data'] as unknown[]).map((item) => extractObject<T>(item));
  }

  // Cas 3 : objet unique (edge case)
  const single = extractObject<T>(raw);
  if (single && typeof single === 'object' && Object.keys(single).length > 0) {
    return [single];
  }

  return [];
}

/**
 * Formate un message d'erreur lisible à partir des détails de validation.
 */
export function formatValidationErrors(
  details?: Record<string, string[]>
): string | undefined {
  if (!details) return undefined;
  return Object.entries(details)
    .map(([field, msgs]) => `${field}: ${msgs.join(', ')}`)
    .join(' | ');
}
