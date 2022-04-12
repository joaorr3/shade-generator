import * as Models from "./models";
import * as Utils from "./utils";

export const ShadeGenerator: Models.IShadeGenerator = {
  baseColor: { r: 0, g: 0, b: 0 },
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
    const shadeKeys = Object.keys(this.shades) as Models.Shade[];
    shadeKeys.forEach((shade) => {
      this.shades[shade].multiplier = shades[shade];
    });

    return this;
  },
  hue(color) {
    const isHex = Utils.isHexColor(color);

    if (isHex && color) {
      this.baseColor = Utils.hexToRgba(color);
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
      [Models.Shade, Models.ShadeOption]
    >;
    return shadeEntries.reduce(
      (acc, [shade, option]): Record<Models.Shade, string> => {
        acc[shade] = this[colorFormat](option.value);
        return acc;
      },
      {} as Record<Models.Shade, string>
    );
  },
  generateShades() {
    const shadeKeys = Object.keys(this.shades) as Models.Shade[];
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
    const opacity = Utils.parseDecAlpha(amount);

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
    return Utils.rgbToHsv(this.currentShadeValue());
  },
  rgba(color) {
    return Utils.formatRgba(color ?? this.currentShadeValue());
  },
  hsl(color) {
    const { h, s, l } = Utils.rgbToHsl(color ?? this.currentShadeValue());
    return `hsl(${h}deg, ${s}%, ${l}%)`;
  },
  hex(color) {
    const shadeValue = color ?? this.currentShadeValue();
    return Utils.rgbaToHex(shadeValue, true, shadeValue.a !== 1);
  },
};
