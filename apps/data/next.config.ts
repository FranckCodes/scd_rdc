import path from 'path'
import type { NextConfig } from 'next'
import { fileURLToPath } from 'url'

const dirname = path.dirname(fileURLToPath(import.meta.url))

const nextConfig: NextConfig = {
  // Racine du monorepo : pnpm installe les paquets dans ../../node_modules
  turbopack: { root: path.resolve(dirname, '../..') },
  transpilePackages: ['@scd/ui'],
}

export default nextConfig
