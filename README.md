# shade-generator

#### This will output a `Record<Shade, string>`.

```typescript
const colorMap = ShadeGenerator.hue("#ff0000").shadesMap("hex");
```

#### You can use it like so.

```typescriptreact
const StyledComponent = styled.div`
  background-color: ${color['300']};
  margin: 8px;
  padding: 16px;
  border-radius: 8px;
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1;
`;
```

#### This also works.

```typescript
const color = ShadeGenerator.hue("#ff0000").shade("10").hex();
```

#### Pass a config to fine tune the output

```typescript
const config: Record<Shade, number> = {
  "10": 0.9,
  "20": 0.8,
  "30": 0.7,
  "40": 0.6,
  "50": 0.5,
  "60": 0.4,
  "70": 0.3,
  "80": 0.2,
  "90": 0.1,
  "100": 0,
  "200": 0.9,
  "300": 0.8,
  "400": 0.7,
  "500": 0.6,
  "600": 0.5,
  "700": 0.4,
  "800": 0.3,
  "900": 0.2,
  "1000": 0.1,
};

// You can, for example, change shade 50 to be "50": 0.55

const color = ShadeGenerator.hue("#ff0000").config(config).shade("10").hex();

const colorMap = ShadeGenerator.hue("#ff0000").config(config).shadesMap("hex");
```

#### Checkout other formats

```typescript
...shadesMap("rgba");
...shadesMap("hsl");
...shadesMap("hex");

...rgba();
...hsl();
...hex();
```

See it in action [here.](https://millennium-palette-generator.netlify.app/)

Enjoy ♥️
