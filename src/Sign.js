import React from 'react';
import { useLocation } from 'react-router-dom';

export default function Sign() {

    const { pathname } = useLocation();

    const pathSignIn = pathname === '/sign-in';

    return (

        <form className="w-50 border m-auto">

            <h3 className="text-center">{pathSignIn ? 'Sign in' : 'Sign up'}</h3>

            <div className="input-group mb-3">

                <input type="text" className="form-control" placeholder="User name"/>

                <div className="input-group-append">

                    <button className="btn btn-outline-secondary" type="button">&spades;</button>

                </div>

            </div>

        </form>

    );

}