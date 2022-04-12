import * as Models from "./models";

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

  const rgba: Models.Rgba = { r: 0, g: 0, b: 0, a: 1 };

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

export const rgbaToHex = (
  rgba: Models.Rgba,
  hash?: boolean,
  withAlpha = false
) => {
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

export const rgbToHsl = (rgba: Models.Rgba) => {
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

export const rgbToHsv = (rgba: Models.Rgba) => {
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

const luminance = (rgba: Models.Rgba) => {
  const { r, g, b } = rgba;
  var sRGB = [r, g, b].map(function (value) {
    value /= 255;
    return value <= 0.03928
      ? value / 12.92
      : Math.pow((value + 0.055) / 1.055, 2.4);
  });
  return sRGB[0] * 0.2126 + sRGB[1] * 0.7152 + sRGB[2] * 0.0722;
};

export const contrastRatio = (
  foreground: Models.Rgba,
  background: Models.Rgba
) => {
  var L1 = luminance(foreground);
  var L2 = luminance(background);
  return (
    Math.round(((Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05)) * 100) /
    100
  );
};

export const formatRgba = ({ r, g, b, a }: Models.Rgba) => {
  if (a === undefined || a === null) {
    return `rgb(${r}, ${g}, ${b})`;
  }
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};
