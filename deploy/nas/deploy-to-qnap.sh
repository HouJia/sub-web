#!/usr/bin/env bash
# 在本机构建 sub-web（/subw/ 子路径）并部署到 nas-qnap
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
IMAGE="${IMAGE:-subweb:nas-amd64}"
NAS_HOST="${NAS_HOST:-nas-qnap}"
DOCKER_REMOTE="${DOCKER_REMOTE:-/share/CACHEDEV1_DATA/.qpkg/container-station/bin/docker}"
CONTAINER="${CONTAINER:-subweb}"
PORT="${PORT:-58081}"

cd "$ROOT"
if [[ ! -f .env ]]; then
  echo "==> 缺少 .env，请先: cp .env.example .env 并填写 VITE_SUBCONVERTER_DEFAULT_BACKEND"
  exit 1
fi

echo "==> build $IMAGE (linux/amd64)"
docker buildx build --platform linux/amd64 -f Dockerfile -t "$IMAGE" --load .

echo "==> save & load on $NAS_HOST"
docker save "$IMAGE" | ssh -o BatchMode=yes "$NAS_HOST" "$DOCKER_REMOTE load"

echo "==> recreate container $CONTAINER"
ssh -o BatchMode=yes "$NAS_HOST" "$DOCKER_REMOTE stop $CONTAINER 2>/dev/null || true; \
  $DOCKER_REMOTE rm $CONTAINER 2>/dev/null || true; \
  $DOCKER_REMOTE run -d --name $CONTAINER --restart always -p ${PORT}:80 $IMAGE"

echo "==> verify"
sleep 2
ssh -o BatchMode=yes "$NAS_HOST" "curl -sS -o /dev/null -w '%{http_code}\n' http://127.0.0.1:${PORT}/subw/"
