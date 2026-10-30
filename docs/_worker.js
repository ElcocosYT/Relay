/*
  La cara de Relay en la web.

  Casi todo lo que hay aqui son archivos quietos -la portada, la pagina de
  invitacion, el logo- y de esos se encarga Pages solo, sin pasar por aqui
  mas que de camino.

  Lo unico que no puede ser un archivo quieto es /s/CODIGO, el enlace de una
  cancion compartida: su tarjeta tiene que decir QUE cancion lleva y ensenar
  SU caratula, y eso hay que escribirlo despues de leer el codigo. Lo escribe
  el servidor de las salas, que es donde esta guardado lo que lleva cada
  enlace; aqui solo se le pregunta y se devuelve lo que conteste.

  Asi el enlace que se manda por ahi es de la misma casa que el de una sala

    relaymusic.pages.dev/s/AB12CD34
    relaymusic.pages.dev/join/#RELAY-7F3K9P

  sin perder la tarjeta, que es lo que se perderia sirviendolo desde un sitio
  de archivos quietos. Ver party/src/index.js.
*/
const SERVIDOR = "https://relay-party.relayapp.workers.dev";

export default {
  async fetch(peticion, entorno) {
    const url = new URL(peticion.url);

    if (url.pathname === "/s" || url.pathname.startsWith("/s/")) {
      const destino = new URL(url.pathname + url.search, SERVIDOR);

      /*
        Se pregunta de cero, sin arrastrar las cabeceras de quien pregunta.

        Pasandolas tal cual, lo que contesta el servidor vuelve comprimido en
        brotli y sale asi aunque el que pregunto no lo pidiera: un robot de
        chat que no sepa descomprimirlo ve basura y no pinta tarjeta, que es
        justo lo que esta puerta viene a salvar. De cero, la compresion la
        lleva Cloudflare de punta a punta, que es su trabajo.

        Y no se pierde nada: de la peticion, /s/CODIGO solo mira el camino.
      */
      return fetch(destino, { method: peticion.method });
    }

    return entorno.ASSETS.fetch(peticion);
  },
};
