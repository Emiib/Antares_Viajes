// Shape normalizado al que cada mayorista debe traducir sus paquetes.
// Coincide con el `TravelCard` del front (src/types/index.ts), salvo el id,
// que el backend genera como `${source}:${externalId}`.

/**
 * @typedef {Object} NormalizedPackage
 * @property {string}   externalId   ID del paquete EN el sistema del mayorista
 * @property {string}   title
 * @property {string}   destination
 * @property {string}   price        ej "USD 1.290" (string, igual que el front)
 * @property {string}  [type]        categoría: ofertas|argentina|circuitos|grupales|quinceaneras|experiencias|cruceros
 * @property {string}  [duration]
 * @property {string}  [imageUrl]
 * @property {string}  [badge]
 * @property {string}  [departure]
 * @property {string}  [people]
 * @property {string[]}[includes]
 */

module.exports = {};
