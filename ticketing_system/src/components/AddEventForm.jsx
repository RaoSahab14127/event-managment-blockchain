import React, { useState } from 'react';
// import { getWeb3, getContract } from '../../blockchain/smartContract';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const AddEventForm = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);

  const [id, setId] = useState('');
  const [imgUrl, setImgUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [ticketPrice, setTicketPrice] = useState(0);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const accounts = await web3.eth.getAccounts();
      await contract.methods
        .addEvent(id, imgUrl, title, description, isActive, ticketPrice)
        .send({ from: accounts[0] });

      // Event added successfully, you can add additional logic here.
      console.log('Event added successfully');
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  // const initializeWeb3 = async () => {
  //   try {
  //     const web3Instance = await getWeb3();
  //     const contractInstance = await getContract(web3Instance);
  //     setWeb3(web3Instance);
  //     setContract(contractInstance);
  //   } catch (error) {
  //     console.error('Error initializing web3:', error);
  //   }
  // };

  // if (!web3 || !contract) {
  //   initializeWeb3();
  //   return <div>Loading...</div>;
  // }

  return (
    // <form onSubmit={handleSubmit}>
    //   <label>
    //     ID:
    //     <input type="text" value={id} onChange={(e) => setId(e.target.value)} />
    //   </label>
    //   <br />
    //   <label>
    //     Image URL:
    //     <input type="text" value={imgUrl} onChange={(e) => setImgUrl(e.target.value)} />
    //   </label>
    //   <br />
    //   <label>
    //     Title:
    //     <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
    //   </label>
    //   <br />
    //   <label>
    //     Description:
    //     <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
    //   </label>
    //   <br />
    //   <label>
    //     Is Active:
    //     <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
    //   </label>
    //   <br />
    //   <label>
    //     Ticket Price:
    //     <input type="number" value={ticketPrice} onChange={(e) => setTicketPrice(e.target.value)} />
    //   </label>
    //   <br />
    //   <button type="submit">Add Event</button>
    // </form>

    // =======================================================

    <Form>
      <Form.Group className="mb-3" controlId="formEventId" onChange={(e) => setId(e.target.value)}>
        <Form.Label>ID: </Form.Label>
        <Form.Control type="number" min={0 /*get min from*/} placeholder="Event ID" />
        <Form.Text className="text-muted">
          integer
        </Form.Text>
      </Form.Group>

      <Form.Group className="mb-3  " controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" placeholder="Password" />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicCheckbox">
        <Form.Check type="checkbox" label="Check me out" />
      </Form.Group>
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>

  );
};

export default AddEventForm;
