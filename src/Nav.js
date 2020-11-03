import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

export default function Nav() {

    const [modalConditioner, setModalConditioner] = useState(0);

    return (

        <nav className="navbar navbar-expand navbar-dark bg-dark font-weight-bold">

            <Link className="navbar-brand" to="/">Games App</Link>

            <div className="collapse navbar-collapse">

                <ul className="navbar-nav w-100">

                    <li className="nav-item ml-auto">

                        <button 
                        className="nav-link btn font-weight-bold"
                        type="button"
                        onClick={function() {

                            setModalConditioner(1);
                            document.querySelector('[data-modals-sign="email"]').focus();

                        }}>
                            Sign in
                        </button>

                        <form
                        className={`modal ${modalConditioner === 1 && 'd-block'}`}
                        tabIndex="-1"
                        role="dialog"
                        onKeyUp={function(e) {

                            e.key === 'Escape' && setModalConditioner(0);

                        }}
                        >

                            <div className="modal-dialog" role="document">

                                <div className="modal-content">

                                    <div className="modal-header">

                                        <h5 className="modal-title text-center w-100">Sign in</h5>
                                        <button
                                        type="button"
                                        className="close"
                                        data-dismiss="modal"
                                        aria-label="Close"
                                        onClick={function() {

                                            setModalConditioner(0);

                                        }}>
                                        <span aria-hidden="true">&times;</span>
                                        </button>

                                    </div>

                                    <div className="modal-body">

                                        <input type="text" placeholder="Email" className="" data-modals-sign="email"/>

                                    </div>

                                    <div className="modal-footer">

                                        <button type="button" className="btn btn-primary">Sign in</button>

                                    </div>

                                </div>

                            </div>

                        </form>

                    </li>
                   
                </ul>
                 
            </div>
        
        </nav>

    );

}