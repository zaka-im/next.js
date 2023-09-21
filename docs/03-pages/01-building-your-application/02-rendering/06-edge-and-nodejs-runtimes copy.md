---
title: Edge and Node.js Runtimes
description: Next.js에서 전환 가능한 런타임(Edge 및 Node.js)에 대해 알아보세요.
source: app/building-your-application/rendering/edge-and-nodejs-runtimes
---

{/* DO NOT EDIT. The content of this doc is generated from the source above. To edit the content of this page, navigate to the source page in your editor. You can use the `<PagesOnly>Content</PagesOnly>` component to add content that is specific to the Pages Router. Any shared content should not be wrapped in a component. */}
{/* The content of this doc is shared between the app and pages router. You can use the `<PagesOnly>Content</PagesOnly>` component to add content that is specific to the Pages Router. Any shared content should not be wrapped in a component. */}

Next.js에서 런타임(runtime)은 실행 중에 코드에서 사용할 수 있는 라이브러리, API 및 일반적인 기능 세트를 의미합니다.

서버에서는 애플리케이션 코드의 일부를 렌더링할 수 있는 두 가지 런타임이 있습니다.

- **Node.js 런타임**(기본값)은 모든 Node.js API 및 생태계의 호환 패키지에 액세스할 수 있습니다.
- **Edge 런타임**은 [Web API](/docs/app/api-reference/edge)를 기반으로 합니다.

## 런타임 차이점

런타임을 선택할 때 고려해야 할 사항이 많습니다. 이 표는 주요 차이점을 한눈에 보여줍니다. 차이점에 대한 자세한 분석이 필요하면 아래 섹션을 확인하세요.

|                                                                                                                                                     | Node   | Serverless | Edge             |
| --------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | ---------- | ---------------- |
| [Cold Boot](https://vercel.com/docs/concepts/get-started/compute#cold-and-hot-boots?utm_source=next-site&utm_medium=docs&utm_campaign=next-website) | /      | ~250ms     | 즉시             |
| [HTTP Streaming](/docs/app/building-your-application/routing/loading-ui-and-streaming)                                                              | 가능   | 가능       | 가능             |
| IO                                                                                                                                                  | 모두   | 모두       | `fetch`          |
| 확장성                                                                                                                                             | /      | 높음       | 최고             |
| 보안                                                                                                                                                | 일반   | 높음       | 높음             |
| 지연 시간                                                                                                                                           | 일반   | 낮음       | 최저             |
| npm 패키지                                                                                                                                          | 모두   | 모두       | 더 작은 하위 집합 |

### Edge 런타임

Next.js에서 가벼운 Edge 런타임은 사용 가능한 Node.js API의 하위 집합입니다.

Edge 런타임은 작은, 간단한 함수로 낮은 지연 시간으로 동적이고 개인화된 콘텐츠를 제공해야 하는 경우 이상적입니다. Edge 런타임의 속도는 리소스 사용의 최소화에서 비롯되지만, 이는 많은 시나리오에서 제한적일 수 있습니다.

예를 들어, Vercel에서 Edge 런타임에서 실행되는 코드는 [1MB에서 4MB 사이](https://vercel.com/docs/concepts/limits/overview#edge-middleware-and-edge-functions-size)여야 하며, 이 제한에는 가져온 패키지, 글꼴 및 파일이 포함되며 배포 인프라에 따라 다릅니다.

### Node.js 런타임

Node.js 런타임을 사용하면 모든 Node.js API와 이를 기반으로 하는 모든 npm 패키지에 액세스할 수 있습니다. 그러나 라우트를 사용하는 Edge 런타임보다 시작하는 데 시간이 더 걸립니다.

Next.js 애플리케이션을 Node.js 서버에 배포하려면 인프라를 관리, 확장 및 구성해야 합니다. 또는 Vercel과 같은 서버리스 플랫폼에 Next.js 애플리케이션을 배포할 수 있습니다. 이 경우 Vercel이 이 모든 작업을 처리합니다.

### Serverless Node.js

서버리스는 Edge 런타임보다 복잡한 계산 부하를 처리할 수 있는 확장 가능한 솔루션이 필요한 경우 이상적입니다. 예를 들어, Vercel의 Serverless Functions의 경우 가져온 패키지, 글꼴 및 파일을 포함하여 [50MB](https://vercel.com/docs/concepts/limits/overview#serverless-function-size) 이내의 코드 크기를 가질 수 있습니다.

Edge 런타임과 비교했을 때 Serverless Functions은 요청을 처리하기 전에 부팅하는 데 수백 밀리초가 걸릴 수 있습니다. 사이트가 받는 트래픽의 양에 따라 이는 자주 발생할 수 있으며, 함수가 자주 "워밍(warm)"되지 않기 때문입니다.

<AppOnly>

## 예제

### 세그먼트 런타임 옵션

Next.js 애플리케이션에서 개별 라우트 세그먼트에 대한 런타임을 지정할 수 있습니다. 이를 위해 [변수 `runtime`을 선언하고 내보냅니다](/docs/app/api-reference/file-conventions/route-segment-config). 변수는 문자열이어야 하며, `'nodejs'` 또는 `'edge'` 런타임의 값을 가져야 합니다.

다음 예제는 `runtime`의 값을 `'edge'`로 설정하는 페이지 라우트 세그먼트를 보여줍니다.

```tsx filename="app/page.tsx" switcher
export const runtime = 'edge' // 'nodejs' (기본값) | 'edge'
```

모든 세그먼트에 대해 런타임을 정의할 수도 있습니다. 이렇게 하면 레이아웃 수준에서 `runtime`을 정의할 수 있으며, 이는 레이아웃 아래의 모든 라우트가 Edge 런타임에서 실행되도록 합니다.

```tsx filename="app/layout.tsx" switcher
export const runtime = 'edge' // 'nodejs' (기본값) | 'edge'
```

세그먼트 런타임이 설정되지 않은 경우 기본값인 `nodejs` 런타임이 사용됩니다. 런타임을 변경할 계획이 없다면 `runtime` 옵션을 사용할 필요가 없습니다.

</AppOnly>

> 사용 가능한 API의 전체 목록은 [Node.js 문서](https://nodejs.org/docs/latest/api/)와 [Edge 문서](/docs/app/api-reference/edge)를 참조하세요. 배포 인프라에 따라 두 런타임 모두 [스트리밍](/docs/app/building-your-application/routing/loading-ui-and-streaming)을 지원할 수도 있습니다.

## EXP 대응

1. 서버에서 랜더링하기 위해 런타임 선택지가 **edge**와 **nodejs**로 나뉘어져 있습니다.
2. 코드 크기의 제한이 정해져 있는 edge 런타임의 특성상, 보통 GDS라는 큰 패키지를 사용하는 저희는 **edge 런타임을 사용하기 제한적일 듯**합니다.
