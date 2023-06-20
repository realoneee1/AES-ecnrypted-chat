import React, { useRef, useEffect, useState } from 'react'
import { Modal, Form, Button } from 'react-bootstrap'
import { useContacts } from '../contexts/ContactsProvider'

import { useTheme } from '../contexts/ThemeProvider'

export default function NewContactModal({ closeModal }) {
    const { isLightTheme } = useTheme()
    const idRef = useRef()
    const nameRef = useRef()
    const { createContact } = useContacts()
    const [language, setLanguage] = useState('en')

    useEffect(() => {
        setLanguage(localStorage.getItem('lang'));
      }, []);
    function handleSubmit(e) {
        e.preventDefault()

        createContact(idRef.current.value, nameRef.current.value)
        closeModal()
    }

    
    return (
        <>
            <Modal.Header className={isLightTheme ? "bag-light" : "bag-dark"} closeButton>{language === 'ua' ? 'Створити контакт' : 'Create Contact'}</Modal.Header>
            <Modal.Body className={isLightTheme ? "bag-light" : "bag-dark"}>
                <Form onSubmit={handleSubmit}>
                    <Form.Group>
                        <Form.Label>Id</Form.Label>
                        <Form.Control type="text" ref={idRef} required />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>{language === 'ua' ? 'І\'мя' : 'Name'}</Form.Label>
                        <Form.Control type="text" ref={nameRef} required />
                    </Form.Group>
                    <Button type="submit">{language === 'ua' ? 'Створити' : 'Create'}</Button>
                </Form>
            </Modal.Body>
        </>
    )
}
