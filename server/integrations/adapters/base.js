// Clase base para los adaptadores de mayoristas.
// Cada mayorista crea una subclase que implementa fetchPackages().

class BaseAdapter {
  /** @param {object} [config] credenciales/URLs del mayorista (idealmente desde env) */
  constructor(config = {}) {
    this.config = config;
  }

  /** Identificador único del mayorista. Se usa como columna `source`. */
  get source() {
    throw new Error('El adapter debe definir get source()');
  }

  /**
   * Trae los paquetes del mayorista YA normalizados.
   * @returns {Promise<import('../types').NormalizedPackage[]>}
   */
  async fetchPackages() {
    throw new Error('El adapter debe implementar fetchPackages()');
  }
}

module.exports = { BaseAdapter };
