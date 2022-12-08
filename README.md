# dbp_chat_project

## Tsconfig

ES6 버전으로 설정을 해놓았고, file path 의 libs, components 폴더에 대한 참조를 수정하였습니다. (../components/enter.tsx) => (@components/enter.tsx) 이런식으로 가져오시면됩니다.

## Tailwind css

### 주의 할점

Taill windcss 의 경우 모바일 환경의 웹화면에 최적화 되어 있기떄문에 동적인 css 를 위해 화면 크기가 작은순서로 최적화가 되어있습니다. 

예를 들어 flex flex-col lg:flex-row 이런식 으로 코드를 짜면 작은 화면일떄는 col 으로 정렬하다가 큰화면이되면 row 형식으로 정렬을 하게됩니다.

## Next js 13 Path

현재 프로젝트는 13 버전으로 설정이 되어있기떄문에 12 버전과의 문법차이/ 기능차이있습니다 참고해서 다르게 코딩해야할거같습니다.

Layout Shift 문제가 해결되었습니다. -> next/image , font 가 이에 해당됩니다.

인터넷 익스플로어에서의 지원이 없어졋습니다. 이제 익스플로러 에서는 next js 가 정상작동 하지않습니다. edge 부터 가능합니다.



## 예약된 파일이 많아졋습니다

예약된 파일은 layout.js , page.js , loading.js , error.js , templete.js 입니다 여기서 loading 부분 , error 부분 을 확인하면될거같습니다.

( 이중에서 다음버전에서 빠지는 파일 많을거 같습니다. 너무 파일이 많아지기 때문입니다. )

## 주요 코드 샘플입니다.

### ex1) loading.js 
<pre><code>export defult function Loading(){
  return(
    <> Loading... < />
  )
}</code></pre>

### ex2) layout.js 
<pre><code>export defult function RootLayout({ children }){
  return(
    <> {children} < />
  )
}</code></pre>

### ex3) getServerSideProps ver.12 => react {use} ver.13
<pre><code>export default function Page(){
  const data = use(getData())
  retrun (
    <> page {data.text} < />
  )
}
// 3가지 중에 원하는 식으로 데이터를 불러오면 될거같습니다.
export async function getData(){
  const { data } = await (await fetch('data_url')).json()
//const { data } = await (await fetch('data_url' , {cache : 'no-store'})).json() server side porps 처럼 사용가능합니다.
  return data
}
---- or -----
export async function getData(){
 return fetch('data_url').then((response) => response.json());
}
---- es6 -----
export async const getData = () => fetch('data_url').then((response) => response.json());
</code></pre>


### 번들링 -> TURBOPACK // 속도는 빠르지만 안정성에서 조금 문제가있습니다.

### Link -> 12 버전까지의 link는 a태그 안에 text를 넣지않으면 성능의 문제가 생겻지만 패치를 햇음에도 조금 성능에 문제가있어 useRoute 를 써서 페이지 를 넘어가는 것이 좋아보입니다.


# Setup

## NextJs Setup

npx create-next-app --typescript

## Tailwind css Setup

npm i -D tailwindcss postcss autoprefixer

npx tailwindcss init -p

option set

tailwindcss.config.js

content : ["pages/**/*.{js,jsx,ts,tsx}" , "components/**/*.{js,jsx,ts,tsx}"]

globals.css // 안에 밑에 @tailwind 복사 붙혀넣기 하시면됩니다.

@tailwind base;

@tailwind components;

@tailwind utilities;

## Prisma

npm i -D prisma

npx prisma init

schema.prisma
사용하는 db 이름 적어주고,
model 작성을 한후

generator client {

provider = "prisma-client-js"

previewFeatures = ["referentialIntegrity"] // vitess 를 사용하기에 사용하는 옵션입니다.

}

datasource db {

provider = "mysql"

url = env("DATABASE_URL") // 변경하지 않고 .env 에서 주소 변경 하면됩니다.

referentialIntegrity = "prisma"

}

npx prisma db push // 모델을 작성한 이후 db 로 업로드를 해주셔야합니다.

npx prisma studio // prisma studio 를 엽니다. gui 환경으로 데이터를 관리/확인 을 할수있습니다.

## Planetscale

https://github.com/planetscale/cli#installation 를 따라해 쓰시는 os에 따라 setup 하시고,

pscale auth login // pscale 에 로그인합니다

pscale region list -> region name 을 확인 하는겁니다 밑에서 region 을 설정할때 좋습니다. 제일 가까운 일본서버 를 선택하면 될거같습니다~

pscale database create {database name} --region {region name}

pscale connect <database name> // 작업하실때 connect 를 하고 작업을해야 합니다 이때 나온 url 을 .env 에서 수정해 사용하면 될거같습니다.

.env

DATABASE_URL=mysql://127.0.0.1:3306/{databasename}
