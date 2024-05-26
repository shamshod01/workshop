import React from "react";
import logo from './bido.png'

import {Link} from "react-router-dom";
import {useWallet} from "../wallet";

export function Navbar({connectWallet, account}:{connectWallet: () => void, account: string | undefined}):React.JSX.Element {
    const { info, setInfo, setApi } = useWallet()


    return (
        <nav className="navbar navbar-expand navbar-light bg-light">
            <div className="container-fluid">
                <a className="navbar-brand" href="#">
                    <img src={logo} alt="" width="30" height="30" className="d-inline-block align-text-center"/>
                    {"  Arrow Bridge"}
                </a>
                <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                    <div className="navbar-nav">
                        <Link className="nav-link " aria-current="page" to={'/'}>Home</Link>
                        <Link className="nav-link" to={'/bridge'}>Bridge</Link>
                    </div>
                </div>
                <span className="navbar-text">
               {info?.address ? <div>{info.address}</div> :<button className={'btn btn-primary btn-wallet'}
                                                              onClick={connectWallet}
                >Connect Wallet</button>}
      </span>
            </div>
        </nav>
    );
}