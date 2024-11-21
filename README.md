# OLYN GitHub DNS Action

This action resolves DNS records for a given PR.

## Inputs

### `cloudflare-token`

**Required** The Cloudflare API token.

### `zone-id`

**Required** The Cloudflare zone ID.

### `base-domain`

**Required** The base domain for the DNS records.

### `dns-content`

**Required** The DNS content for the DNS records.

## Example usage

```yaml
uses: olyn/github-dns-action@v1
with:
  cloudflare-token: ${{ secrets.CLOUDFLARE_TOKEN }}
  zone-id: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  base-domain: example.com
  dns-content: example.com

    steps:
      - uses: actions/checkout@v3
      - uses: olyn/github-dns-action@v1
        with:
          cloudflare-token: ${{ secrets.CLOUDFLARE_TOKEN }}
          zone-id: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
          base-domain: example.com
          dns-content: example.com
```
