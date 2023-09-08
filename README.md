# auto-complete-search-bar

검색어 추천 기능을 갖춘 질병 정보 검색 창을 구현한 웹사이트 입니다.

![미리보기](https://github.com/kkkkkSE/react-github-issue-dashboard/assets/95907436/467c7e47-9b43-4267-960d-984d0b32cf4b)

배포 링크 : [https://pre-onboarding-3-kkkkkse.vercel.app](https://pre-onboarding-3-kkkkkse.vercel.app)

## 개발 Keyword

- Debounce를 이용한 API 호출 횟수 줄이기
- 로컬 스토리지를 이용하여 검색 결과 캐싱하고 Stale Data 판단하여 갱신하기
- 다양한 Event Handler를 활용하여 사용자 경험(UX) 개선

## 요구사항

- 검색어 추천 기능 구현
  - API 호출별로 로컬 캐싱 구현, 라이브러리 사용 금지
  - Expire Time 구현
- API 호출 횟수 줄이는 전략 세우기
- 키보드를 이용하여 추천 검색어 이동 가능

## 설계 상세

### 검색어 추천 with Debounce

#### Why Debounce?

잦은 API 호출을 방지하기 위해 가장 많이 고려하는 것이 **Debounce**와 **Throttle** 입니다.

처음에는 사용자가 검색을 하는 동안 일정한 주기로 검색어 추천을 받게 하기 위해 Throttle을 고려했습니다. 하지만 막상 적용했을 때 다음과 같은 애로사항이 있었습니다.

> '간' 이라는 단어를 검색하려고 할 때, 'ㄱ' 인 상태에서만 API를 호출하고 '간'으로는 API 호출이 되지 않았다.

이를 해결하고자 Debounce와 Throttle을 동시에 사용해보려고 했으나, 같은 타이밍에 두번씩 추천 검색어를 요청할 때도 있어 현재 상황에 적용하기엔 과하다는 느낌이 들었습니다.

결국 Debounce로 구현하되, 적당한 주기를 사용하여 검색어를 입력하는 동안에도 간간히 추천 검색어를 출력하도록 구현했습니다.

#### 구현 방식

- `useDebounce` Custom Hook 생성
  - 입력으로 들어온 Delay와 Callback 함수를 Debounce 로직에 적용시키고, Debounce가 적용된 함수를 반환
- Redux-Toolkit Slice에 정의되어 있는 추천 검색어 Fetch 함수를 `useDebounce`에 여과하여 검색 Input의 Change Event Handler에서 실행

### 로컬 스토리지에 캐싱하기

#### Why Local Storage?

캐싱을 구현할 수 있는 방법은 생각보다 다양했습니다. 하지만 그마다 장단점이 있었고, 현재 과제의 규모와 필요성을 고려하여 적절한 방식을 선택했습니다.

- Cache Storage : 
  - API 요청 시의 URL과 Response를 캐싱한다는 점에서 '캐싱을 하는 용도'에는 가장 적절하다고 생각했습니다.
  - 다만 Expire Time을 기록해야 한다는 걸 고려했을 때, Response를 도중에 수정하는 부분이 복잡하다 느껴졌습니다.
  - 또한 Fetch API의 응답 형태로만 기록할 수 있다는 점도 아쉬웠습니다.
- indexedDB :
  - 용량 제한도 크고, index를 통해 데이터에 접근 가능하다는 점에서 사용하기 괜찮다고 생각했습니다.
  - 하지만 세팅이 매우 복잡하고, 저장된 데이터는 영구적으로 보관된다는 점이 아쉬웠습니다. 추천 검색어를 저장하기에는 적절하지 않은 것 같았습니다.
- Cookie :
  - Expire Time을 지원한다는 점이 매력이었습니다.
  - 다만 쿠키를 사용해야 하는 HTTP 요청에서 모두 전달되기 때문에 적절하지 않다고 판단했습니다.
- In-Memory :
  - Map을 이용해서 관리하면 읽고 쓰는 것이 매우 간편할 거라 생각했습니다.
  - 하지만 Refresh 시 데이터가 지워진다는 점이 가장 아쉬웠습니다.
- Local Storage :
  - 접근이 간편하고, 읽고 쓰는 데 어려움이 없습니다.
  - 사용자가 임의로 제거하거나, 다른 요소로 인해 지워지기 전까지는 데이터가 유지됩니다.
- Session Storage :
  - 로컬 스토리지와 비슷하지만, 해당 탭 안에서만 데이터가 유효하다는 점이 아쉬웠습니다.

위에서 언급된 장점과 단점을 조합했을 때, 추천 검색어를 저장하기에 적당한 방식으로 로컬 스토리지를 채택하게 되었습니다.

#### 구현 방식

- 간편하게 캐시를 저장하고, 읽어올 수 있도록 유틸 함수로 분류
- 추천 검색어 기능에서 필요한 get, set 함수만 구현
- 확장성을 고려하여 매개변수로 key를 받아 다른 기능에서도 캐싱 기능을 사용할 수 있도록 함
  - 기능별로 동일한 key를 사용하고, value를 객체 형태로 저장하여 캐싱
  - value 내 객체에서 key는 검색어, value는 검색 결과로 저장
- Expire Time을 함께 저장 : 이후 동일한 검색어를 요청할 때 데이터가 Stale 한 지 판단하는 척도로 사용

### 다양한 Event Handler

사용자 경험(UX)을 개선하기 위해 다양한 Event Handler를 활용하여 추천 검색어와 최근 검색어를 손쉽게 선택하고 빠르게 검색하는 데 초점을 맞춰 기능을 구현했습니다.

- Focus Event Handler :
  - 검색 Input Focus 시 추천 검색어 리스트 UI가 노출되고, Blur 시 제거됩니다.  
- Keyboard Event Handler :
  - 위, 아래 방향키 입력 시 추천 검색어 리스트의 검색어가 활성화되어 원하는 검색어로 간편하게 이동할 수 있습니다.
  - Keyboard Event를 이용하여 검색어를 활성화 시킬 경우, 검색 Input에 해당 검색어를 반영합니다.
  - 사용자의 편의를 위하여 Keyboard Event로 인해 검색 Input이 변경될 경우, 추천 검색어를 갱신하지 않습니다.
- Change Event Handler :
  - Change Event 발생 시 추천 검색어가 갱신됨에 따라 마우스 또는 키보드 이벤트로 인해 적용된 검색어 활성화 상태를 초기화합니다.
- Mouse Event Handler :
  - 검색어에 마우스 커서를 올리면 해당 검색어가 활성화됩니다.
  - 검색어에서 마우스 커서가 벗어나면 검색어 활성화 상태가 초기화됩니다.
  - Mouse Event와 검색 Input의 Keyboard Event로 발생한 검색어 활성화 상태는 공유됩니다.

## 실행 방법

1. git clone

2. `API_BASE_URL` 환경 변수가 정의된 `.env` 파일 세팅

3. 아래 커맨드 입력

```
npm ci

npm start
```
