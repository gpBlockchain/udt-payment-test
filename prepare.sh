# offckb
npm install -g @offckb/cli
# ckb udt  
git clone https://github.com/xxuejie/ckb-udt-convert-service.git
cd ckb-udt-convert-service
pnpm install
npm run build
# 启动 redis 
docker run --name my-redis -d -p 26379:6379 redis
# 启动ckb
offckb node > node.log 2>&1 &
# 启动 ckb-udt-convert-service
cp ../.env.dev .env
cp ../devnet-offckb.json  .
cp ../udts.json.sample udts.json
node dist/entries/singlesig_all.js > ckb-udt-convert-service.log 2>&1 &
cd ../