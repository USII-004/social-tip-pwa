// types/next-pwa.d.ts
declare module 'next-pwa' {
  import { NextConfig } from 'next'

  interface PWAPluginOptions {
    dest: string
    register?: boolean
    skipWaiting?: boolean
    disable?: boolean
    runtimeCaching?: Array<any>
    buildExcludes?: Array<RegExp>
    manifest?: {
      name: string
      short_name: string
      description: string
      theme_color: string
      icons: Array<{
        src: string
        sizes: string
        type: string
      }>
    }
  }

  function withPWA(nextConfig: NextConfig, pwaConfig: PWAPluginOptions): NextConfig

  export default withPWA
}