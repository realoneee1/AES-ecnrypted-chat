import React, { useRef } from 'react'
import { Modal, Form, Button } from 'react-bootstrap'
import { useContacts } from '../contexts/ContactsProvider'

import { useTheme } from '../contexts/ThemeProvider'

export default function NewContactModal({ closeModal }) {
    const { isLightTheme } = useTheme()
    const idRef = useRef()
    const nameRef = useRef()
    const { createContact } = useContacts()

    function handleSubmit(e) {
        e.preventDefault()

        createContact(idRef.current.value, nameRef.current.value)
        closeModal()
    }

    
    return (
        <>
            <Modal.Header className={isLightTheme ? "bag-light" : "bag-dark"} closeButton>Create Contact</Modal.Header>
            <Modal.Body className={isLightTheme ? "bag-light" : "bag-dark"}>
                <Form onSubmit={handleSubmit}>
                    <Form.Group>
                        <Form.Label>Id</Form.Label>
                        <Form.Control type="text" ref={idRef} required />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" ref={nameRef} required />
                    </Form.Group>
                    <Button type="submit">Create</Button>
                </Form>
            </Modal.Body>
        </>
    )
}
