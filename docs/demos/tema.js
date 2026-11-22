/* La paleta de los temas de Relay: el mismo codigo que la aplicacion
   (relay-host.js), copiado por tools/demos-web/capturar.mjs. No editar a mano.
   window.relayTema(hex) tiñe esta pagina; los presets en window.relayTemas. */
(() => {
const TEMA_TRIPLETES = [[255,42,58],[196,18,32],[255,90,99],[255,154,162],[255,143,152],[30,0,6],[142,14,28],[26,2,6],[255,185,189],[196,82,90],[94,8,16],[255,122,128],[122,18,25],[255,211,214],[255,107,118],[110,8,18],[255,179,185],[120,26,32],[255,120,132],[255,106,114],[255,154,161],[255,213,216],[255,120,130],[255,199,203],[255,180,186],[255,210,213],[255,76,87],[212,20,31],[240,222,223],[30,0,8],[142,64,70],[58,4,9],[122,58,64],[46,3,7],[176,85,92],[74,10,16],[138,67,72],[51,4,8],[32,0,8],[244,226,227],[255,233,234],[255,194,198]];

const TEMA_ROJO = "#FF2A3A";

const PRESETS_TEMA = [
    { id: "relay", nombre: "Relay", hex: "#FF2A3A", defecto: true },
    { id: "ember", nombre: "Ember", hex: "#FF6B2C" },
    { id: "amber", nombre: "Amber", hex: "#FFB21E" },
    { id: "lime", nombre: "Lime", hex: "#8FDB2A" },
    { id: "mint", nombre: "Mint", hex: "#22D39B" },
    { id: "aqua", nombre: "Aqua", hex: "#19C6DE" },
    { id: "ocean", nombre: "Ocean", hex: "#2E86FF" },
    { id: "indigo", nombre: "Indigo", hex: "#5A5DFF" },
    { id: "violet", nombre: "Violet", hex: "#9A4DFF" },
    { id: "orchid", nombre: "Orchid", hex: "#DD3FF2" },
    { id: "rose", nombre: "Rose", hex: "#FF4D97" },
    { id: "mono", nombre: "Mono", hex: "#B9BCC6" },
  ];

function limitar(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }

function aHex(r, g, b) {
    const d = (n) => limitar(Math.round(n), 0, 255).toString(16).padStart(2, "0");
    return ("#" + d(r) + d(g) + d(b)).toUpperCase();
  }

function deHex(texto) {
    let t = String(texto || "").trim().replace(/^#/, "");
    if (t.length === 3) {
      t = t[0] + t[0] + t[1] + t[1] + t[2] + t[2];
    }

    if (!/^[0-9a-fA-F]{6}$/.test(t)) {
      return null;
    }

    return [
      parseInt(t.slice(0, 2), 16),
      parseInt(t.slice(2, 4), 16),
      parseInt(t.slice(4, 6), 16),
    ];
  }

function temaHex(texto) {
    const c = deHex(texto);
    return c ? aHex(c[0], c[1], c[2]).toUpperCase() : null;
  }

function rgbAHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const l = (max + min) / 2;
    let h = 0;
    let s = 0;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
      h *= 60;
    }

    return [h, s * 100, l * 100];
  }

function hslARgb(h, s, l) {
    s /= 100; l /= 100;
    const k = (n) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return [f(0), f(8), f(4)].map((x) => Math.round(Math.min(1, Math.max(0, x)) * 255));
  }

function luminancia(rgb) {
    const c = rgb.map((v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  }

function baseDeTema(hex) {
    const rgb = deHex(hex) || [255, 42, 58];
    const hsl = rgbAHsl(rgb[0], rgb[1], rgb[2]);
    let l = Math.min(64, Math.max(30, hsl[2]));

    /*
      La saturacion, por el color que SE VE, no por la cuenta de HSL.

      En HSL un casi negro como #000001 tiene saturacion 100: es "azul puro"
      con la luz a cero. Al subirle la luz para que la interfaz se lea, ese
      azul que nadie veia salia intenso. Se mide el croma -cuanto color hay
      de verdad, max menos min- y la saturacion se limita a la que da ese
      mismo croma con la luz nueva: un negro o un blanco dan gris, un
      oscuro con color de verdad sigue teniendo su color.
    */
    const croma = (Math.max(...rgb) - Math.min(...rgb)) / 255;
    const hueco = 1 - Math.abs(2 * l / 100 - 1);
    const s = Math.min(hsl[1], hueco > 0 ? 100 * croma / hueco : 0);

    while (l > 30 && luminancia(hslARgb(hsl[0], s, l)) > 0.36) {
      l -= 1;
    }

    return [hsl[0], s, l];
  }

const paletasTema = new Map();

function paletaDeTema(hex) {
    const clave = (temaHex(hex) || TEMA_ROJO);
    if (paletasTema.has(clave)) {
      return paletasTema.get(clave);
    }

    let paleta;
    if (clave === TEMA_ROJO) {
      paleta = TEMA_TRIPLETES.map((c) => c.join(","));
    } else {
      const [H, S, L] = baseDeTema(clave);
      const [h0, s0, l0] = rgbAHsl(255, 42, 58);
      paleta = TEMA_TRIPLETES.map(([r, g, b]) => {
        const [h, s, l] = rgbAHsl(r, g, b);
        const h2 = (h + (H - h0) + 720) % 360;
        const s2 = Math.min(100, s * S / s0);
        const l2 = l <= l0 ? l * L / l0 : L + (l - l0) * (100 - L) / (100 - l0);
        return hslARgb(h2, s2, l2).join(",");
      });
    }

    if (paletasTema.size > 400) {
      paletasTema.clear();
    }

    paletasTema.set(clave, paleta);
    return paleta;
  }

  window.relayTemas = PRESETS_TEMA;
  window.relayTema = (hex) => {
    // Lo que cargue despues -un marco perezoso- lo lee de aqui.
    window.__relayTemaHex = hex;
    const raiz = document.documentElement;
    paletaDeTema(hex || TEMA_ROJO).forEach((v, i) => raiz.style.setProperty("--t" + i, v));
    document.querySelectorAll("iframe").forEach((f) => { try { f.contentWindow.relayTema && f.contentWindow.relayTema(hex); } catch (e) { } });
  };
  // El de la pagina que la contiene, si ya habia uno.
  try { if (parent !== window && parent.__relayTemaHex) { window.relayTema(parent.__relayTemaHex); } } catch (e) { }
})();
