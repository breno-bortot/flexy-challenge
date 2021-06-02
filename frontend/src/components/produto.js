import React, { useEffect, useState } from 'react'
import { Alert, Form, Button, Card, ListGroup, ListGroupItem, Modal } from 'react-bootstrap'

const Produto = ({ setQuery, error, message, setError, setMessage, setLoading, loading, idProduct, title, description, stock, image }) => {
    const [myForm2, setMyForm2] = useState()
    const [idUpdate, setIdUpdate] = useState()
    const [query2, setQuery2] = useState([])
    
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


     useEffect(() => {
        if (query2.length !== 0) {
            putProduct()
        }
    }, [query2]) 

    const deleteProduct = async (id) => {
        const response = await fetch(`/produtos/${id}`, { method: 'DELETE' })
        const data = await response.json()
        setMessage(data.message)
        setError(data.error)
        setLoading(false)
        setQuery(`del_${idProduct}`)
    }


    const updateProduct = (e) => {
        e.preventDefault()
        setIdUpdate(e.target.dataset.id)
        setMyForm2(e.target)
        setMessage('')
        setError('')
        setLoading(true)
     
        setQuery2(requestOptions2)       
    }
    
    let formData2 = new FormData(myForm2)
      const requestOptions2 = {
        method: 'PUT',
        body: formData2
      }


    const putProduct = async () => {
       
        const response = await fetch(`/produtos/${idUpdate}`, requestOptions2)
        const data = await response.json()
        setMessage(data.message)

        setError(data.error)

        setLoading(false)
        setTimeout(() => {
            handleClose()
        }, 1000);
        setQuery(`put_${idProduct}`)
    }
    return (
        <>
            <div className="card">
                <span className="align-middle text-left ms-4 mt-2"> {title} <button className="btn btn-default float-end" data-bs-toggle="collapse" href={`#produto_${idProduct}`}
                    aria-expanded="false" aria-controls={`produto_${idProduct}`}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-down" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z" />
                    </svg></button>
                </span>
                <div className="collapse" id={`produto_${idProduct}`}>
                    <br />
                    <Card.Body >
                        <Card.Img variant="bottom" src={image} />
                        <ListGroup className="list-group-flush">
                            <ListGroupItem className='text-success'>ID: {idProduct}</ListGroupItem>
                            <ListGroupItem className='text-primary'>Title: {title}</ListGroupItem>
                            <ListGroupItem className='text-primary'>Stock: {stock}</ListGroupItem>
                            <Card.Text className='mt-2'>
                                Description: {description}
                            </Card.Text>
                            {message && <Alert variant='warning'>{message}</Alert>}
                            {error && <Alert variant='danger'>{error}</Alert>}

                        </ListGroup>

                        <Button className="delete-product float-end m-1 bi bi-trash-fill" id={`${idProduct}`}
                            variant="danger" onClick={() => deleteProduct(idProduct)}>
                                
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
                            </svg>
                            
                            </Button>
                        <Button className="edit-product float-end m-1"  
                        onClick={handleShow} >
                            
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                            <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
                        </svg>
                        
                        </Button>

                    </Card.Body>

                </div>
              
        <Modal animation={false} show={show} onHide={handleClose}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <Form id='myForm2' data-id={`${idProduct}`} onSubmit={updateProduct} >
                                <div className="modal-header">
                                    <h5 className="modal-title" id="exampleModalLabel">Upload Product</h5>
                                    <button type="button" className="btn-close" onClick={handleClose}></button>
                                </div>
                                <div className="modal-body">
                                    <Form.Group controlId="exampleForm.ControlInput1">
                                        <Form.Label>Title</Form.Label>
                                        <Form.Control type="text" placeholder="Title" name="title" required />
                                    </Form.Group>
                                    <Form.Group controlId="exampleForm.ControlTextarea1">
                                        <Form.Label>Descripton</Form.Label>
                                        <Form.Control as="textarea" rows={6} placeholder="Description" name="description" />
                                    </Form.Group>
                                    <Form.Group controlId="exampleForm.ControlInput1">
                                        <Form.Label>Stock</Form.Label>
                                        <Form.Control type="number" min="0" placeholder="0" name="stock" required />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.File id="exampleFormControlFile1" label="Image" name="image" required />
                                    </Form.Group>
                                </div>
                                <div className="modal-footer">
                                    <Button className="btn btn-secondary" onClick={handleClose}>Close</Button>
                                    <Button disabled={loading} type="submit" className="btn btn-primary">Save</Button>
                                </div>
                            </Form>
                            <br />
                            {message && <Alert variant='success'>{message}</Alert>}
                            {error && <Alert variant='danger'>{error}</Alert>}
                        </div>
                    </div>
                </Modal>    


            </div>


        </>
    )
}




export default Produto;