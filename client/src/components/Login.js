import React, { useRef, useState, useEffect } from 'react'
import { Alert, Button, Container, Form, Tabs, Tab } from 'react-bootstrap'
import { v4 as uuidV4 } from 'uuid'
import axios from 'axios'

import { useTheme } from '../contexts/ThemeProvider'

export default function Login({ setLoginId, setUserName }) {
    const nameRef = useRef()
    const emailRef = useRef()
    const passwRef = useRef()
    const email2Ref = useRef()
    const passw2Ref = useRef()

    
    const { isLightTheme } = useTheme();

    const [type, setType] = useState("")
    const [message, setMessage] = useState("")
    const [show, setShow] = useState(false)
    const [language, setLanguage] = useState('en')

    useEffect(() => {
        setLanguage(localStorage.getItem('lang'));
      }, []);

    function handleLoginSubmit(e) {
        e.preventDefault()
        let payload = {
            email: emailRef.current.value,
            password: passwRef.current.value,
        }
        axios({
            url: "http://localhost:5000/users/login",
            method: "POST",
            data: payload
        })
            .then(res => {
                setType("success")
                setMessage("Login Successfull")
                setShow(true)
                setLoginId(res.data.id)
                setUserName(res.data.fname)
            })
            .catch(() => {
                setType("danger")
                setMessage("Couldn't Login")
                setShow(true)
            })
    }

    function handleRegisterSubmit() {
        let payload = {
            fname: nameRef.current.value,
            email: email2Ref.current.value,
            password: passw2Ref.current.value,
            id: uuidV4()
        }

        axios({
            url: "http://localhost:5000/users/register",
            method: "POST",
            data: payload
        })
            .then(() => {
                setType("success")
                setMessage("Registration Successfull")
                setShow(true)
            })
            .catch(() => {
                setType("danger")
                setMessage("Couldn't Register")
                setShow(true)
            })
    }

    return (
        <Container fluid className={isLightTheme ? "bag-light": "bag-dark"} style={{ height: '88.6vh', width: '100%', padding: '100px 0 0 0', fontFamily: 'Montserrat' }}> 
            <Container style={{maxWidth: '300px', padding: '10px', boxShadow: " 0px 0px 35px 0px rgba(0,0,0,0.75)" }}>
                {show ? <Alert variant={type} onClose={() => setShow(false)} dismissible>{message}</Alert> : null}
                <Tabs variant="pills" defaultActiveKey="login" style={{ marginBottom: '20px' }}>
                    <Tab eventKey="login" title={language === 'ua' ? "Вхід": "Login"}>
                        <Form onSubmit={handleLoginSubmit} className="w-100">
                            <Form.Group>
                                <Form.Label>{language === 'ua' ? 'Електронна Пошта' : 'Email'}</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Ex: nikita@gmail.com"
                                    name="email"
                                    ref={emailRef}
                                    autoComplete="username"
                                />
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>{language === 'ua' ? 'Пароль' : 'Password'}</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="************"
                                    name="password"
                                    ref={passwRef}
                                    autoComplete="current-password"
                                />
                            </Form.Group>
                            
                            <Form.Group className="mt-2 mb-0 text-right">
                                <Button variant="primary" type="submit">
                                {language === 'ua' ? 'Вхід' : 'Login'}
                                </Button>
                            </Form.Group>
                        </Form>
                    </Tab>
                    <Tab eventKey="register" title={language === 'ua' ? "Реєстрація": "Register"}>
                        <Form className="w-100">
                            <Form.Group>
                                <Form.Label>{language === 'ua' ? 'Повне І\'мя' : 'Full Name'}</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Ex: Nikita Malik"
                                    name="email"
                                    ref={nameRef}
                                />
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>{language === 'ua' ? 'Електронна Пошта' : 'Email'}</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Ex: nikita@gmail.com"
                                    name="email"
                                    ref={email2Ref}
                                    autoComplete="username"
                                />
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>{language === 'ua' ? 'Пароль' : 'Password'}</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="************"
                                    name="password"
                                    ref={passw2Ref}
                                    autoComplete="current-password"
                                />
                            </Form.Group>
                            
                            <Form.Group className="mt-2 mb-0 text-right">
                                <Button variant="primary" onClick={handleRegisterSubmit}>
                                {language === 'ua' ? 'Реєстрація' : 'Register'}
                                </Button>
                            </Form.Group>
                        </Form>
                    </Tab>
                </Tabs>
            </Container>
        </Container>
    )
}
