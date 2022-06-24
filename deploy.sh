docker build . -t stockwatch/stockwatchoss
docker run -d --restart unless-stopped --name mongo -e MONGO_INITDB_ROOT_USERNAME=USER -e MONGO_INITDB_ROOT_PASSWORD="PASSWORD" -p 27017:27017 mongo
sleep 2
docker run -d --restart unless-stopped --name stockwatch stockwatch/stockwatchoss
echo "StockWatch has been deployed"