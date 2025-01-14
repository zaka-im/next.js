import type {
  AppType,
  DocumentType,
  NextComponentType,
} from '../shared/lib/utils'
import type { ClientReferenceManifest } from '../build/webpack/plugins/flight-manifest-plugin'
import type {
  PageConfig,
  GetStaticPaths,
  GetServerSideProps,
  GetStaticProps,
} from 'next/types'
import type { RouteModule } from './future/route-modules/route-module'

import { BUILD_MANIFEST } from '../shared/lib/constants'
import { join } from 'path'
import { BuildManifest } from './get-page-files'
import { interopDefault } from '../lib/interop-default'
import { getTracer } from './lib/trace/tracer'
import { LoadComponentsSpan } from './lib/trace/constants'
import { loadManifestWithRetries } from './load-components'
export type ManifestItem = {
  id: number | string
  files: string[]
}

export type ReactLoadableManifest = { [moduleId: string]: ManifestItem }

export type LoadComponentsReturnType = {
  Component: NextComponentType
  pageConfig: PageConfig
  buildManifest: BuildManifest
  subresourceIntegrityManifest?: Record<string, string>
  reactLoadableManifest: ReactLoadableManifest
  clientReferenceManifest?: ClientReferenceManifest
  serverActionsManifest?: any
  Document: DocumentType
  App: AppType
  getStaticProps?: GetStaticProps
  getStaticPaths?: GetStaticPaths
  getServerSideProps?: GetServerSideProps
  ComponentMod: any
  routeModule?: RouteModule
  isAppPath?: boolean
  pathname: string
}

async function loadDefaultErrorComponentsImpl(
  distDir: string
): Promise<LoadComponentsReturnType> {
  const Document = interopDefault(require('next/dist/pages/_document'))
  const AppMod = require('next/dist/pages/_app')
  const App = interopDefault(AppMod)

  // Load the compiled route module for this builtin error.
  // TODO: (wyattjoh) replace this with just exporting the route module when the transition is complete
  const ComponentMod =
    require('./future/route-modules/pages/builtin/_error') as typeof import('./future/route-modules/pages/builtin/_error')
  const Component = ComponentMod.routeModule.userland.default

  return {
    App,
    Document,
    Component,
    pageConfig: {},
    buildManifest: await loadManifestWithRetries(
      join(distDir, `fallback-${BUILD_MANIFEST}`)
    ),
    reactLoadableManifest: {},
    ComponentMod,
    pathname: '/_error',
    routeModule: ComponentMod.routeModule,
  }
}
export const loadDefaultErrorComponents = getTracer().wrap(
  LoadComponentsSpan.loadDefaultErrorComponents,
  loadDefaultErrorComponentsImpl
)
