import React, { useState, useContext } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {modal_bg, btn_link, w_30, border_primary, float_right_sm, opacity_1, btn_primary_hover, dropdown_title, dropdown_title_hover, img_40x40, nav_brand, dropdown_img_40x40_hover, rounded_0_bottom, notification_in_line, img_20x20, img_20x20_hover, sign_out_arrow, sign_out_arrow_hover, nav_border_bottom} from './link/Style.module.css';
import 'firebase/auth';
import firebase from 'firebase/app';
import { authContext } from './global/AuthenticationContext';
import userStandardImg from './User standard image.jpg';

export default function Header() {

    const {isSignedIn, photoURL, uid, displayName} = useContext(authContext);

    const [dropdownHovers, setDropdownHovers] = useState({

        viewProfileHover: false,
        singOutHover: false
    });

    const pathViewProfile = (useLocation() === '')

    // Modifying the modal

    const [modalConditioner, setModalConditioner] = useState(false);

    const [signModifier, setSignModifier] = useState(true);

    const [forgotPass, setForgotPass] = useState(false);

    // Modifying the modal

    const [dropdownToggle, setDropdownToggle] = useState(true);

    // Inputs

    const inputValuesInitial = {

        email: '',
        password: '',
        first: '',
        last: '',
        month: '',
        day: '',
        year: ''
    };

    const inputErrorsInitial = {

        reset: '',
        in: '',
        up: ''
    }

    const errorBordersInitial = {

        email: false,
        password: false,
        first: false,
        last: false,
        year: false,
        month: false,
        day: false

    }

    const [errorBorders, setErrorBorders] = useState(errorBordersInitial)

    const [inputValues, setInputValues] = useState(inputValuesInitial);

    const [resetFailed, setResetFailed] = useState(false);

    const [inputErrors, setInputErrors] = useState(inputErrorsInitial);

    // Inputs

    // Functions - Utility

    function inputControl(e) {

        if (e.target.name === 'email') {

            setInputValues({...inputValues, [e.target.name]: e.target.value.substring(0, 32)});

        }

        if (e.target.name === 'password') {

            setInputValues({...inputValues, [e.target.name]: e.target.value.substring(0, 20)});

        }

        if (e.target.name === 'first') {

            setInputValues({...inputValues, [e.target.name]: e.target.value.substring(0, 15)});

        }

        if (e.target.name === 'last') {
            
            setInputValues({...inputValues, [e.target.name]: e.target.value.substring(0, 15 )});
            
        }

        if (e.target.name === 'month') {

            setInputValues({...inputValues, [e.target.name]: e.target.value});

        }

        if (e.target.name === 'year') {

            setInputValues({...inputValues, [e.target.name]: e.target.value});

        }

        if (e.target.name === 'day') {

            setInputValues({...inputValues, [e.target.name]: e.target.value});

        }
        
    }

    function inputValidation() {

        let validationBoolean = true;

        const updatedErrors = {...errorBorders};

        if (inputValues.email === '' || inputValues.email.includes(' ') || inputValues.email.replace(/[^@]/g, "").length !== 1 || inputValues.email.replace(/[^.]/g, "").length !== 1 || inputValues.email.split('@')[0].length < 4 || inputValues.email.split('@')[1].length < 3 || inputValues.email.split('.')[1].length < 2) {
            
            updatedErrors.email = true;

            validationBoolean = false;

        } else {

            updatedErrors.email = false;

        }

        if (!forgotPass) {

            if (inputValues.password === "" || inputValues.password.length < 8) {

                updatedErrors.password = true;
    
                validationBoolean = false;
    
            } else { 
    
                updatedErrors.password = false;
    
            }

        }
            
        if (!signModifier) {

            if (!(/^[a-zA-Z]*$/.test(inputValues.first)) || inputValues.first === "" || inputValues.first.length < 3) {

                updatedErrors.first = true;
    
                validationBoolean = false;
    
            } else {
    
                updatedErrors.first = false;
    
            }
    
            if (!(/^[a-zA-Z]*$/.test(inputValues.last)) ||  inputValues.last === "" || inputValues.last.length < 3) {
    
                updatedErrors.last = true;
    
                validationBoolean = false;
    
            } else {
    
                updatedErrors.last = false;
    
            }
    
            if (inputValues.year === "") {
    
                updatedErrors.year = true;
    
                validationBoolean = false;
    
            } else {
    
                updatedErrors.year = false;
    
            }
    
            if (inputValues.month === "") {
    
                updatedErrors.month = true;
    
                validationBoolean = false;
    
            } else {
    
                updatedErrors.month = false;
    
            }
    
            if (inputValues.day === "") {
    
                updatedErrors.day = true;
    
                validationBoolean = false;
    
            } else {
    
                updatedErrors.day = false;
    
            }

        }

        setErrorBorders(updatedErrors);

        return validationBoolean;

    }

    // Functions - Utility

    // Functions - Sign

    function sign(e) {

        e.preventDefault();

        setInputErrors(inputErrorsInitial);
        
        if (!inputValidation()) {

            return;

        }

        if (signModifier) {

            firebase.auth().signInWithEmailAndPassword(inputValues.email, inputValues.password).then(function() {

                setModalConditioner(false);
                setSignModifier(true);
                setInputValues(inputValuesInitial);

            }).catch(function(error) {

                setInputErrors({...inputErrors, in: error.message});

            });

        } else {

            firebase.auth().createUserWithEmailAndPassword(inputValues.email, inputValues.password).then(function() {

                firebase.auth().currentUser.updateProfile({

                    displayName: `${inputValues.first} ${inputValues.last}`,

                }).then(function() {
    
                        firebase.auth().currentUser.sendEmailVerification().then(function() {
                            
                            setModalConditioner(false);
                            setSignModifier(true);
                            setInputValues(inputValuesInitial); 
    
                        });

                });

            }).catch(function(error) {
            
                setInputErrors({...inputErrors, up: error.message});

            });

        }

    }

    function resetPassword(e) {

        e.preventDefault();

        setInputErrors(inputErrorsInitial);

        firebase.auth().sendPasswordResetEmail(inputValues.email).then(function() {

            setResetFailed(false);
            setModalConditioner(false);
            setForgotPass(false);
            setInputValues(inputValuesInitial);
            setSignModifier(true);

          }).catch(function(error) {

              setResetFailed(true);

            if (error.code !== "auth/invalid-email") {

                setInputErrors({...inputErrors, reset: error.message});

            }

          });

    }

    // Function - Sign

    return (

        <nav className={`navbar navbar-expand navbar-dark bg-primary font-weight-bold py-0 ${nav_border_bottom}`}>

            <span className={`navbar-brand ${nav_brand}`} to="/">Socialize it</span>

            <div className="collapse navbar-collapse">

                <ul className="navbar-nav w-100">

                {isSignedIn ? (

                    <li className="nav-item ml-auto">

                        <div className="dropdown" onMouseEnter={function () {dropdownToggle ? setDropdownToggle(false) : setDropdownToggle(true)}} onMouseLeave={function() {setDropdownToggle(true)}}>

                            <div className={`btn font-weight-bold text-nowrap rounded-top border-0 d-flex pb-1 ${rounded_0_bottom} ${dropdown_title} ${!dropdownToggle && dropdown_title_hover}`}>

                                <div>

                                    <img src={photoURL === null ? userStandardImg : photoURL} alt="" className={`float-left rounded-circle mr-1 ${img_40x40} ${!dropdownToggle && dropdown_img_40x40_hover}`}/>

                                </div>

                                <div className="pt-2">{firebase.auth().currentUser.displayName}</div>

                            </div>

                            <div className={`position-absolute rounded-bottom w-100 text-center border bg-primary pl-2 pr-2 ${dropdownToggle && 'd-none'}`}>

                                <div className="border-bottom d-flex justify-content-center align-items-center">

                                    <a href="/chat" className="nav-link m-auto">Chat &#128172;</a>

                                    <div className={`bg-danger text-white rounded-circle px-2 ml-auto d-none ${notification_in_line}`}>1</div>

                                </div>

                                <a href={`/${displayName}_${uid}`} className="nav-link border-bottom" onMouseEnter={function() { setDropdownHovers({...dropdownHovers, viewProfileHover: true}) }} onMouseLeave={function () { setDropdownHovers({...dropdownHovers, viewProfileHover: false})}}>View Profile <img className={`rounded-circle ${img_20x20} ${dropdownHovers.viewProfileHover && img_20x20_hover}`} src={photoURL === null ? userStandardImg : photoURL} alt=""/></a>

                                <a href="/settings" className="nav-link border-bottom">Settings &#9881;</a>

                                <div className="btn font-weight-bold nav-link" onMouseEnter={function() {setDropdownHovers( {...dropdownHovers, signOutHover: true})} } onMouseLeave={function() { setDropdownHovers({...dropdownHovers, signOutHover: false})} } onClick={function() { firebase.auth().signOut(); setDropdownToggle(true)}}>Sign Out <span className={`rounded-left ml-1 rounded-bottom rounded-top ${sign_out_arrow} ${dropdownHovers.signOutHover && sign_out_arrow_hover}`}>&#10152;</span></div>

                            </div>
                            
                        </div>

                    </li>

                ) : (

                    <li className="nav-item ml-auto">

                        <button 
                        className="nav-link btn text-nowrap font-weight-bold"
                        type="button"
                        onClick={function() {

                            setModalConditioner(true);

                        }}>
                            Sign in
                        </button>

                        {/* Modal */}

                        <div
                        className={`modal ${modal_bg} ${modalConditioner && 'd-block'}`}
                        tabIndex="-1"
                        onKeyUp={function(e) {

                            if (e.key === 'Escape') {

                                setModalConditioner(false);
                                setSignModifier(true);
                                setInputValues(inputValuesInitial);
                                setForgotPass(false);
                                setResetFailed(false);
                                setInputErrors(inputErrorsInitial);
                                setErrorBorders(errorBordersInitial);

                            }

                        }}>

                            <div className="modal-dialog">

                                {forgotPass ? (

                                    <div className="modal-dialog">

                                        <form className="modal-content p-3" onSubmit={resetPassword}>

                                            <div className="modal-header">

                                                <h5 className="modal-title text-primary text-center w-100 font-weight-bold">Reset your password</h5>

                                                <button
                                                type="button"
                                                className={`close p-1 btn text-primary ${opacity_1} ${btn_primary_hover}`}
                                                onClick={function() {

                                                    setModalConditioner(false);
                                                    setSignModifier(true);
                                                    setInputValues(inputValuesInitial);
                                                    setForgotPass(false);
                                                    setResetFailed(false);
                                                    setInputErrors(inputErrorsInitial);
                                                    setErrorBorders(errorBordersInitial);


                                                }}>

                                                    &times;

                                                </button>

                                            </div>

                                            <div className="modal-body">

                                                <p>Please provide your email adress in order to reset your password:</p>

                                                <input type="text" placeholder="Email" className={`form-control mb-2 ${resetFailed && 'is-invalid'}`} autoComplete="username" name="email" onChange={inputControl} value={inputValues.email}/>

                                                <div className={`invalid-feedback d-block`}>{inputErrors.reset}</div>

                                            </div>

                                            <div className="modal-footer">

                                                <button className="btn btn-primary form-control">Send reset password email</button>

                                            </div>

                                            <div className="modal-footer">

                                                <button type="button" className="btn btn-primary form-control" onClick={function() {setForgotPass(false); setInputValues(inputValuesInitial); setResetFailed(false); setInputErrors(inputErrorsInitial); setErrorBorders(errorBordersInitial); }}>Back to sign in</button>

                                            </div>

                                        </form>

                                    </div>

                                ) : (

                                    <form className={`modal-content p-3 ${border_primary}`} onSubmit={sign}>

                                        {signModifier ? (

                                            // Sign in

                                            <>

                                                <div className="modal-header">

                                                    <h4 className="modal-title text-center w-100 text-primary font-weight-bold">Sign in</h4>
                                                    <button
                                                    type="button"
                                                    className={`close p-0 btn text-primary ${opacity_1} ${btn_primary_hover}`}
                                                    aria-label="Close"
                                                    onClick={function() {

                                                        setModalConditioner(false);
                                                        setInputValues(inputValuesInitial);
                                                        setErrorBorders(errorBordersInitial);
                                                        setInputErrors(inputErrorsInitial);

                                                    }}>
                                                    <span aria-hidden="true">&times;</span>
                                                    </button>

                                                </div>

                                                <div className="modal-body">

                                                    <input type="text" placeholder="Email" className={`form-control mb-2 ${errorBorders.email && 'is-invalid'}`} autoComplete="username" name="email" onChange={inputControl} value={inputValues.email}/>
                                                    <input type="password" placeholder="Password" className={`form-control ${errorBorders.password && 'is-invalid'}`} autoComplete="current-password" name="password" onChange={inputControl} value={inputValues.password}/>


                                                    <div className="custom-control custom-checkbox mt-3">

                                                        <input type="checkbox" className="custom-control-input" id="customCheck1"/>
                                                        <label className="custom-control-label mr-2" htmlFor="customCheck1">Remember email</label>
                                                        <span className={`${float_right_sm} ${btn_link}`} onClick={function() { setForgotPass(true); setInputValues(inputValuesInitial); setErrorBorders(errorBordersInitial); setInputErrors(inputErrorsInitial); }}>Forgot your password ?</span>

                                                    </div>

                                                    <div className="invalid-feedback d-block mt-3">{inputErrors.in}</div>

                                                </div>

                                                <div className="modal-footer">

                                                    <button className="btn btn-primary w-100">Sign in</button>

                                                </div>

                                                <div className="modal-footer">

                                                    <input type="button" className="btn btn-success w-100" value="Create an account"
                                                    onClick={function() {

                                                        setSignModifier(false);
                                                        setInputValues(inputValuesInitial);
                                                        setErrorBorders(errorBordersInitial);
                                                        setInputErrors(inputErrorsInitial)

                                                    }}/>

                                                </div>

                                            </>

                                        ) : ( 

                                            // Sign Up

                                            <>

                                                <div className="modal-header">

                                                    <h4 className="modal-title text-center w-100 text-primary font-weight-bold">Sign up</h4>
                                                    <button
                                                    type="button"
                                                    className={`close p-0 btn text-primary ${opacity_1} ${btn_primary_hover}`}
                                                    aria-label="Close"
                                                    onClick={function() {

                                                        setModalConditioner(false);
                                                        setSignModifier(true);
                                                        setInputValues(inputValuesInitial);
                                                        setErrorBorders(errorBordersInitial);
                                                        setInputErrors(inputErrorsInitial)

                                                    }}>

                                                        <span aria-hidden="true">&times;</span>

                                                    </button>

                                                </div>

                                                <div className="modal-body">

                                                    <div className="row">

                                                        <div className="col-sm mb-2">

                                                            <input type="text" placeholder="First name" name="first" className={`form-control ${errorBorders.first && 'is-invalid'}`} onChange={inputControl} value={inputValues.first}/>

                                                        </div>

                                                        <div className="col-sm mb-2">

                                                            <input type="text" placeholder="Last name" name="last" className={`form-control ${errorBorders.last && 'is-invalid'}`} onChange={inputControl} value={inputValues.last}/>

                                                        </div>

                                                    </div>

                                                    <label className="d-inline">

                                                        <span className="d-block mb-1 text-center">Birthday</span>

                                                        <div className="row ml-0 w-100 justify-content-between">

                                                            <div className={`${w_30} text-center`}>

                                                                <select className={`custom-select col mb-2 text-center ${errorBorders.month && 'is-invalid'}`} size="2" name="month" value={inputValues.month} onChange={inputControl}>

                                                                    <option value="1">Jan</option>
                                                                    <option value="2">Feb</option>
                                                                    <option value="3">March</option>
                                                                    <option value="4">April</option>
                                                                    <option value="5">May</option>
                                                                    <option value="6">June</option>
                                                                    <option value="7">July</option>
                                                                    <option value="8">Aug</option>
                                                                    <option value="9">Sept</option>
                                                                    <option value="10">Oct</option>
                                                                    <option value="11">Nov</option>
                                                                    <option value="12">Dec</option>

                                                                </select>

                                                            </div>

                                                            <div className={`${w_30}`}>

                                                                <select className={`custom-select col mb-2 text-center ${errorBorders.day && 'is-invalid'}`} size="2" name="day" value={inputValues.day} onChange={inputControl}>

                                                                    <option value="1">1</option>
                                                                    <option value="2">2</option>
                                                                    <option value="3">3</option>
                                                                    <option value="4">4</option>
                                                                    <option value="5">5</option>
                                                                    <option value="6">6</option>
                                                                    <option value="7">7</option>
                                                                    <option value="8">8</option>
                                                                    <option value="9">9</option>
                                                                    <option value="10">10</option>
                                                                    <option value="11">11</option>
                                                                    <option value="12">12</option>
                                                                    <option value="13">13</option>
                                                                    <option value="14">14</option>
                                                                    <option value="15">15</option>
                                                                    <option value="16">16</option>
                                                                    <option value="17">17</option>
                                                                    <option value="18">18</option>
                                                                    <option value="19">19</option>
                                                                    <option value="20">20</option>
                                                                    <option value="21">21</option>
                                                                    <option value="22">22</option>
                                                                    <option value="23">23</option>
                                                                    <option value="24">24</option>
                                                                    <option value="25">25</option>
                                                                    <option value="26">26</option>
                                                                    <option value="27">27</option>
                                                                    <option value="28">28</option>
                                                                    <option value="29">29</option>
                                                                    <option value="30">30</option>
                                                                    <option value="31">31</option>

                                                                </select>

                                                            </div>

                                                            <div className={`${w_30}`}>

                                                                <select className={`custom-select col mb-2 text-center ${errorBorders.year && 'is-invalid'}`} name="year" size="2" value={inputValues.year} onChange={inputControl}>

                                                                    <option value="2004">2005</option>
                                                                    <option value="2004">2004</option>
                                                                    <option value="2003">2003</option>
                                                                    <option value="2002">2002</option>
                                                                    <option value="2001">2001</option>
                                                                    <option value="2000">2000</option>
                                                                    <option value="1999">1999</option>
                                                                    <option value="1998">1998</option>
                                                                    <option value="1997">1997</option>
                                                                    <option value="1996">1996</option>
                                                                    <option value="1995">1995</option>
                                                                    <option value="1994">1994</option>
                                                                    <option value="1993">1993</option>
                                                                    <option value="1992">1992</option>
                                                                    <option value="1991">1991</option>
                                                                    <option value="1990">1990</option>
                                                                    <option value="1989">1989</option>
                                                                    <option value="1988">1988</option>
                                                                    <option value="1987">1987</option>
                                                                    <option value="1986">1986</option>
                                                                    <option value="1985">1985</option>
                                                                    <option value="1984">1984</option>
                                                                    <option value="1983">1983</option>
                                                                    <option value="1982">1982</option>
                                                                    <option value="1981">1981</option>
                                                                    <option value="1980">1980</option>
                                                                    <option value="1979">1979</option>
                                                                    <option value="1978">1978</option>
                                                                    <option value="1977">1977</option>
                                                                    <option value="1976">1976</option>
                                                                    <option value="1975">1975</option>
                                                                    <option value="1974">1974</option>
                                                                    <option value="1973">1973</option>
                                                                    <option value="1972">1972</option>
                                                                    <option value="1971">1971</option>
                                                                    <option value="1970">1970</option>
                                                                    <option value="1969">1969</option>
                                                                    <option value="1968">1968</option>
                                                                    <option value="1967">1967</option>
                                                                    <option value="1966">1966</option>
                                                                    <option value="1965">1965</option>
                                                                    <option value="1964">1964</option>
                                                                    <option value="1963">1963</option>
                                                                    <option value="1962">1962</option>
                                                                    <option value="1961">1961</option>
                                                                    <option value="1960">1960</option>
                                                                    <option value="1959">1959</option>
                                                                    <option value="1958">1958</option>
                                                                    <option value="1957">1957</option>
                                                                    <option value="1956">1956</option>
                                                                    <option value="1955">1955</option>
                                                                    <option value="1954">1954</option>
                                                                    <option value="1953">1953</option>
                                                                    <option value="1952">1952</option>
                                                                    <option value="1951">1951</option>
                                                                    <option value="1950">1950</option>
                                                                    <option value="1949">1949</option>
                                                                    <option value="1948">1948</option>
                                                                    <option value="1947">1947</option>
                                                                    <option value="1946">1946</option>
                                                                    <option value="1945">1945</option>
                                                                    <option value="1944">1944</option>
                                                                    <option value="1943">1943</option>
                                                                    <option value="1942">1942</option>
                                                                    <option value="1941">1941</option>
                                                                    <option value="1940">1940</option>
                                                                    <option value="1939">1939</option>
                                                                    <option value="1938">1938</option>
                                                                    <option value="1937">1937</option>
                                                                    <option value="1936">1936</option>
                                                                    <option value="1935">1935</option>
                                                                    <option value="1934">1934</option>
                                                                    <option value="1933">1933</option>
                                                                    <option value="1932">1932</option>
                                                                    <option value="1931">1931</option>
                                                                    <option value="1930">1930</option>
                                                                    <option value="1929">1929</option>
                                                                    <option value="1928">1928</option>
                                                                    <option value="1927">1927</option>
                                                                    <option value="1926">1926</option>
                                                                    <option value="1925">1925</option>
                                                                    <option value="1924">1924</option>
                                                                    <option value="1923">1923</option>
                                                                    <option value="1922">1922</option>
                                                                    <option value="1921">1921</option>
                                                                    <option value="1920">1920</option>
                                                                    <option value="1919">1919</option>
                                                                    <option value="1918">1918</option>
                                                                    <option value="1917">1917</option>
                                                                    <option value="1916">1916</option>
                                                                    <option value="1915">1915</option>

                                                                </select>

                                                            </div>


                                                        </div>

                                                    </label> 

                                                    <input type="text" placeholder="Email" className={`form-control mb-2 ${errorBorders.email && 'is-invalid'}`} autoComplete="username" name="email" onChange={inputControl} value={inputValues.email}/>
                                                    <input type="password" placeholder="Password" className={`form-control ${errorBorders.password && 'is-invalid'}`} autoComplete="current-password" name="password" onChange={inputControl} value={inputValues.password}/>


                                                </div>

                                                <div className="invalid-feedback d-block mb-2 ml-3">{inputErrors.up}</div>

                                                <div className="modal-footer">

                                                    <button className="btn btn-success w-100">Sign up</button>

                                                </div>

                                                <div className="modal-footer justify-content-center">

                                                    <span>Already got an account? <span className={`${btn_link}`} onClick={function() { setSignModifier(true); setInputValues(inputValuesInitial); setErrorBorders(errorBordersInitial); setInputErrors(inputErrorsInitial)}}>Sign in</span></span>

                                                </div>

                                            </>

                                        )}

                                    </form>

                                )}

                            </div>

                        </div>

                    </li>

                )}
                   
                </ul>
                 
            </div>
        
        </nav>

    );

}