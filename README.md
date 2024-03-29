# 프론트엔드 아키텍쳐 FSD (Feature-Sliced Design, FSD)

## 들어가며

프론트엔드 개발자는 종종 어플리케이션 아키텍쳐와 관련된 문제에 직면하고는 합니다. 제 경우에서도 프로젝트를 할 때마다 아키텍쳐를 구성하는데 있어 큰 어려움을 겪곤 했습니다. 특히, 개발자 사이에서도 다른 방식으로 개발을 진행해왔다보니 아키텍쳐를 구성하는데 커뮤니케이션 비용이 들기도 했습니다.

아키텍쳐는 모듈간의 결합과 높은 응집력을 제공할 필요가 있고, 쉽게 확장할 수 있어야 합니다. 이 Repository는 기능 분할 설계(Feature-Sliced Design, FSD) 아키텍쳐를 쉽게 적용할 수 있도록 탬플릿으로 제공하고 있습니다.

FSD란 무엇이며, 이 아키텍쳐 방법론이 해결되는 문제를 이야기하고, FSD를 기존 아키텍쳐 및 모듈식 아키텍쳐와 비교한 후 장단점에 대해 소개하겠습니다.

우선, 레이어(layer), 슬라이스(slice), 세그먼트(segment) 세 가지 개념을 알아봅시다.

![레이어, 슬라이스, 세그먼트](https://github.com/haejunejung/FSD_template/assets/99087502/af543c02-eaf8-4b69-9cb8-35607887b5c5)

## 레이어

레이어는 최상위 디렉토리이자 애플리케이션 분해의 첫 번째 단계입니다. 현재 deprecated된 processes를 제외한 6개의 디렉토리로 구분되어 있습니다.

![디렉토리 구조](https://github.com/haejunejung/FSD_template/assets/99087502/f04754ab-31d1-4a82-84c5-98ea8869d45b)

각 레이어에는 고유한 책임 영역이 있는데요. 이는 *비즈니스 지향적*입니다. 각 레이어를 개별적으로 살펴보겠습니다.

- app : 애플리케이션 로직이 초기화되는 곳으로, Provider, Router, Global Style, Global Type ... 등이 여기에서 정의됩니다. 애플리케이션의 진입점 역할을 합니다.

- pages : 애플리케이션의 페이지가 포함됩니다.

- widgets : 페이지에 사용되는 독립적인 UI 컴포넌트입니다.

- features : 비즈니스 가치를 전달하는 사용자 시나리오와 기능을 다룹니다. ex. 좋아요, 리뷰 작성, 제품 평가등이 있으며 이는 선택적 레이어입니다.

- entities : 비즈니스 엔티티를 나타내며 사용자, 리뷰, 댓글 등이 포함될 수 있습니다. 이 레이어 역시 선택적 레이어입니다.

- shared : 특정 비즈니스 로직에 종속되지 않은 재사용 가능한 컴포넌트와 유틸리티가 포함되어 있습니다. 여기에는 UI 키트, axios 설정, 애플리케이션 설정, 비즈니스 로직에 묶이지 않은 helper 등이 포함됩니다.

이러한 레이어들은 코드베이스를 조직화하고, 모듈화되고 유지보수 용이한 확장 가능한 아키텍쳐를 촉진하는데 도움이 됩니다.

![아키텍쳐](https://github.com/haejunejung/FSD_template/assets/99087502/5da6d592-749c-4722-9de1-ac5298dc4396)

기능 분할 설계의 주요 특징 중 하나는 계층 구조입니다. 이 구조에서 features 레이어가 entities 레이어보다 더 위에 있기 때문에 entities 레이어는 features 레이어의 기능을 사용할 수 없습니다. 마찬가지로 features 레이어는 widgets 레이어의 컴포넌트를 사용할 수 없으며, 위 레이어는 아래 레이어만 활용할 수 있습니다. 이는 한 방향으로만 향하는 선형적인 흐름을 유지하기 위함입니다.

![아키텍쳐](https://github.com/haejunejung/FSD_template/assets/99087502/32f9742f-846c-48f5-aea2-66c6eb4bb1f7)

계층 구조에서 레이어의 위치가 낮을수록 더 많은 곳에서 사용될 가능성이 높기 때문에, 레이어를 변경하는 것이 더 위험합니다. 예를 들어 shared 레이어의 UI키트는 features, widgets, 심지어 pages 레이어에서도 사용됩니다.

## 슬라이스

각 레이어에는 애플리케이션의 두 번째 수준인 슬라이스라는 하위 디렉토리가 존재합니다. 슬라이스에서 연결은 추상적인 것이 아닌, 특정 비즈니스 엔티티에 대한 것입니다. 슬라이스의 주요 목표는 코드를 값별로 그룹화하는 것입니다.

슬라이스 이름은 프로젝트 비즈니스 영역에 따라 직접 결정되므로 표준화되어 있지 않습니다. ex. 사진 갤러리에는 사진, 앨범, 갤러리와 같은 섹션이 있을 수 있습니다. 소셜 네트워크에는 게시물, 사용자, 뉴스피드와 같은 슬라이스가 필요할 수 있습니다.

밀접하게 관련된 조각들은 구조적으로 디렉토리 내에 그룹지을 수 있지만, 다른 슬라이스와 동일한 격리 규칙을 준수해야 하며, 이 디렉토리에 있는 코드는 직접적으로 공유되지 않아야 합니다.

## 세그먼트

각 슬라이스는 세그먼트로 구성됩니다. 세그먼트는 목적에 따라 슬라이스 내의 코드를 나누는데 도움이 됩니다. 팀의 합의에 따라 세그먼트 구성과 이름이 변경될 수 있습니다. 일반적으로 사용되는 세그먼트들은 다음과 같습니다.

- api : 필요한 서버 요청
- UI : 슬라이스의 UI 컴포넌트
- model : 비즈니스 로직, 즉 상태와의 상호 작용 actions 및 selectors가 이에 해당
- lib : 슬라이스 내에서 사용되는 보조 기능
- config : 슬라이스에 필요한 구성값이지만 구성 세그먼트는 거의 필요하지 않음
- consts : 필요한 상수

## 공개 API

각 슬라이스와 세그먼트에는 공개 API가 있습니다. 공개 API는 index 파일이며, 이 파일을 통해 슬라이스 또는 세그먼트에서 필요한 기능만 외부로 추출하고 불필요한 기능은 격리할 수 있습니다. 인덱스 파일은 진입점 역할을 합니다.

공개 API에 대한 규칙은 다음과 같습니다.

- 애플리케이션 슬라이스와 세그먼트는 공개 API 인덱스 파일에 정의된 슬라이스의 기능과 컴포넌트만 사용합니다.
- 공개 API에 정의되지 않은 슬라이스 또는 세그먼트의 내부 부분은 격리된 것으로 간주되며 슬라이스 또는 세그먼트 내부에서만 접근할 수 있습니다.

공개 API는 import 및 export로 단순하게 작동하므로 애플리케이션을 변경할 때 코드의 모든 곳에서 import를 변경할 필요가 없습니다.

![공개 API](https://github.com/haejunejung/FSD_template/assets/99087502/b645baf6-e033-4f4a-94da-153313aacda6)

## 아키텍쳐에 대해 더 자세히 알아보기

### 추상화 및 비즈니스 로직

계층이 높은 레이어일수록 특정 비즈니스 노드에 더 많이 종속되고, 더 많은 비즈니스 로직이 포함됩니다. 계층이 낮은 레이어일수록 추상화 수준이 높고 재사용성이 높으며 레이어 자체의 자율성이 적습니다.

![추상화 및 비즈니스 로직](https://github.com/haejunejung/FSD_template/assets/99087502/fe297ce9-0419-4337-ac9f-8fd87a06dcf6)

### FSD가 문제를 해결하는 방식

기능 분할 설계의 과제 중 하나는 결합을 느슨하게 하고 응집력을 높이는 것입니다. FSD가 이러한 결과를 어떻게 달성하는지 이해하는 것은 중요합니다.

OOP에서는 다형성(polymorphism), 캡슐화(encapsulation), 상속(inheritance) 및 추상화(abstraction)과 같은 개념을 통해 이러한 문제를 오랜 시간동안 해결해왔습니다. 이러한 개념들은 코드의 격리, 재사용성 그리고 다양한 결과를 보장합니다. 이는 컴포넌트나 기능이 어떻게 사용되느냐에 따라 다른 결과를 얻을 수 있도록 합니다.

기능 분할 설계는 이러한 원칙들을 프론트엔드에 적용하는데 도움을 줍니다. 추상화와 다형성은 레이어를 통해 달성됩니다. 낮은 레이어는 더 추상화되어있기 때문에 더 높은 레이어에서 재사용될 수 있으며, 특정한 매개변수나 속성에 따라 컴포넌트나 기능이 다르게 작동할 수 있습니다.

캡슐화는 슬라이스와 세그먼트 외부에서 필요하지 않은 것을 격리시키는 공개 API를 통해 달성됩니다. 슬라이스의 내부 세그먼트에 대한 접근은 제한되며, 공개 API는 슬라이스 또는 세그먼트의 기능 및 컴포넌트에 접근할 수 있는 유일한 방법입니다.

상속 또한 레이어를 통해 달성됩니다. 더 높은 레이어는 낮은 레이어를 재사용할 수 있습니다.

### 고전적 아키텍쳐와 비교

고전적인 아키텍쳐에서의 명확한 표준와 기준이 없지만, 일반적으로 다음과 같은 형식을 볼 수 있습니다.
![고전적인 아키텍쳐](https://github.com/haejunejung/FSD_template/assets/99087502/0dcb0069-d3b1-48c2-96a0-1bfe7b10c865)

고전적인 아키텍쳐에는 눈에 띄는 단점이 존재합니다. 가장 큰 단점은 컴포넌트 간의 암묵적인 연결과 모듈의 복잡성 때문에 프로젝트가 유지보수하기 어려워진다는 것입니다. 고전적인 아키텍쳐의 단점은 시간이 흐를수록 더욱 분명해집니다. 프로젝트가 진화할수록 애플리케이션 아키텍쳐는 엉망진창이 되어 버립니다.

### 단순한 모듈식 아키텍쳐와 비교

단순한 모듈식 아키텍쳐에는 몇 가지 단점이 있습니다.

- 기능을 어떤 모듈이나 컴포넌트에 넣을지 명확하지 않을 때가 있습니다.
- 다른 모듈 내에서 모듈 사용에 어려움이 있습니다.
- 비즈니스 엔티티를 저장하는데 문제가 있습니다.
- 글로벌 함수의 암시적 종속성으로 인해 구조가 복잡해집니다.

복잡하거나 적당히 복잡한 프로젝트의 경우, 단순한 모듈식 아키텍처보다 기능 분할 설계를 선호해야 합니다. FSD는 많은 근본적인 아키텍처 문제를 해결하며 단점도 거의 없습니다.

단순함 및 개발 속도 측면에서 단순 모듈식 아키텍처가 FSD보다 유리할 수 있습니다. MVP가 필요하거나 수명이 짧은 프로젝트를 개발하는 경우에는 단순한 모듈식 아키텍처가 FSD보다 적합할 수 있습니다. 하지만 그 외의 경우에는 기능 분할 설계가 더 바람직해 보입니다.

## 기능 분할 설계의 잠재력

FSD는 비교적 젊은 소프트웨어 아키텍처 방법론입니다. 그러나 이미 많은 은행, 핀테크, B2B, 전자상거래 등 다양한 기업들에서 사용되고 있습니다. 이 관련 기업 목록은 [Github Issue](https://github.com/feature-sliced/documentation/issues/131)에서 확인할 수 있습니다.

이 아키텍처의 잠재력은 매우 높게 평가되며, 전 세계의 다양한 대형 기업들 사이에서 널리 사용되고 있습니다. 적절한 도입이 이루어진다면, FSD는 프런트엔드 개발 분야에서 주도적인 아키텍처 솔루션으로 성장할 수 있는 잠재력을 가지고 있습니다.

## 아키텍쳐의 장점과 단점

### 장점

- 아키텍쳐 구성 요소를 쉽게 교체, 추가, 제거할 수 있습니다.
- 아키텍쳐의 표준화
- 확장성
- 방법론은 개발 스택과 독립적입니다.
- 예기치 않은 부작용 없이 모듈 간의 연결이 제어되고 명시적입니다.
- 아키텍쳐 방법론은 비즈니스 지향적입니다.

### 단점

- 다른 많은 아키텍쳐 솔루션들에 비해 높은 진입 장벽이 있습니다.
- 인식, 팀 문화 및 개념 준수가 필요합니다.
- 도전 과제와 문제를 나중이 아닌 즉시 해결해야 합니다. 코드 문제와 개념에서 벗어난 부분을 즉시 확인할 수 있습니다. 그러나 이는 장점으로도 볼 수 있습니다.

## 결론

기능 분할 설계, FSD, 는 프론트엔드 개발자가 알고 사용할 수 있는 흥미롭고 가치 있는 발견입니다. FSD는 팀에 유연하고 표준화되며 확장 가능한 아키텍쳐와 개발 문화를 제공할 수 있습니다. 하지만 이 방법론의 긍정적인 측면을 활용하기 위해서는 팀 내에서 지식, 인식 및 규칙이 필요합니다.

FSD는 명확한 비즈니스 지향성, 엔티티 정의, 애플리케이션의 기능 및 컴포넌트 구성과 같은 특징들로 인해 다른 아키텍쳐 사이에서도 돋보입니다.

# README

## nextjs14/base

nextjs14/base에는 nextjs@14와 더불어 prettier와 eslint 그리고 husky를 적용해두었습니다. husky에는 lint-staged를 활용한 pre-commit과 post-merge시 자동으로 패키지를 설치할 수 있도록 적용해두었습니다.

### nextjs14/emotion

nextjs14/base를 기반으로 emotion 라이브러리를 사용할 수 있도록 적용해두었습니다.

### nextjs14/zustand

nextjs14/base를 기반으로 zustand 라이브러리를 사용할 수 있도록 적용해두었습니다.
