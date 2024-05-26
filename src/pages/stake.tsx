import axios from 'axios';
import React, {useEffect, useState} from 'react';
import { toast } from 'react-toastify';
import sol from './solana.png';
import btc from './bitcoin.png';
import circle from './circle.svg';
import { API_ENDPOINT } from '../constants';
import FilterDemo from "../components/dropdown";
import {InputNumber, InputNumberValueChangeEvent} from "primereact/inputnumber";
import {InputText} from "primereact/inputtext";

export function Stake(
    {
        stakeFunction,
        getStBalance
    }:{
        stakeFunction: (nominators: string[], amounts: bigint[], signature: any) => Promise<any>,
        getStBalance: () => Promise<string>
    }) {

    const [amount, setAmount] = useState(1000);
    const [isFetching, setIsFetching] = useState(false);
    const [balance, setBalance] = useState('0');
    const [address, setAddress] = useState('');
    const [toBtc, setToBtc] = useState(false);

const handleMint = async (e: any) => {
    setIsFetching(true);
    try {
        e.preventDefault();
        // axios
        const decimalAmount = BigInt(amount * 10 ** 18).toString();
        const res = await axios.get(API_ENDPOINT + '/api/path/staking' + `?amount=${decimalAmount}`);

        const arrBigInt = Array(res.data.amounts).map(amount => BigInt(Number(amount)));
        console.log( res.data.candidates,
            arrBigInt,
            res.data.signature);
        await stakeFunction(
            res.data.candidates,
            arrBigInt,
            res.data.signature
        );
        toast.info('Staking successful! 🎉');
        const balance = await getStBalance();
        setBalance(balance);
    } catch (e) {
        toast.error("Something went wrong!Sorryㅎㅎ", );
    }
    setIsFetching(false);
}

  return (
      <div className={'bfc'}>

              <div className={'text-center'}>
                  <br/>
                  <h2>
                      Bridge Memes
                  </h2>

                  <div className={'mint'}>
                     <div>
                         <div className={'row'}>
                         <div className={'col-9 text-left'}>
                             From
                         </div>
                             <div className={'col-3 text-right'}>
                                To
                            </div>
                         </div>
                         <div className={'card p-3 flex flex-row justify-content-between'}>
                             <div>
                                 <img src={toBtc ? sol : btc} alt="btc" className={'asset'} width={'30px'} />
                                 <span className={'m-1'}> {toBtc ? 'Solana' : 'Bitcoin'} </span>
                             </div>
                             <div style={{cursor: 'pointer'}}
                             onClick={() => setToBtc(!toBtc)}
                             >
                                 <img src={circle} alt="arrow" width={'30px'}/>
                             </div>
                               <div>
                                   <span className={'m-1'}> {toBtc ? 'Bitcoin' : 'Solana'}</span>
                                   <img src={toBtc ? btc : sol} alt="sol" className={'asset'} width={'30px'} />
                               </div>

                         </div>
                         <br/>
                         <div className={'text-left'}>
                             Asset
                         </div>
                         <FilterDemo/>
                         <br/>
                         <div className={'text-left'}>
                             Amount
                         </div>
                         <div className="card flex justify-content-center">
                             <InputNumber variant="filled" value={amount} onValueChange={(e: InputNumberValueChangeEvent) => setAmount(Number(e.value))} mode="decimal" minFractionDigits={2} />
                         </div>
                         <br/>

                         <div className={'text-left'}>
                           Receiver  address
                         </div>
                         <div className="card flex justify-content-center">
                         <InputText value={address} onChange={(e) => setAddress(e.target.value)}
                         placeholder={'8k87ahQ....v8qRihCK7'}
                         />
                         </div>
                         <br/>

                         <button
                             className={'bfc-btn'}
                             onClick={handleMint}
                             disabled={isFetching}
                         >{isFetching ? "Processing..." : "Bridge"}
                         </button>
                     </div>
                  </div>
              </div>
          </div>
  );
}