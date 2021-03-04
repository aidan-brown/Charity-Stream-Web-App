# Pull variables from the environment and make them accessible at runtime
echo "window._env_ = {
    DDAPPID: \"$DDAPPID\",
    DDCLITOKEN: \"$DDCLITOKEN\",
}" > public/env.js

mkdir -p build
cp public/env.js build/env.js
