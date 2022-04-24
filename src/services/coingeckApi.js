import axios from 'axios';
// import { update } from "../redux/coinMapSlice";
// import { useDispatch } from 'react-redux';

export const getCoinPriceRange = async (id) => {
    
    // const dateFrom = new Date(2022, 4, 15).getTime();
    const dateFrom = new Date(2021, 2, 1).getTime();
    // alert("dateFrom: " + dateFrom);
    // const dateFrom = new Date().toLocaleString();
    const dateNowMs = Date.now();
    // alert("dateFrom: " + dateFrom+ ", " + dateNowMs);
    return axios.get(`https://api.coingecko.com/api/v3/coins/${id}/market_chart/range?vs_currency=usd&from=${dateFrom/1000}&to=${dateNowMs/1000}`);
    // return axios.get(`https://api.coingecko.com/api/v3/coins/bitcoin/market_chart/range?vs_currency=usd&from=1650238763&to=1652590800`);
    //   .then(res => {
    //     const persons = res.data;
    //     this.setState({ persons });
    //   })
}

export const getCoinList = async () => {
    
//    const response = await axios.get(`https://api.coingecko.com/api/v3/coins/list`);
//    const responseData = response.data;
//    responseData.forEach(item => {
//        if(!coins.hasOwnProperty(item.id) && !coins.hasOwnProperty(item.symbol)){
//            // coins[item.id] = item.name;
//            coins[item.id] = {
//                id: item.id,
//                title: `${item.name} (${item.symbol})`,
//            };
//            coins[item.name] = {
//                id: item.id,
//                title: `${item.name} (${item.symbol})`,
//            };
//            coins[item.symbol] = {
//                id: item.id,
//                title: `${item.name} (${item.symbol})`,
//            };
//            // coins[item.id] = {
//            //     id: item.id,
//            //     name: item.name,
//            //     symbol: item.symbol,
//            // };
//        }
//    });
//    // alert("coins: " + JSON.stringify(coins));
//    return coins;
   return axios.get(`https://api.coingecko.com/api/v3/coins/list`)
    .then(response => {
        let coins = {};
        // alert("coinlist: " + response.data.length);
        
        // alert("coinlist: " + JSON.stringify(response.data));
        const responseData = response.data;
        let xrpList = {};
        responseData.forEach(item => {
            if(item.symbol.toLowerCase() === "xrp"){
                xrpList[item.id] = item;
            }
            if(
                // ((coins.hasOwnProperty(item.symbol) && item.id.length < coins[item.symbol].id.length) ||
                (!coins.hasOwnProperty(item.id) 
                || !coins.hasOwnProperty(item.name) 
                || !coins.hasOwnProperty(item.symbol) )
                && (item.name.length < 15 && item.symbol.length < 7)
            )
            {
                // coins[item.id] = item.name;
                delete coins[item.id];
                delete coins[item.name];
                delete coins[item.symbol];

                const title = `${item.name} (${item.symbol.toUpperCase()})`;
                coins[item.id] = {
                    id: item.id,
                    title: title,
                };
                coins[item.name] = {
                    id: item.id,
                    title: title,
                };
                coins[item.symbol] = {
                    id: item.id,
                    title: title,
                };
                // coins[item.id] = {
                //     id: item.id,
                //     name: item.name,
                //     symbol: item.symbol,
                // };
            }
        });
        // alert("xrpList: " + JSON.stringify(xrpList));
        // alert("coins: " + JSON.stringify(coins));
        return coins;
        // dispatch(update(coins));
        // alert("coinMap: " + JSON.stringify(coins));
        // const coinIds = Object.keys(coins);
        // coinIds.forEach(coinId => {
        //     const coin = coins[coinId];
        //     if(coin.symbol === "avax"){
        //         alert("coinId: " + JSON.stringify(coin));
        //     }
        // })
        // alert(JSON.stringify(coins["matic-network"]));
        // alert(JSON.stringify(coins["avax"]));

    })
    .catch(()=> {
        return {};
    })
 
}