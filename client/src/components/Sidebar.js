import React, { useEffect, useState } from 'react'
import { Tab, Nav, Button, Modal } from 'react-bootstrap'
import Conversations from './Conversations'
import Contacts from './Contacts'

import { useTheme } from '../contexts/ThemeProvider'

import NewContactModal from './NewContactModal'
import NewConversationModal from './NewConversationModal'

const CONVERSATIONS_KEY = 'conversations'
const CONTACTS_KEY = 'contacts'

export default function Sidebar({ id }) {
    const { isLightTheme } = useTheme();

    const [activeKey, setActiveKey] = useState(CONVERSATIONS_KEY)
    const [modalOpen, setModalOpen] = useState(false)
    const [language, setLanguage] = useState('en')

    useEffect(() => {
        setLanguage(localStorage.getItem('lang'));
      }, []);
    
    const conversationsOpen = activeKey === CONVERSATIONS_KEY
    
    function closeModal() {
        setModalOpen(false)
    }

    
    return (
        <div style={{ width: '250px' }} className={isLightTheme ? "bag-light d-flex flex-column" : "bag-dark d-flex flex-column"}>
            <Tab.Container activeKey={activeKey} onSelect={setActiveKey}>
                <Nav variant="tabs" className="justify-content-center">
                    <Nav.Item>
                        <Nav.Link eventKey={CONVERSATIONS_KEY}>{language === 'ua' ? "Діалоги" : "Conversations" }</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey={CONTACTS_KEY}>{language === 'ua' ? "Контакти" : "Contacts"}</Nav.Link>
                    </Nav.Item>
                </Nav>
                <Tab.Content className={isLightTheme ? "bg-light-colorless overflow-auto flex-grow-1" : "bg-dark-colorless overflow-auto flex-grow-1"}>
                    <Tab.Pane eventKey={CONVERSATIONS_KEY}>
                        <Conversations />
                    </Tab.Pane>
                    <Tab.Pane eventKey={CONTACTS_KEY}>
                        <Contacts />
                    </Tab.Pane>
                </Tab.Content>
                <div className="p-2 small">
                    {language === 'ua' ? 'Ваш Id: ' : 'Your Id: '}<span className="text-muted">{id}</span>
                </div>
                <Button onClick={() => setModalOpen(true)} className="rounded-0">
                    {language === 'ua' ? 'Новий' : 'New'} {conversationsOpen ? language === 'ua' ? 'Діалог' :'Conversation' :language === 'ua' ? 'Контакт' :'Contact'}
                </Button>
            </Tab.Container>

            <Modal show={modalOpen} onHide={closeModal}>
                {conversationsOpen ?
                    <NewConversationModal closeModal={closeModal} /> :
                    <NewContactModal closeModal={closeModal} />
                }
            </Modal>
        </div>
    )
}
