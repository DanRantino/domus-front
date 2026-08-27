import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { describe, expect, it } from 'vitest'

const currentDirectory = dirname(fileURLToPath(import.meta.url))
const brandAssets = [
  resolve(currentDirectory, '../../../public/domus-mark.svg'),
  resolve(currentDirectory, '../../assets/brand/domus-logo.svg'),
  resolve(currentDirectory, '../../assets/brand/domus-mark.svg'),
  resolve(currentDirectory, '../../assets/brand/domus-wordmark.svg'),
  resolve(currentDirectory, './DomusLogo.tsx'),
]

describe('brand assets', () => {
  it.each(brandAssets)('%s contains no merge conflict markers', (assetPath) => {
    const source = readFileSync(assetPath, 'utf8')

    expect(source).not.toMatch(/^(<<<<<<<|=======|>>>>>>>)/m)
  })

  it.each(brandAssets.filter((assetPath) => assetPath.endsWith('.svg')))(
    '%s is valid SVG XML',
    (assetPath) => {
      const source = readFileSync(assetPath, 'utf8')
      const document = new DOMParser().parseFromString(source, 'image/svg+xml')

      expect(document.querySelector('parsererror')).toBeNull()
    },
  )
})
