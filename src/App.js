import { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import Chart from "react-apexcharts";
import { getCoinList } from "./services/coingeckApi";
import { setChartPrice, setCoinPair } from "./redux/chartDataSlice";
import InputPair from './components/InputPair';
import { update } from "./redux/coinMapSlice";
import { useDispatch, useSelector } from 'react-redux';
import pearHalf from './images/pearHalf.png';
// import ReactApexChart from "react-apexcharts";

let options = {
  chart: {
    // background: '#ffffff',
    type: "line",
    foreColor: '#78909C',
    zoom: {
      enabled: true
    },
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: 'straight',
    width: 2,
  },
  title: {
    // text: 'CandleStick Chart',
    align: 'left',
    style: {
      color: '#78909C',
    },
    
  },
  xaxis: {
    type: "datetime",
    // type: 'category',
    // categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999],
    tickAmount: undefined,
    tickPlacement: 'between',
    min: undefined,
    max: undefined,
    range: undefined,
    floating: false,
    decimalsInFloat: undefined,
    overwriteCategories: undefined,
    position: 'bottom',
    labels: {
        show: true,
        rotate: -45,
        rotateAlways: false,
        hideOverlappingLabels: true,
        showDuplicates: false,
        trim: false,
        minHeight: undefined,
        maxHeight: 120,
        style: {
            colors: [],
            fontSize: '12px',
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 400,
            cssClass: 'apexcharts-xaxis-label',
        },
        offsetX: 0,
        offsetY: 0,
        format: undefined,
        formatter: undefined,
        datetimeUTC: true,
        datetimeFormatter: {
            year: 'yyyy',
            month: "MMM 'yy",
            day: 'dd MMM',
            hour: 'HH:mm',
        },
    },
    axisBorder: {
        show: true,
        color: '#78909C',
        height: 1,
        width: '100%',
        offsetX: 0,
        offsetY: 0
    },
    axisTicks: {
        show: true,
        borderType: 'solid',
        color: '#78909C',
        height: 6,
        offsetX: 0,
        offsetY: 0
    },
    title: {
        // text: "Time (Date)",
        offsetX: 0,
        offsetY: 0,
        style: {
            color: '#ffffff',
            // fontSize: '12px',
            // fontFamily: 'Helvetica, Arial, sans-serif',
            // fontWeight: 600,
            // cssClass: 'apexcharts-xaxis-title',
        },
    },
    crosshairs: {
        show: true,
        width: 1,
        position: 'back',
        opacity: 0.9,        
        stroke: {
            color: '#b6b6b6',
            width: 0,
            dashArray: 0,
        },
        fill: {
            type: 'solid',
            color: '#B1B9C4',
            gradient: {
                colorFrom: '#D8E3F0',
                colorTo: '#BED1E6',
                stops: [0, 100],
                opacityFrom: 0.4,
                opacityTo: 0.5,
            },
        },
        dropShadow: {
            enabled: false,
            top: 0,
            left: 0,
            blur: 1,
            opacity: 0.4,
        },
    },
    tooltip: {
        enabled: true,
        formatter: undefined,
        offsetY: 0,
        style: {
          fontSize: 0,
          fontFamily: 0,
        },
    },
  },
  yaxis: {
    title: {
        // text: "y-axis title",
        offsetX: 0,
        offsetY: 0,
        style: {
            color: '#ffffff',
            // fontSize: '12px',
            // fontFamily: 'Helvetica, Arial, sans-serif',
            // fontWeight: 600,
            // cssClass: 'apexcharts-xaxis-title',
        },
    },
    forceNiceScale: true,
  },
  theme: {
    mode: 'light', 
    palette: 'palette1', 
    monochrome: {
        enabled: true,
        // color: '#255aee',
        color: '#e3f542',
        // color: '#ffffff',
        shadeTo: 'light',
        shadeIntensity: 0.65
    },
  },
};


function App() {
  const [chartOptions, setChartOptions] = useState(options);
  const [seriesData, setSeriesData] = useState([]);
  const [typewriterText, setTypewriterText] = useState("altcoin");
  const chartPrice = useSelector((state) => state.chartData.chartPrice);
  const coinPair = useSelector((state) => state.chartData.coinPair);
  // const coin2 = useSelector((state) => state.chartData.coin2);
  const dispatch = useDispatch();
  // setChartOptions(options);

  useEffect(() => {
    // alert("chartPrice!!: " + JSON.stringify(chartPrice));
      const _seriesData = [{
        data: chartPrice,
      }];
      setSeriesData(_seriesData);

  }, [chartPrice]);

  // useEffect(() => {
 
  //   //   alert("coinPair!: " + JSON.stringify(coinPair));
  //   if( chartOptions && chartOptions.hasOwnProperty('chart') && coinPair.length > 0){
  //     // alert("###chartOptions: " + JSON.stringify(chartOptions));
  //     let tempChartOptions = chartOptions;
  //     tempChartOptions.title.text = `${coinPair[0]}-${coinPair[1]}`;
  //     // alert("tempChartOptions: " + JSON.stringify(tempChartOptions));
  //     setChartOptions(tempChartOptions);
  //   }

  // }, [coinPair]);
  
  useEffect(() => {
    // getCoinList()
    // .then(resp => {

    //   // alert("coinMap: " + JSON.stringify(resp));
    // })
    

    setChartOptions(options);
    const getCoinMap = async () => {
      const coinMap = await getCoinList();
      dispatch(update(coinMap));
      // alert("coinMap1: " + JSON.stringify(coinMap));
    }

    getCoinMap()
    .catch(console.error);
    
    // getCoinPriceRange()
    // .then(res => {
    //   // alert("resData: " + JSON.stringify(res.data.prices));
    //   // console.log("resData: ", res.data);
    //   const prices = res.data.prices;
    //   for (let i = 0; i < prices.length; i++) {
    //     let price = prices[i][1];
    //     prices[i][1] = Math.round(price);
    //     // text += "The number is " + i + "<br>";
    //   };

    //   const _seriesData = [{
    //     data: prices,
    //   }];
    //   setSeriesData(_seriesData);

    // })
    // .catch(e => {
    //   console.log('error fetch getCoinPriceRange');
    //   console.log(e);
    // })
    // Your code here
  }, []);

  const handleOnFlipPair = () =>  {
    let newChartPrice = [];
    for(let i=0; i < chartPrice.length; i++){
      const previous = chartPrice[i][1];
      const newValue = 1/previous;
      let formattedValue = 0;
      if(newValue < 0.1){
        formattedValue = parseFloat(newValue.toFixed(8));
      }else if(newValue < 1 ){
        formattedValue = parseFloat(newValue.toFixed(6));
      } else {
        formattedValue = parseFloat(newValue.toFixed(2));
      }
      newChartPrice.push([chartPrice[i][0], formattedValue]);
    }
    dispatch(setChartPrice(newChartPrice));
    dispatch(setCoinPair([coinPair[1], coinPair[0]]));

  }
  
  const chartWidth = window.innerWidth > 767 ? 950 : window.innerWidth > 400 ? 375 : 340;
  const chartHeight = window.innerWidth > 767 ? 450 : window.innerWidth > 400 ? 200 : 200;
  // const typewriterText = "altcoin";
  return (
    <div className="App w-screen">

      {/* <video
        autoPlay
        loop
        muted
        id="video"
      >
        <source src="https://youtube.com/clip/UgkxLdlCeAybWPmA3WmphXua0TfuVfYjh8Rl" type="video/mp4" />
      </video> */}
        
      {/* Title logo */}
      {/* <div className='wrapper md:mb-32 mb-16'></div> */}
      <div className='flex md:mb-12 mb-10'>
        <div className='flex justify-center border-[blue]'>
            <h1 className=' place-self-center text-white md:text-5xl text-4xl border-[red]'> 
              {"AltPair"}
            </h1>
          
        </div>
        <div className='mx-2'>
          <img className="md:h-20 h-16 md:w-[65px] w-[45px]" src={pearHalf} alt="Logo" />
        </div>
        <div className='flex justify-center border-[blue]'>
            <h1 className=' place-self-center text-white md:text-5xl text-4xl border-[red]'> 
              {"Charts"}
            </h1>
        </div>
      </div>


      <div className='wrapper md:mb-16 mb-12'>
        <div className='text-white text-3xl'>
          {"Charts for any "}
        </div>
        <ul className='typewriter-text text-3xl'>
          <li><span>altcoin</span></li>
          <li><span>pair</span></li>
          <li><span>combination</span></li>
        </ul>
        {/* <div className='typewriter-text text-4xl'>
          {typewriterText}
        </div> */}
      </div>
      {/* <div className='wrapper md:mb-32 mb-16'>
        <div className='typing-animation text-white text-2xl'>
        {"View any altcoin pair combination"}
        </div>
      </div> */}
      
      
      {/* Search Pair component */}
      <InputPair className="md:mb-40 mb-24"/>

      {/* Chart */}
      { chartOptions && chartOptions.hasOwnProperty('chart') && coinPair.length > 0 &&
        <div className='flex flex-row w-auto mb-8'>
          {/* PAIR HEADER */}
          <h1 className='text-white md:text-4xl  text-2xl'> 
            {`${coinPair[0].toUpperCase()}/${coinPair[1].toUpperCase()}`}
          </h1>

          {/* FLIP Pair Chart*/}
          <button 
            className='text-[yellow] md:text-2xl text-md  md:ml-80 ml-32 bg-[blue] px-4 py-2 rounded-lg' 
            onClick={handleOnFlipPair}
          > 
            {`Flip Pair`}
          </button>
        </div>
      }
      
      {
          seriesData && chartOptions && chartOptions.hasOwnProperty("chart") && coinPair.length > 0 &&
          <div className='z-0 bg-[#282c34]'>
            <Chart
              options={chartOptions}
              series={seriesData}
              type="line"
              // type="candlestick"
              // height={450}
              // width={950}
              // height={200}
              // width={375}
              height={chartHeight}
              width={chartWidth}
            />
          </div>
        }
    </div>
  );
}

export default App;
