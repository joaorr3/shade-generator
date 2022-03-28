export type Rgba = {
  r: number;
  g: number;
  b: number;
  a?: number | null;
};

export type Hsv = {
  h: number;
  s: number;
  v: number;
};

const clamp = (val: number, min: number, max: number) => {
  return Math.min(Math.max(val, min), max);
};

export const hexOpacityToAlpha = (hexAlpha: string): number => {
  const alphaHexToDec = parseInt(hexAlpha, 16);
  const alpha = +(((alphaHexToDec / 255) * 1000) / 1000).toFixed(2);
  return alpha;
};

export const hexToRgba = (hexColor: string) => {
  const rdx = 16;
  const hasHash = hexColor[0] === "#";

  const rgba: Rgba = { r: 0, g: 0, b: 0, a: 1 };

  //Remove hashtag if present
  const hex = hasHash ? hexColor.substring(1) : hexColor;

  const shortHand = hex.length === 3;
  const longHand = hex.length === 6;
  const hasAlpha = hex.length === 8;

  if (shortHand) {
    rgba.r = +parseInt(`${hex[0]}${hex[0]}`, rdx);
    rgba.g = +parseInt(`${hex[1]}${hex[1]}`, rdx);
    rgba.b = +parseInt(`${hex[2]}${hex[2]}`, rdx);
    rgba.a = 1;
  } else if (longHand) {
    rgba.r = +parseInt(`${hex[0]}${hex[1]}`, rdx);
    rgba.g = +parseInt(`${hex[2]}${hex[3]}`, rdx);
    rgba.b = +parseInt(`${hex[4]}${hex[5]}`, rdx);
    rgba.a = 1;
  } else if (hasAlpha) {
    rgba.r = +parseInt(`${hex[0]}${hex[1]}`, rdx);
    rgba.g = +parseInt(`${hex[2]}${hex[3]}`, rdx);
    rgba.b = +parseInt(`${hex[4]}${hex[5]}`, rdx);
    rgba.a = hexOpacityToAlpha(`${hex[6]}${hex[7]}`);
  }

  return rgba;
};

export const parseDecAlpha = (decAlpha: number) =>
  decAlpha > 1 ? 1 : decAlpha < 0 ? 0 : decAlpha;

export const decToHex = (val: number, isAlpha = false) => {
  const v = isAlpha ? parseDecAlpha(val) * 255 : val;
  var value = Math.round(clamp(v, 0, 255));
  var hex = value.toString(16);
  return hex.length === 1 ? `0${hex}` : hex;
};

export const rgbaToHex = (rgba: Rgba, hash?: boolean, withAlpha = false) => {
  const { r, g, b, a } = rgba;

  const hexR = decToHex(r);
  const hexG = decToHex(g);
  const hexB = decToHex(b);
  const hexA = a ? decToHex(a, true) : "";

  const hexColor = withAlpha
    ? `${hexR}${hexG}${hexB}${hexA}`
    : `${hexR}${hexG}${hexB}`;

  const hex = hash ? `#${hexColor}` : hexColor;

  return hex.toUpperCase();
};

export const rgbToHsl = (rgba: Rgba) => {
  // Hue - Saturation - Luminosity
  const r = rgba.r / 255;
  const g = rgba.g / 255;
  const b = rgba.b / 255;
  const min = Math.min(r, g, b);
  const max = Math.max(r, g, b);
  const delta = max - min;
  let h = 0;
  let s = 0;
  let l = 0;

  if (max === min) h = 0;
  else if (r === max) h = (g - b) / delta;
  else if (g === max) h = 2 + (b - r) / delta;
  else if (b === max) h = 4 + (r - g) / delta;

  h = Math.min(h * 60, 360);

  if (h < 0) h += 360;

  l = (min + max) / 2;

  if (max === min) s = 0;
  else if (l <= 0.5) s = delta / (max + min);
  else s = delta / (2 - max - min);

  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
};

const rgbToHsv = (rgba: Rgba) => {
  // Hue - Saturation - Value
  const r = rgba.r;
  const g = rgba.g;
  const b = rgba.b;
  const min = Math.min(r, g, b);
  const max = Math.max(r, g, b);
  const delta = max - min;
  let h = 0;
  let s = 0;
  let v = 0;

  if (max === 0) s = 0;
  else s = ((delta / max) * 1000) / 10;

  if (max === min) h = 0;
  else if (r === max) h = (g - b) / delta;
  else if (g === max) h = 2 + (b - r) / delta;
  else if (b === max) h = 4 + (r - g) / delta;

  h = Math.min(h * 60, 360);

  if (h < 0) h += 360;

  v = ((max / 255) * 1000) / 10;

  return { h: Math.round(h), s: Math.round(s), v: Math.round(v) };
};

export const isHexColor = (color?: string, strict: boolean = true) => {
  const hasHash = color?.[0] === "#";
  const hex = hasHash ? color.substring(1) : color;
  const longHand = hex?.length === 6;

  const pattern = strict
    ? /^#([a-f0-9]{3,4}|[a-f0-9]{4}(?:[a-f0-9]{2}){1,2})\b$/i
    : /#([a-f0-9]{3}|[a-f0-9]{4}(?:[a-f0-9]{2}){0,2})\b/gi;

  return color?.match(pattern) !== null && longHand;
};

const luminance = (rgba: Rgba) => {
  const { r, g, b } = rgba;
  var sRGB = [r, g, b].map(function (value) {
    value /= 255;
    return value <= 0.03928
      ? value / 12.92
      : Math.pow((value + 0.055) / 1.055, 2.4);
  });
  return sRGB[0] * 0.2126 + sRGB[1] * 0.7152 + sRGB[2] * 0.0722;
};

export const contrastRatio = (foreground: Rgba, background: Rgba) => {
  var L1 = luminance(foreground);
  var L2 = luminance(background);
  return (
    Math.round(((Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05)) * 100) /
    100
  );
};

export type Shade =
  | "10"
  | "20"
  | "30"
  | "40"
  | "50"
  | "60"
  | "70"
  | "80"
  | "90"
  | "100"
  | "200"
  | "300"
  | "400"
  | "500"
  | "600"
  | "700"
  | "800"
  | "900"
  | "1000";

type ShadeOption = { multiplier: number; value: Rgba };
export type Shades = Record<Shade, ShadeOption>;
type ColorFormat = "rgba" | "hsl" | "hex";

interface IShadeGenerator {
  baseColor: Rgba;
  shades: Shades;
  currentShade: Shade;
  currentShadeValue(): Rgba;
  config(shades: Record<Shade, number>): IShadeGenerator;
  /**
   *
   * @param color : Can be both hex or rgba;
   */
  hue(color?: string): IShadeGenerator;
  shade(shade: Shade): IShadeGenerator;
  shadesMap(colorFormat: ColorFormat): Record<Shade, string>;
  generateShade(shade: Shade): Rgba;
  generateShades(): void;
  opacity(amount: number): IShadeGenerator;
  hsv(): Hsv;
  rgba(color?: Rgba): string;
  hsl(color?: Rgba): string;
  hex(color?: Rgba): string;
}

export const formatRgba = ({ r, g, b, a }: Rgba) => {
  if (a === undefined || a === null) {
    return `rgb(${r}, ${g}, ${b})`;
  }
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};

const ShadeGenerator: IShadeGenerator = {
  baseColor: { r: 0, g: 0, b: 0, a: 1 },
  shades: {
    "10": { multiplier: 0.9, value: { r: 0, g: 0, b: 0, a: 1 } },
    "20": { multiplier: 0.8, value: { r: 0, g: 0, b: 0, a: 1 } },
    "30": { multiplier: 0.7, value: { r: 0, g: 0, b: 0, a: 1 } },
    "40": { multiplier: 0.6, value: { r: 0, g: 0, b: 0, a: 1 } },
    "50": { multiplier: 0.5, value: { r: 0, g: 0, b: 0, a: 1 } },
    "60": { multiplier: 0.4, value: { r: 0, g: 0, b: 0, a: 1 } },
    "70": { multiplier: 0.3, value: { r: 0, g: 0, b: 0, a: 1 } },
    "80": { multiplier: 0.2, value: { r: 0, g: 0, b: 0, a: 1 } },
    "90": { multiplier: 0.1, value: { r: 0, g: 0, b: 0, a: 1 } },
    "100": { multiplier: 0, value: { r: 0, g: 0, b: 0, a: 1 } },
    "200": { multiplier: 0.9, value: { r: 0, g: 0, b: 0, a: 1 } },
    "300": { multiplier: 0.8, value: { r: 0, g: 0, b: 0, a: 1 } },
    "400": { multiplier: 0.7, value: { r: 0, g: 0, b: 0, a: 1 } },
    "500": { multiplier: 0.6, value: { r: 0, g: 0, b: 0, a: 1 } },
    "600": { multiplier: 0.5, value: { r: 0, g: 0, b: 0, a: 1 } },
    "700": { multiplier: 0.4, value: { r: 0, g: 0, b: 0, a: 1 } },
    "800": { multiplier: 0.3, value: { r: 0, g: 0, b: 0, a: 1 } },
    "900": { multiplier: 0.2, value: { r: 0, g: 0, b: 0, a: 1 } },
    "1000": { multiplier: 0.1, value: { r: 0, g: 0, b: 0, a: 1 } },
  },
  currentShade: "100",
  config(shades) {
    const shadeKeys = Object.keys(this.shades) as Shade[];
    shadeKeys.forEach((shade) => {
      this.shades[shade].multiplier = shades[shade];
    });

    return this;
  },
  hue(color) {
    const isHex = isHexColor(color);

    if (isHex && color) {
      this.baseColor = hexToRgba(color);
    } else {
      throw new Error(`The color: ${color}  you provided is not valid`);
    }

    this.generateShades();

    return this;
  },
  shade(shade) {
    this.currentShade = shade;

    return this;
  },
  shadesMap(colorFormat) {
    const shadeEntries = Object.entries(this.shades) as Array<
      [Shade, ShadeOption]
    >;
    return shadeEntries.reduce(
      (acc, [shade, option]): Record<Shade, string> => {
        acc[shade] = this[colorFormat](option.value);
        return acc;
      },
      {} as Record<Shade, string>
    );
  },
  generateShades() {
    const shadeKeys = Object.keys(this.shades) as Shade[];
    shadeKeys.forEach((shade) => {
      this.shades[shade].value = this.generateShade(shade);
    });
  },
  generateShade(shade) {
    const { r, g, b, a } = this.baseColor;

    if (+shade > 100) {
      //shade
      return {
        r: +(r * this.shades[shade].multiplier).toFixed(0),
        g: +(g * this.shades[shade].multiplier).toFixed(0),
        b: +(b * this.shades[shade].multiplier).toFixed(0),
        a,
      };
    } else if (+shade < 100) {
      //tint
      return {
        r: +(r + (255 - r) * this.shades[shade].multiplier).toFixed(0),
        g: +(g + (255 - g) * this.shades[shade].multiplier).toFixed(0),
        b: +(b + (255 - b) * this.shades[shade].multiplier).toFixed(0),
        a,
      };
    } else {
      return this.baseColor;
    }
  },
  opacity(amount) {
    const opacity = parseDecAlpha(amount);

    const shadeValue = this.shades[this.currentShade].value;

    this.shades[this.currentShade].value = {
      ...shadeValue,
      a: +opacity.toFixed(2),
    };
    return this;
  },
  currentShadeValue() {
    return this.shades[this.currentShade].value;
  },
  hsv() {
    return rgbToHsv(this.currentShadeValue());
  },
  rgba(color) {
    return formatRgba(color ?? this.currentShadeValue());
  },
  hsl(color) {
    const { h, s, l } = rgbToHsl(color ?? this.currentShadeValue());
    return `hsl(${h}deg, ${s}%, ${l}%)`;
  },
  hex(color) {
    const shadeValue = color ?? this.currentShadeValue();
    return rgbaToHex(shadeValue, true, shadeValue.a !== 1);
  },
};

export default ShadeGenerator;
