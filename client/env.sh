# Pull variables from the environment and make them accessible at runtime
echo "window._env_ = {
    DDAPPID: \"$DDAPPID\",
    DDCLITOKEN: \"$DDCLITOKEN\",
}" > public/env.js

mkdir -p dist
cp public/env.js dist/env.js
