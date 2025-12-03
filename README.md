This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

<br>

## Prerequisite

- Docker
- npm / node
- yarn

<br>

## Installation

```bash
yarn
# or
yarn install
```

<br>

## Setup

### Environment variables(환경변수)

- 모든 환경변수는 `.env` 파일에 정의합니다.
- 환경별 local 설정은 (git ignored된) `.env.[target].local` 파일에서 관리하고, `.env`파일에서 동일한 이름으로 참조됩니다.
- [Next.js Documentation - Environment Variables](https://nextjs.org/docs/basic-features/environment-variables) - Next.js의 환경변수 공식 document

<br>

### Graphql code generation(GraphQL 코드 생성)

GraphQL 명세 추가/변경 시 codegen 명령을 통해 sync하며, `/generated/graphql.tsx` 파일에 반영됩니다.

```bash
yarn gql:codegen
```

<br>

## Getting Started

Run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

<br>

## Deployment

```bash
# build next app
yarn build

# docker(aws ecr) login
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_REPOSITORY_URL

# build docker image
docker build -t bagstrap-www .
docker tag bagstrap-www:latest $ECR_REPOSITORY_URL

# push docker image
docker push $ECR_REPOSITORY_URL:latest

# update ecs service
aws ecs update-service --region $AWS_REGION --cluster $ECS_CLUSTER --service $ECS_SERVICE --force-new-deployment
```
