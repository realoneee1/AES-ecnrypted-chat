import React, { useState } from 'react'
import { Modal, Form, Button } from 'react-bootstrap'
import { useTheme } from '../contexts/ThemeProvider'
import { useContacts } from '../contexts/ContactsProvider'
import { useConversations } from '../contexts/ConversationsProvider'

export default function NewConversationModal({ closeModal }) {
    const { isLightTheme } = useTheme()
    const [selectedContactIds, setSelectedContactIds] = useState([])
    const { contacts } = useContacts()
    const { createConversation } = useConversations()

    
    function handleSubmit(e) {
        e.preventDefault()

        createConversation(selectedContactIds)
        closeModal()
    }

    function handleCheckboxChange(contactId) {
        setSelectedContactIds(prevSelectedContactIds => {
            if (prevSelectedContactIds.includes(contactId)) {
                return prevSelectedContactIds.filter(prevId => {
                    return contactId !== prevId
                })
            } else {
                return [...prevSelectedContactIds, contactId]
            }
        })
    }

    return (
        <>
            <Modal.Header className={isLightTheme ? "bag-light" : "bag-dark"} closeButton>Create Conversation</Modal.Header>
            <Modal.Body className={isLightTheme ? "bag-light" : "bag-dark"}>
                <Form onSubmit={handleSubmit}>
                    {contacts.map(contact => (
                        <Form.Group controlId={contact.id} key={contact.id}>
                            <Form.Check
                                type="checkbox"
                                value={selectedContactIds.includes(contact.id)}
                                label={contact.name}
                                onChange={() => handleCheckboxChange(contact.id)}
                            />
                        </Form.Group>
                    ))}
                    <Button type="submit">Create</Button>
                </Form>
            </Modal.Body>
        </>
    )
}
