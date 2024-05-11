import React, { useState } from 'react'
import upload from '../utits/uploads.js'
import { Row } from 'react-bootstrap';
import { appLogger } from '../../helpers/common';
import { EditFileApi} from '../api/ApiMethods';
import {
  
  AppText,
  eventsIniitalState,
  failureToast,
  infoToast,
  successToast, 
} from '../../helpers/AppConstants';
import Modal from 'react-bootstrap/Modal';
import PrimaryButton from './PrimaryButton';
import TextInputComp from './TextInputComp';
import moment from 'moment';

export default  function EditEventModal(props) {
  const { onHide, selectedAccount, updateEvents,selectedEvent } = props
  const [event, setEvent] = useState( eventsIniitalState)

  const handleChange = (value, key) => {
    setEvent({ ...event, [key]: value })
  }

  const handleEventImage = (file) => {
    setEvent({ ...event, img_url: "" })
    uploadImage(file)

  }

  const uploadImage = async (selectedFile) => {
    upload(selectedFile)
    .then((resp) => {

      if (resp) {
        setEvent({ ...event, img_url: resp })
      }
    })
    
  }

  const handleAddEvent =async () => {
    if ((event.img_url && event.title && event.description)!="") {

        const body2 = {
          event_id:  Number(selectedEvent.id),
          image_url: event.img_url,
          title: event.title,
          des: event.description,
        }
        EditFileApi(body2)
          .then((resp) => {
            console.log("Done")
            appLogger("edit event resp", resp)
            successToast(AppText.event_added_successfully)
            onHide()
            updateEvents()
            setEvent(eventsIniitalState)
          })
          .catch((error) => {
            console.log(error)
            appLogger("add event error", error)
            failureToast("Unabel to edit event")
          })

    } else {
      infoToast( "All fields are required")
    }
  }


  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      onHide={() => {
        onHide()
        setEvent(eventsIniitalState)
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {`Edit Event ${event.title}`}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>

        <section id="contact" className="section-bg wow fadeInUp">
          <div className="form">
            <form action="" method="post" role="form" className="   ">
              <Row>
                <TextInputComp
                  className='col-sm-12  col-md-6 col-lg-6'
                  placeholder={AppText.title}
                  inputLabel={AppText.title}
                  type='text'
                  
                  value={(event.title)}
                  onChange={(e) => handleChange(e, "title")}
                />
                <TextInputComp
                  className='col-sm-12  col-md-6 col-lg-6'
                  placeholder={AppText.description}
                  inputLabel={AppText.description}
                  type='text'
                  
                  value={event.description}
                  onChange={(e) => handleChange(e, "description")}
                />
              </Row>

              <TextInputComp 
                className='col '
                inputLabel={AppText.select_image}
                type='file'
                

                onChange={(e) => handleEventImage(e)}
              />
              {event.img_url &&
                <div className='w-100'>
                  <img
                    className='  '
                    style={{ width: "200px", height: "200px", objectFit: "cover", alignSelf: 'center', backgroundColor: "red" }}
                    src={event.img_url}
                  // src={event.img_url}
                  />
                </div>
              }
            </form>
          </div>
        </section>

      </Modal.Body>
      <Modal.Footer>
        <PrimaryButton
          className="bg-dark "
          btnTitle={AppText.close}
          handleOnClick={() => {
            onHide()
            setEvent(eventsIniitalState)
          }}
        />
        <PrimaryButton
          btnTitle={AppText.add}
          handleOnClick={() => { handleAddEvent() }}
        />
      </Modal.Footer>
    </Modal>
  );
}