const { BaseAdapter } = require('./base');

/**
 * Adapter de EJEMPLO (mock).
 *
 * Para conectar un mayorista real: copiá este archivo, cambiá `source`,
 * y completá fetchPackages() con la llamada real (REST/SOAP/CSV). Lo único
 * que importa es que devuelva un array con el shape NormalizedPackage.
 */
class EjemploMayoristaAdapter extends BaseAdapter {
  get source() {
    return 'ejemplo-mayorista';
  }

  async fetchPackages() {
    // 👉 Acá iría la llamada real al mayorista. Por ejemplo, una API REST:
    //
    //   const res = await fetch(`${this.config.apiUrl}/paquetes`, {
    //     headers: { Authorization: `Bearer ${this.config.apiKey}` },
    //   });
    //   if (!res.ok) throw new Error(`Mayorista respondió ${res.status}`);
    //   const data = await res.json();
    //   return data.items.map((item) => this.normalize(item));
    //
    // Por ahora devolvemos datos de muestra para probar el pipeline completo:
    const raw = [
      {
        codigo: 'MX-001',
        nombre: 'Cancún All Inclusive',
        destino: 'Cancún, México',
        noches: 7,
        precioUsd: 1290,
        foto: '/branding/IsoAntares-ORIGINAL.jpg',
        incluye: ['Aéreos', 'Hotel 5★', 'Traslados', 'All inclusive'],
      },
      {
        codigo: 'BR-014',
        nombre: 'Río de Janeiro',
        destino: 'Río de Janeiro, Brasil',
        noches: 5,
        precioUsd: 980,
        foto: '/branding/IsoAntares-ORIGINAL.jpg',
        incluye: ['Aéreos', 'Hotel 4★', 'Desayuno'],
      },
    ];
    return raw.map((item) => this.normalize(item));
  }

  /** Traduce el formato propio del mayorista al shape normalizado. */
  normalize(item) {
    return {
      externalId: item.codigo,
      title: item.nombre,
      destination: item.destino,
      duration: `${item.noches} noches`,
      price: `USD ${item.precioUsd.toLocaleString('es-AR')}`,
      type: 'ofertas',
      imageUrl: item.foto,
      includes: item.incluye || [],
    };
  }
}

module.exports = { EjemploMayoristaAdapter };
