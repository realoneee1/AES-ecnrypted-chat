import React from 'react'

import useLocalStorage from '../hooks/useLocalStorage';

import Login from './Login'
import Dashboard from './Dashboard'
import Nav from './Navbar'


import { ContactsProvider } from '../contexts/ContactsProvider'
import { ConversationsProvider } from '../contexts/ConversationsProvider';
import { SocketProvider } from '../contexts/SocketProvider';
import { ThemeProvider } from '../contexts/ThemeProvider';

import '../assets/css/App.css'

function App() {
    const [id, setId] = useLocalStorage('id', false)
    const [name, setName] = useLocalStorage('name', "")

    const login = (
        <ThemeProvider>
            <Nav login={false} name={""} />
            <Login setLoginId={setId} setUserName={setName} />
        </ThemeProvider>
    )

    const dashboard = (
        <SocketProvider id={id}>
            <ContactsProvider>
                <ConversationsProvider id={id}>
                    <ThemeProvider>
                        <Nav login={true} name={name} logout={setId} />
                        <Dashboard id={id} />
                    </ThemeProvider>
                </ConversationsProvider>
            </ContactsProvider>
        </SocketProvider>
    )

    return (
        id ? dashboard : login
    )
}

export default App;
