# parcel-transformer-deepkit
Parcel transformer for TypeScript files with explicit support for [Deepkit Runtime Types](https://deepkit.io/library/type).

Works with both [Yarn PnP](https://yarnpkg.com/features/pnp) and `node_modules`.

Enable the transformer in `.parcelrc` - Parcel will install it automatically:
```
{
  "extends": "@parcel/config-default",
  "transformers": {
    "*.{ts,tsx}": ["parcel-transformer-deepkit"]
  }
}
```

Also - don’t forget to enable reflection in `tsconfig.json`!
```
{
  "reflection": true
}
```

See the [minimum-example](https://github.com/LEW21/parcel-transformer-deepkit/tree/main/packages/minimum-example) in case of problems.
