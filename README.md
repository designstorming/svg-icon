# SVG-ICON web component

Vanilla js, custom element that provides the ability to simply load your svg icons into html DOM. It is up to the user of the component to define the accessibility and other flavors to it.

You can fork and add own logic if needed (i.e: to set the default path to the svg icons folder and append the extension so you just pass the name as `src` value).

>**Tip:**
>
>It is recommended for the SVG to have viewbox attribute but NOT the `width/height` attributes as they will be overriden.
>

## API

```html
<svg-icon src="plus.svg" size="16" [?sealed] />
```

* `src` — path to your svg file
* `size` — unitless number which represents pixels by default. It accepts also `[r]em/ex/ch` units.
* `sealed` — moves the svg inside shadowRoot. Sets on initial render and does not dynamically update afterwar.

SVG's `fill` value is set to be `currentColor` (of it's parent). So whatever text color the `svg-icon` has, it'll be passed down to the SVG.

## Result

**Regular**
```html
<svg-icon src="plus.svg" size="16">
    <svg></svg>
</svg-icon>
```

**Sealed**
```html
<svg-icon src="plus.svg" size="16" sealed>
    #shadow-root (closed)
        <!-- Base element styling -->
        <svg></svg>
</svg-icon>
```