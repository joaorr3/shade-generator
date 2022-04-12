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

export type ShadeOption = { multiplier: number; value: Rgba };
export type Shades = Record<Shade, ShadeOption>;
export type ColorFormat = "rgba" | "hsl" | "hex";

export interface IShadeGenerator {
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
