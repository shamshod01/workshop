
import React, { useState } from "react";
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import coin1 from './coin1.jpg';
import coin2 from './coin2.webp';
import coin3 from './coin3.webp';
interface Country {
    name: string;
    code: string;
    img?: string;
}

export default function FilterDemo() {
    const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
    const countries: Country[] = [
        { name: 'Z•Z•Z•Z•Z•FEHU•Z•Z•Z•Z•Z', code: 'AU', img: coin1 },
        { name: 'DOG•GO•TO•THE•MOON', code: 'BR', img: coin2 },
        { name: 'RSIC•GENESIS•RUNE', code: 'CN', img: coin3 }
    ];

    const selectedCountryTemplate = (option: Country, props:any) => {
        if (option) {
            return (
                <div className="row justify-content-between">
                    <div className={'col-2'}>
                        <img alt={option.name}
                             src={option.img}
                             className={`asset`}
                             style={{ width: '50px' }} />
                    </div>

                    <div className={'col-10 align-self-center'}>
                        <span>
                        {option.name}
                        </span>
                    </div>
                </div>
            );
        }

        return <span>{props.placeholder}</span>;
    };

    const countryOptionTemplate = (option: Country) => {
        return (
            <div className="row justify-content-between">
                <div className={'col-2'}>
                    <img alt={option.name}
                         src={option.img}
                         className={`asset`}
                         style={{ width: '50px' }} />
                </div>

                <div
                className={'col-9 align-self-center'}
                >{option.name}</div>
            </div>
        );
    };

    return (
        <div className="card flex justify-content-center">
            <Dropdown value={selectedCountry} onChange={(e: DropdownChangeEvent) => setSelectedCountry(e.value)} options={countries} optionLabel="name" placeholder="Select a Asset"
                      filter valueTemplate={selectedCountryTemplate} itemTemplate={countryOptionTemplate} className="w-full md:w-14rem" />
        </div>
    )
}
