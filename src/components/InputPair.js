import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { getCoinPriceRange, getCoinList } from "../services/coingeckApi";
import { setChartPrice, setCoinPair } from "../redux/chartDataSlice";
import { useDispatch } from 'react-redux';
import SearchIcon from '@mui/icons-material/Search';

const InputPair = (props) => {
    const [firstInput, setFirstInput] = useState("");
    const [firstInputResults, setFirstInputResults] = useState([])
    const [firstInputValue, setFirstInputValue] = useState("");

    const [secondInput, setSecondInput] = useState("");
    const [secondInputResults, setSecondInputResults] = useState([])
    const [secondInputValue, setSecondInputValue] = useState("");
    const [textboxColor1, setTextboxColor1] = useState("bg-[#e1e6ed]");
    const [textboxColor2, setTextboxColor2] = useState("bg-[#e1e6ed]");

    // const [onClickOutsideInput, setOnClickOutsideInput] = useState(()=> {});

    const dispatch = useDispatch();

    const coinMap = useSelector((state) => state.coinMap.value);
    const textboxCointainerRef1 = useRef(null);
    const textboxCointainerRef2 = useRef(null);
    const textboxRef1 = useRef(null);
    const textboxRef2 = useRef(null);

    // const handleOnChange = (keyword) => {

    //     alert("InputPair: " + JSON.stringify(coinMap));
    // }

    const handleResultClick = (result) => {
        const coinSymbol = result.substring(result.indexOf('(')+1, result.length-1);
        setFirstInputValue(coinSymbol);
        setFirstInputResults([]);
        setTextboxColor1("bg-[#e1e6ed]");
    }

    const handleSecondResultClick = (result) => {
        const coinSymbol = result.substring(result.indexOf('(')+1, result.length-1);
        setSecondInputValue(coinSymbol);
        setSecondInputResults([]);
        setTextboxColor2("bg-[#e1e6ed]");
    }

    const handleSubmit = async () => {
        if(firstInputValue && secondInputValue){
            // alert('handleSubmit1: '+ firstInputValue);
            // alert(JSON.stringify(coinMap));
            // alert('handleSubmit: ' + coinMap[firstInputValue.toLowerCase()].id);
           let coin1Data = await getCoinPriceRange(coinMap[firstInputValue.toLowerCase()].id);
           let coin2Data = await getCoinPriceRange(coinMap[secondInputValue.toLowerCase()].id);
           
           coin1Data = coin1Data.data.prices;
           coin2Data = coin2Data.data.prices;
        
           const coin1DataLength = coin1Data.length;
           const coin2DataLength = coin2Data.length;
           const minDataLength = Math.min(coin1DataLength, coin2DataLength);
           const dataLengthDiff = Math.abs(coin1DataLength - coin2DataLength);
        //    alert(
        //        "coin2Data: " + coin2Data
        //    );
        //    alert("coin1Data: " + JSON.stringify(coin1Data));
           let priceData = [];
        //    alert("coin1Data.len: " + coin1DataLength + ", coin2Data.len: " + coin2DataLength);
           for(let i = 0; i < minDataLength; i++){
               const dateMs = coin1DataLength < coin2DataLength ? coin1Data[i][0] : coin2Data[i][0];
               const coin1Value = coin1DataLength < coin2DataLength ? coin1Data[i][1] : coin1Data[i + dataLengthDiff][1];
               const coin2Value = coin2DataLength < coin1DataLength ? coin2Data[i][1] : coin2Data[i + dataLengthDiff][1];
               const ratio = coin1Value/coin2Value;
            //    const ratio = coin1Data[i][1]/coin2Data[i][1];
               let formattedRatio = 0;
               if(ratio < 0.1){
                    formattedRatio = ratio.toFixed(8);
               }else if(ratio < 1 ){
                formattedRatio = ratio.toFixed(6);
               } else {
                formattedRatio = ratio.toFixed(2);
               }
               formattedRatio = parseFloat(formattedRatio);
            //    alert("formattedRatio: " + formattedRatio);
            //    const m = Number((Math.abs(ratio) * 100).toPrecision(15));
            //    const roundedPrice = Math.round(m) / 100 * Math.sign(ratio);
               priceData.push([dateMs, formattedRatio]);
           }
        //    alert("priceData: " + priceData);
           dispatch(setChartPrice(priceData));
           dispatch(setCoinPair([firstInputValue, secondInputValue]));
        //    alert("priceData: " + priceData);
        }
    }

    const onClickOutsideTextbox1 = () => {
        // alert("clickedOutsideInput");
        setFirstInputResults([]);
    }

    const onClickOutsideTextbox2 = () => {
        setSecondInputResults([]);
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            // clicked outside textbox1
            if (textboxCointainerRef1.current && !textboxCointainerRef1.current.contains(event.target)) {
                // alert("clicked outside textbox1, firstInputValue: " + firstInputValue);
                onClickOutsideTextbox1 && onClickOutsideTextbox1();
                setTextboxColor1("bg-[#e1e6ed]");
            }
            // clicked inside textbox1
            if (textboxRef1.current && textboxRef1.current.contains(event.target)) {
                // alert("clicked on textbox1, firstInputValue: " + firstInputValue);
                onChangeInput1(firstInputValue);
                setTextboxColor1("bg-[white]");
            }
            // clicked outside textbox2
            if (textboxCointainerRef2.current && !textboxCointainerRef2.current.contains(event.target)) {
                onClickOutsideTextbox2 && onClickOutsideTextbox2();
                setTextboxColor2("bg-[#e1e6ed]");
            }
            // clicked inside textbox2
            if (textboxRef2.current && textboxRef2.current.contains(event.target)) {
                // alert("clicked on textbox2, secondInputValue: " + secondInputValue);
                onChangeInput2(secondInputValue);
                setTextboxColor2("bg-[white]");
            }
        };
        document.addEventListener('click', handleClickOutside, true);

        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        };


    }, [firstInputValue, secondInputValue]);

    const getSearchResultList = (text) => {
        const coinMapKeys = Object.keys(coinMap);
        const candidates = {};
        let candidatesAdded=0;
        let currentLongestString = "";

        coinMapKeys.every(item => {
            
            const title = coinMap[item].title;
            // const indexSymbol = title.indexOf("(");
            // const symbol = title.substring(indexSymbol+1, title.length-1);
            // alert(title + ":" + indexSymbol + ":" + symbol);
            if(item.toLowerCase().startsWith(text.toLowerCase())
                && !candidates.hasOwnProperty(title)
            ){
                if(candidatesAdded < 5){
                    candidates[title]=item;
                    if(title.length > currentLongestString.length){
                        currentLongestString = title;
                    }
                }

                if(candidatesAdded === 5 && title.length < currentLongestString.length){
                    
                    // return false;
                    delete candidates[currentLongestString];
                    candidates[title] = item;
                    let longestString = "";
                    const candidatesArray = Object.keys(candidates);
                    candidatesArray.forEach(element => {
                        if(element.length > longestString.length){
                            longestString = element;
                        }
                    });
                    currentLongestString = longestString;
                    // currentLongestString = title;

                }
                if(candidatesAdded < 5){
                    candidatesAdded++;
                }
                // candidates.sort((a, b)=> {
                //     return a.substring(indexA, a.length-2).length > b.substring(indexB, b.length-2).length  ? 1 : -1;
                // });
                //track the longest title
                // if(title.length > currentLongestString.length){
                //     currentLongestString = title;
                // }
                // currentLongestString = title.length > currentLongestString.length ? title : currentLongestString;
            }
            return true;           
        });

        const resultArray = Object.keys(candidates);

        //SORT ARRAY FROM SHORTEST to LONGEST SYMBOL LENGTH
        resultArray.sort((a, b)=> {
            // alert("candidates" + JSON.stringify(candidates));
            // alert(", " + JSON.stringify(coinMap[candidates[a]]));
            const indexA = a.indexOf("(");
            const indexB = b.indexOf("(");
            // return coinMap[candidates[a].item].symbol.length > coinMap[candidates[b].item].symbol.length ? 1 : -1;
            return a.substring(indexA+1, a.length-1).length > b.substring(indexB+1, b.length-1).length  ? 1 : -1;
        });

        return resultArray;
    }

    const onChangeInput1 = (text) => {
        // setFirstInput(text);
        
        setFirstInputValue(text);
        if(text){
            // const coinMapKeys = Object.keys(coinMap);
            // const candidates = {};
            // let candidatesAdded=0;
            // let currentLongestString = "";

            // coinMapKeys.every(item => {
                
            //     const title = coinMap[item].title;
            //     // const indexSymbol = title.indexOf("(");
            //     // const symbol = title.substring(indexSymbol+1, title.length-1);
            //     // alert(title + ":" + indexSymbol + ":" + symbol);
            //     if(item.toLowerCase().startsWith(text.toLowerCase())
            //         && !candidates.hasOwnProperty(title)
            //     ){
            //         if(candidatesAdded < 5){
            //             candidates[title]=item;
            //             if(title.length > currentLongestString.length){
            //                 currentLongestString = title;
            //             }
            //         }

            //         if(candidatesAdded === 5 && title.length < currentLongestString.length){
                        
            //             // return false;
            //             delete candidates[currentLongestString];
            //             candidates[title] = item;
            //             let longestString = "";
            //             const candidatesArray = Object.keys(candidates);
            //             candidatesArray.forEach(element => {
            //                 if(element.length > longestString.length){
            //                     longestString = element;
            //                 }
            //             });
            //             currentLongestString = longestString;
            //             // currentLongestString = title;

            //         }
            //         if(candidatesAdded < 5){
            //             candidatesAdded++;
            //         }
            //         // candidates.sort((a, b)=> {
            //         //     return a.substring(indexA, a.length-2).length > b.substring(indexB, b.length-2).length  ? 1 : -1;
            //         // });
            //         //track the longest title
            //         // if(title.length > currentLongestString.length){
            //         //     currentLongestString = title;
            //         // }
            //         // currentLongestString = title.length > currentLongestString.length ? title : currentLongestString;
            //     }
            //     return true;           
            // });

            // const resultArray = Object.keys(candidates);

            // //SORT ARRAY FROM SHORTEST to LONGEST SYMBOL LENGTH
            // resultArray.sort((a, b)=> {
            //     // alert("candidates" + JSON.stringify(candidates));
            //     // alert(", " + JSON.stringify(coinMap[candidates[a]]));
            //     const indexA = a.indexOf("(");
            //     const indexB = b.indexOf("(");
            //     // return coinMap[candidates[a].item].symbol.length > coinMap[candidates[b].item].symbol.length ? 1 : -1;
            //     return a.substring(indexA+1, a.length-1).length > b.substring(indexB+1, b.length-1).length  ? 1 : -1;
            // });
            const resultArray = getSearchResultList(text);
            setFirstInputResults(resultArray);

            // alert("candidates: " + JSON.stringify(resultArray));

        }else{
            setFirstInputResults([]);
        }
    }

    const onChangeInput2 = (text) => {
        setSecondInputValue(text);
        if(text){
            const resultArray = getSearchResultList(text);
            setSecondInputResults(resultArray);

        }else{
            setSecondInputResults([]);
        }

    }
    
    const inputText1Corners = firstInputResults.length > 0 ? "rounded-t-lg" : "rounded-lg";
    const inputText2Corners = secondInputResults.length > 0 ? "rounded-t-lg" : "rounded-lg";

    return (
        <div className={`flex md:flex-row flex-col bg-[#42f5bf] p-4 z-10 rounded-lg ${props.className}`}>

            <div
                className={`md:w-60 w-60 h-12 border-gray border-1 ${inputText1Corners} z-20  ${textboxColor1}`}
                ref={textboxCointainerRef1}
            >
                
                <div className='absolute md:w-60 w-60'>
                    <SearchIcon className='ml-2 mr-2' />
                    <input 
                        className={`md:w-48 w-48 h-12 focus:outline-none ${textboxColor1}`}
                        type="text" 
                        name="name" 
                        placeholder="Coin1" 
                        value={firstInputValue}
                        onChange={e => {
                            const keyword = e.target.value;
                            onChangeInput1(keyword);
                            // setFirstInput(keyword);
                            // handleOnChange(keyword);
                        }}
                        autoComplete={"off"}
                        ref={textboxRef1}
                    />
                    <div className='w-full bg-[white] rounded-b-lg'>
                        {
                            firstInputResults.map(result =>
    
                                <button className="w-full h-12 bg-[white] border-t-2 border-gray-100 rounded-lg" type="button" onClick={() => handleResultClick(result)}>{result}</button>

                            )
                        }
                    </div>
                </div>

            </div>
            
            <div className='text-center md:ml-6 md:mt-0 md:mb-0 mt-2 mb-2'>
                <h1 className='md:text-4xl text-2xl'>{"/"}</h1>
            </div>
            

            <div
                className={`md:w-60 w-60 h-12 flex-column  border-white border-1 ${inputText2Corners} ${textboxColor2} md:ml-6 md:mt-0 mt-2`}
                ref={textboxCointainerRef2}
            >
                <div className='absolute md:w-60 w-60 '>
                    <SearchIcon className='ml-2 mr-2'/>
                    <input 
                        className={`md:w-48 w-48 h-12 focus:outline-none ${textboxColor2} `}
                        type="text" 
                        name="name" 
                        placeholder="Coin2 (denomination)"
                        value={secondInputValue}
                        onChange={e => {
                            const keyword = e.target.value;
                            onChangeInput2(keyword);
                        }}
                        autoComplete={"off"}
                        ref={textboxRef2}
                    />
                    <div className='w-full bg-[white] rounded-b-lg '>
                        {
                            secondInputResults.map(result =>
                                <button className="w-full h-12 bg-[white] border-t-2 border-gray-100 rounded-lg" type="button" onClick={() => handleSecondResultClick(result)}>{result}</button>
                            )
                        }
                    </div>
                </div>
            </div>

            <div className='items-center text-center md:ml-16 md:mt-0 mt-10'>
                <button className="w-36 h-12 bg-[#178735] text-white rounded-lg" type="button" onClick={() => handleSubmit()}>{"Get Pair"}</button>
            </div>
 
        </div>
    )
}

export default InputPair;