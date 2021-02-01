import React, { useState, useContext, useRef} from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {modal_bg, btn_link, w_30, border_primary, float_right_sm, opacity_1, btn_primary, dropdown_title, img_40x40, nav_brand, rounded_0_bottom, notification_inline, img_20x20, nav_bar, dropdown_item_img, dropdown_header, up_back_to_in_container, input_autofilled, dropdown_toggle, back_modal, sign_select, dropdown_header_options, dropdown_header_options_other} from './styles/Style.module.css';
import 'firebase/auth';
import firebase from 'firebase/app';
import { authContext } from './global/AuthenticationContext';
import userStandardImg from './User standard image.jpg';
import SelectYear from './auxiliary/components/Select Year';
import { faArrowLeft, faCog, faComment, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Header() {

    const {isSignedIn, photoURL, uid, displayName} = useContext(authContext);

    const pathViewProfile = (useLocation().pathname === `/${displayName}_${uid}`);
    const pathSettings = (useLocation().pathname === "/settings");
    const pathChat = (useLocation().pathname === "/chat");

    const focusRef = useRef(null);

    const rememberCheckBoxRef = useRef(null);

    const rememberLabelRef = useRef(null);

    const signPasswordRef = useRef(null);

    const signResetRef = useRef(null);

    // Modifying the modal

    const [modalConditioner, setModalConditioner] = useState(false);

    const [signModifier, setSignModifier] = useState(true);

    const [forgotPass, setForgotPass] = useState(false);

    // Modifying the modal

    // Inputs

    const inputValuesInitial = {

        email: '',
        password: '',
        firstname: '',
        lastname: '',
        month: 'Jan',
        day: '01',
        year: '2020'
    };

    const inputErrorsInitial = {

        reset: '',
        in: '',
        up: ''
    }

    const errorBordersInitial = {

        email: false,
        password: false,
        firstname: false,
        lastname: false,
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

        if (e.target.name === 'firstname') {

            setInputValues({...inputValues, [e.target.name]: e.target.value.substring(0, 15)});

        }

        if (e.target.name === 'lastname') {
            
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

            if (!(/^[a-zA-Z]*$/.test(inputValues.firstname)) || inputValues.firstname === "" || inputValues.firstname.length < 3) {

                updatedErrors.firstname = true;
    
                validationBoolean = false;
    
            } else {
    
                updatedErrors.firstname = false;
    
            }
    
            if (!(/^[a-zA-Z]*$/.test(inputValues.lastname)) ||  inputValues.lastname === "" || inputValues.lastname.length < 3) {
    
                updatedErrors.lastname = true;
    
                validationBoolean = false;
    
            } else {
    
                updatedErrors.lastname = false;
    
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

            firebase.auth().signInWithEmailAndPassword(inputValues.email.toLowerCase().replace(/\s/g, ''), inputValues.password).then(function() {

                if (rememberCheckBoxRef.current.checked) {

                    document.cookie = `email=${inputValues.email}; expires=27 June ${new Date().getFullYear() + 10} 00:00:00`;

                } else {

                    document.cookie = `email=${inputValues.email}; expires=27 June 2000 00:00:00 `;

                }

                setModalConditioner(false);
                setSignModifier(true);
                setInputValues(inputValuesInitial);

            }).catch(function(error) {

                setInputErrors({...inputErrors, in: error.message});

            });

        } else {

            firebase.auth().createUserWithEmailAndPassword(inputValues.email, inputValues.password).then(function() {
                
                firebase.auth().currentUser.updateProfile({

                    displayName: `${inputValues.firstname[0].toUpperCase() + inputValues.firstname.substring(1, inputValues.firstname.length)} ${inputValues.lastname[0].toUpperCase() + inputValues.lastname.substring(1, inputValues.lastname.length)}`,

                }).then(function() {
    
                    firebase.auth().currentUser.sendEmailVerification().then(function() {

                        firebase.firestore().collection('users').doc(`${firebase.auth().currentUser.uid}`).set({posts: [], postsIds: [], commentsIds: [], joinDate: new Date(), birthday: `${inputValues.month} ${inputValues.day}, ${inputValues.year}`}).then(function() {
                        
                            window.location.href = '/';
                            setSignModifier(true);
                
                        })

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

    function escapeSign(e) {

        if (e.key === "Escape") {

            setModalConditioner(false);
            setSignModifier(true);
            setInputValues(inputValuesInitial);
            setForgotPass(false);
            setResetFailed(false);
            setInputErrors(inputErrorsInitial);
            setErrorBorders(errorBordersInitial);
            window.removeEventListener('keyup', escapeSign);
        }
    }

    return (

        <nav className={`navbar fixed-top navbar-expand navbar-dark font-weight-bold py-0 ${nav_bar}`}>

            <Link className={`navbar-brand ${nav_brand}`} to="/">Socialize it</Link>

            <div className="collapse navbar-collapse">

                <ul className="navbar-nav w-100">

                {isSignedIn ? (

                    <li className="nav-item ml-auto">

                        <div className={`dropdown ${dropdown_header}`}>

                            <div className={`btn font-weight-bold text-nowrap rounded-top border-0 d-flex pb-1 ${rounded_0_bottom} ${dropdown_title}`}>

                                <div>

                                    <img src={photoURL === null ? userStandardImg : photoURL} alt="" className={`float-left rounded-circle mr-1 ${img_40x40}`}/>

                                </div>

                                <div className="pt-2">{displayName}</div>

                            </div>

                            <div className={`position-absolute rounded-bottom w-100 text-center border-top pl-2 pr-2 ${dropdown_toggle}`}>

                                {!pathChat && (

                                    <div className={`d-flex justify-content-center align-items-center ${dropdown_header_options}`}>

                                        <a href="/chat" className={`nav-link m-auto `}>Chat <FontAwesomeIcon icon={faComment}/></a>

                                        <div className={`bg-danger text-white rounded-circle px-2 ml-auto d-none ${notification_inline}`}>1</div>

                                    </div>

                                )}

                                {!pathViewProfile && (

                                    <div className={`d-flex justify-content-center ${dropdown_header_options}`}>

                                        <a href={`/${displayName}_${uid}`} className={`nav-link position-relative ${dropdown_item_img}`}>View Profile <img className={`rounded-circle ${img_20x20}`} src={photoURL === null ? userStandardImg : photoURL} alt=""/></a>

                                    </div>


                                )}

                                {!pathSettings && (

                                    <div className={`d-flex justify-content-center ${dropdown_header_options_other} ${dropdown_header_options}`}>

                                        <a href="/settings" className={`nav-link`}>Settings <FontAwesomeIcon icon={faCog}/></a>

                                    </div>

                                )}

                                <div className="btn font-weight-bold nav-link" onClick={function() { firebase.auth().signOut();}}>Sign Out <FontAwesomeIcon icon={faSignOutAlt}/></div>

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
                            window.addEventListener('keyup', escapeSign);
                            
                            if (document.cookie.includes('email=')) {
                            
                                let cookiesEmail = document.cookie.split(';');
                                const cookiesEmailIndex = cookiesEmail.findIndex(el => el.includes('email='));

                                cookiesEmail = cookiesEmail[cookiesEmailIndex].split('=')[1];
                                setInputValues({...inputValues, email: cookiesEmail});
                                rememberCheckBoxRef.current.checked = true;
                                focusRef.current.classList.add(input_autofilled);
                                focusRef.current.addEventListener('input', () => focusRef.current.classList.remove(input_autofilled));
                                setTimeout(() => signPasswordRef.current.focus(), 0);

                            } else {

                                setTimeout(() => focusRef.current.focus(), 0);

                            }

                        }}>
                            Sign in
                        </button>

                        {/* Modal */}

                        <div className={`modal ${modal_bg} ${modalConditioner && 'd-block'}`} tabIndex="-1">

                            <div className="modal-dialog shadow">

                                {forgotPass ? (

                                    <div className="modal-dialog">

                                        <form className="modal-content p-3" onSubmit={resetPassword}>

                                            <div className="modal-header">

                                                <button type="button" className={`p-1 rounded border-0 bg-white text-primary ${back_modal} ${btn_primary}`} onClick={async function() {

                                                await setForgotPass(false);
                                                setInputValues(inputValuesInitial);
                                                setResetFailed(false); setInputErrors(inputErrorsInitial);
                                                setErrorBorders(errorBordersInitial);
                                                if (document.cookie.includes('email=')) {

                                                    let cookiesEmail = document.cookie.split(';');
                                                    const cookiesEmailIndex = cookiesEmail.findIndex(el => el.includes('email='));

                                                    cookiesEmail = cookiesEmail[cookiesEmailIndex].split('=')[1];
                                                    setInputValues({...inputValues, email: cookiesEmail});
                                                    focusRef.current.classList.add(input_autofilled);
                                                    focusRef.current.addEventListener('input', () => focusRef.current.classList.remove(input_autofilled));
                                                    rememberCheckBoxRef.current.checked = true;
                                                    setTimeout(() => signPasswordRef.current.focus(), 0);

                                                } else {

                                                    setTimeout(() => focusRef.current.focus(), 0);

                                                }} }><FontAwesomeIcon icon={faArrowLeft}/></button>

                                                <h5 className="modal-title text-primary text-center w-100">Reset your password</h5>

                                                <button
                                                type="button"
                                                className={`close p-1 btn text-primary ${opacity_1} ${btn_primary}`}
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

                                                <input type="text" ref={focusRef} placeholder="Email" className={`form-control mb-2 ${resetFailed && 'is-invalid'}`} autoComplete="username" name="email" onChange={inputControl} value={inputValues.email}/>

                                                <div className={`invalid-feedback d-block`}>{inputErrors.reset}</div>

                                            </div>

                                            <div className="modal-footer">

                                                <button className="btn btn-primary form-control" ref={signResetRef}>Send reset password email</button>

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
                                                    className={`close p-0 btn text-primary ${opacity_1} ${btn_primary}`}
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

                                                    <input type="text" placeholder="Email" ref={focusRef} className={`form-control mb-2 ${errorBorders.email && 'is-invalid'}`} autoComplete="username" name="email" onChange={inputControl} value={inputValues.email}/>
                                                    <input type="password" placeholder="Password" ref={signPasswordRef} className={`form-control ${errorBorders.password && 'is-invalid'}`} autoComplete="current-password" name="password" onChange={inputControl} value={inputValues.password}/>


                                                    <div className="custom-control custom-checkbox mt-3">

                                                        <input type="checkbox" className="custom-control-input" ref={rememberCheckBoxRef} id="customCheck1"/>
                                                        <label className="custom-control-label mr-2" ref={rememberLabelRef} htmlFor="customCheck1">Remember email</label>
                                                        <span className={`${float_right_sm} ${btn_link}`} tabIndex="0"
                                                        onClick={async function() {
                                                            await setForgotPass(true);
                                                            setInputValues(inputValuesInitial);
                                                            setErrorBorders(errorBordersInitial);
                                                            setInputErrors(inputErrorsInitial);
                                                            setTimeout(() => focusRef.current.focus(), 0);
                                                            if (document.cookie.includes('email=')) {
                                    
                                                                let cookiesEmail = document.cookie.split(';');
                                                                const cookiesEmailIndex = cookiesEmail.findIndex(el => el.includes('email='));
        
                                                                cookiesEmail = cookiesEmail[cookiesEmailIndex].split('=')[1];
                                                                focusRef.current.classList.add(input_autofilled);
                                                                focusRef.current.addEventListener('input', () => focusRef.current.classList.remove(input_autofilled));
                                                                setInputValues({...inputValues, email: cookiesEmail});
                                                                setTimeout(() => signResetRef.current.focus(), 0);
        
                                                            } else {
        
                                                                setTimeout(() => focusRef.current.focus(), 0);
        
                                                            }
                                                        }}>Forgot your password ?</span>

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
                                                        setInputErrors(inputErrorsInitial);
                                                        setTimeout(() => focusRef.current.focus(), 0);

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
                                                    className={`close p-0 btn text-primary ${opacity_1} ${btn_primary}`}
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

                                                            <input type="text" placeholder="First name" ref={focusRef} name="firstname" className={`form-control ${errorBorders.firstname && 'is-invalid'}`} onChange={inputControl} value={inputValues.firstname}/>

                                                        </div>

                                                        <div className="col-sm mb-2">

                                                            <input type="text" placeholder="Last name" name="lastname" className={`form-control ${errorBorders.lastname && 'is-invalid'}`} onChange={inputControl} value={inputValues.lastname}/>

                                                        </div>

                                                    </div>

                                                    <label className="d-inline">

                                                        <span className="d-block mb-1 text-center">Birthday</span>

                                                        <div className="row ml-0 w-100 justify-content-between">

                                                            <div className={`${w_30} text-center`}>

                                                                <select className={`custom-select col mb-2 text-center ${sign_select} ${errorBorders.month && 'is-invalid'}`} size="2" name="month" value={inputValues.month} onChange={inputControl}>

                                                                    <option value="January">Jan</option>
                                                                    <option value="February">Feb</option>
                                                                    <option value="March">March</option>
                                                                    <option value="April">April</option>
                                                                    <option value="May">May</option>
                                                                    <option value="June">June</option>
                                                                    <option value="July">July</option>
                                                                    <option value="August">Aug</option>
                                                                    <option value="Septeber">Sept</option>
                                                                    <option value="October">Oct</option>
                                                                    <option value="November">Nov</option>
                                                                    <option value="December">Dec</option>

                                                                </select>

                                                            </div>

                                                            <div className={`${w_30}`}>

                                                                <select className={`custom-select col mb-2 text-center ${sign_select} ${errorBorders.day && 'is-invalid'}`} size="2" name="day" value={inputValues.day} onChange={inputControl}>

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

                                                                <select className={`custom-select col mb-2 text-center ${sign_select} ${errorBorders.year && 'is-invalid'}`} name="year" size="2" value={inputValues.year} onChange={inputControl}>

                                                                    <SelectYear/>

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

                                                <div className={`modal-footer ${up_back_to_in_container}`}>

                                                    <span>Already got an account? <span className={`${btn_link}`} tabIndex="0"
                                                    onClick={async function() {
                                                        await setSignModifier(true);
                                                        setInputValues(inputValuesInitial);
                                                        setErrorBorders(errorBordersInitial);
                                                        setInputErrors(inputErrorsInitial);
                                                        if (document.cookie.includes('email=')) {
                                
                                                            let cookiesEmail = document.cookie.split(';');
                                                            const cookiesEmailIndex = cookiesEmail.findIndex(el => el.includes('email='));
                                                            focusRef.current.classList.add(input_autofilled);
                                                            focusRef.current.addEventListener('input', () => focusRef.current.classList.remove(input_autofilled));
                                                            cookiesEmail = cookiesEmail[cookiesEmailIndex].split('=')[1];
                                                            setInputValues({...inputValues, email: cookiesEmail});
                                                            rememberCheckBoxRef.current.checked = true;
                                                            setTimeout(() => signPasswordRef.current.focus(), 0);
    
                                                        } else {
    
                                                            setTimeout(() => focusRef.current.focus(), 0);
    
                                                        }
                                                        
                                                    }}>Sign in</span></span>

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