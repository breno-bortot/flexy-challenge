import React, { useState, useEffect } from 'react'
import './App.css';
import { Form, Alert, Button, Modal } from 'react-bootstrap'

//---Importing Components
import Produto from './components/produto'

function App() {

  const [myForm, setMyForm] = useState()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const [products, setProducts] = useState([])
  const [message, setMessage] = useState()
  const [query, setQuery] = useState([])

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    getProducts()
    if (query.length === 1) {
      postProduct()
    }
  }, [query])

  const createProduct = (e) => {
    e.preventDefault()
    setMyForm(e.target)

    setMessage('')
    setError('')
    setLoading(true)
    setQuery('1');
  }

  let formData = new FormData(myForm)
  const requestOptions = {
    method: 'POST',
    body: formData
  }

  const postProduct = async () => {

    const response = await fetch('/produtos', requestOptions)
    const data = await response.json()
    setMessage(data.message)

    setError(data.error)

    setLoading(false)
    setQuery('')
    setTimeout(() => {
      handleClose()
    }, 1000);

  }
  const getProducts = async () => {

    const response = await fetch("/produtos")
    const data = await response.json()
    console.log(data)
    setProducts(data)
    setError(data.error)

  }

  return (
    <div className="App">

      <div className="container">
        <div className="row">
          <div className="col-md-7 offset-md-2">
            <div className="d-grid gap-2">
              <Button className="btn btn-primary" onClick={handleShow}>Add Product</Button>
            </div>
            {products.map(product => (

              <Produto key={product.id}
                setForm={setMyForm} myForm={myForm} setQuery={setQuery} query={query} setLoading={setLoading} loading={loading} error={error} message={message} setError={setError} setMessage={setMessage}
                idProduct={product.id} title={product.title} description={product.description} stock={product.stock} image={product.imagePath}
              />
            ))}


          </div>
          {/*------- Add Form Modal --------------- */}

          <Modal animation={false} show={show} onHide={handleClose}>
            <div className="modal-dialog">
              <div className="modal-content">
                <Form id='myForm' onSubmit={createProduct} >
                  <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">Add Product</h5>
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
      </div>

    </div>
  );
}

export default App;
