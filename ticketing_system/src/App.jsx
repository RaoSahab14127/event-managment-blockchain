import './App.css'
import React, { useState, useEffect } from 'react'
import { appLogger } from '../helpers/common'
import { getEventDetails, getLatestEventId } from '../helpers/contractInteraction'
import { AppImages, AppText, getCurrentDate, handleDateTime } from '../helpers/AppConstants';
import detectEthereumProvider from '@metamask/detect-provider';
import SecondaryButton from './components/SecondaryButton'
import BuyTicketModal from './components/BuyTicketModal'
import AddEventModal from './components/AddEventModal'
import MetaError from './components/CustomError.jsx';
import PrimaryButton from './components/PrimaryButton.jsx';
import EditEventModal from './components/editEventModal.jsx'
import Card from './components/Card'
import Home from './components/Home'
import moment from 'moment';
import {getFileApi} from "./api/ApiMethods.js"
function App() {
  const [eventsList, setEventsList] = useState([])
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [showAddEvent, setShowAddEvent] = useState(false)
  const [showBuyTicket, setShowBuyTicket] = useState(false)
  const [metaError, setMetaError] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [page, setPage] = useState(0)
  const [hasProvider, setHasProvider] = useState(null)
  const initialState = { accounts: [] };
  const [wallet, setWallet] = useState(initialState);
  const [currentAccountIndex, setCurrentAccountIndex] = useState(0);

  useEffect(() => {
    getProvider()
    handleAllEvents()

    return () => {
      window.ethereum?.removeListener('accountsChanged', refreshAccounts)
    }
  }, [])

  const getProvider = async () => {
    const provider = await detectEthereumProvider({ silent: true })
    setHasProvider(Boolean(provider))

    if (provider) {
      const accounts = await window.ethereum.request(
        { method: 'eth_accounts' }
      )
      refreshAccounts(accounts)
      window.ethereum.on('accountsChanged', refreshAccounts)
    }

  }

  const refreshAccounts = (accounts) => {
    if (accounts.length > 0) {
      updateWallet(accounts)
    } else { // if length 0, user is disconnected                    
      setWallet(initialState)
    }
  }

  const updateWallet = async (accounts) => {
    setWallet({ accounts });
  };

  const handleConnect = async () => {
    try {
      let accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      updateWallet(accounts);
      // document.getElementById("connection-status").innerHTML = "";
      appLogger("accounts-status", accounts)
    } catch (e) {
      setMetaError(true)
      appLogger("Error Getting Meta Mask Accounts", e);
      appLogger("Connection failed")
      // document.getElementById("connection-status").innerHTML = "Connection Failed";
    }
    setCurrentAccountIndex(0)
  };

  // useEffect(() => {
  //   appLogger("wallet", wallet.accounts)
  // }, [wallet])

  const handleAllEvents = async () => {
    var finalArray = []
    const latestEventId = await getLatestEventId()
    for (let index = 1; index <= parseInt(latestEventId); index++) {
      const mongdata = await getFileApi(index)

      await getEventDetails(index)
        .then((resp) => {
          
          finalArray.push({ ...resp, id: index,des:mongdata[0].des,title:mongdata[0].title , image_url:mongdata[0].image_url })
        })
        .catch((error) => {
          console.log("getEventDetails error", error);
        })
    }
    setEventsList(finalArray);
  }

  return (
    <div className='body'>
      {!window.ethereum && <div className='error-header'><p className='error-alert'>{AppText.to_use_this_web_app}</p></div>}
      <div>
        <img
          src={AppImages.background_image}
          className='bg-image'
        />
        <div className='d-flex flex-row justify-content-between py-5 px-5 flex-wrap position-absolute w-100 top-0 '>
          <h4 className='header-title'>{AppText.event_managment}</h4>

          <SecondaryButton
          className='p-2 w-1 rounded-100  '
            title={wallet.accounts.length == 0 ? AppText.connect_metamask_wallet : wallet.accounts[0].slice(0, 21) + "..."}
            handleOnClick={() => { wallet.accounts.length == 0 && handleConnect() }}
          />
        </div>
      </div>

      {/* <Home /> */}

      <section id="hotels" className="section-with-bg wow fadeInUp">
        <div className="container">
          <div className='d-flex justify-content-between flex-wrap'>
            <div className="section-header d-flex flex-column">
              <h2>{AppText.events}</h2>
            </div>
            <SecondaryButton
            className='p-2 w-3 rounded-100  '
              bodyClass='align-self-center '
              title={AppText.add_event}
              handleOnClick={() => setShowAddEvent(true)}
            />
          </div>
          <div className="d-flex justify-content-center flex-wrap">
          <PrimaryButton
                        btnTitle={"Show Past Events"}
                        className='p-2 w-30 rounded-100  '
                        bodyClass='m-3'
                        handleOnClick={() => {
                            setPage(1)
                        }}
                    />
          <PrimaryButton
                        btnTitle={"Show current Events"}
                        className='p-2 w-30 rounded-100  '
                        bodyClass='m-3'
                        handleOnClick={() => {
                          setPage(0)
                        }}
                    />
          <PrimaryButton
                        btnTitle={"Show future Events"}
                        className='p-2 w-30 rounded-100  '
                        bodyClass='m-3'
                        handleOnClick={() => {
                          setPage(2)
                        }}
                    />

          </div>
          
          <div className="row" id='carty'>

            {console.log(eventsList)}
            {(eventsList.length > 0 && page===1) ?
              eventsList.filter((fi) =>
               (moment(handleDateTime(parseInt(fi.eventStartTime))).isBefore(getCurrentDate())&&moment(handleDateTime(parseInt(fi.eventEndTime))).isBefore(getCurrentDate()))
              )
                .map((item) =>
                  item.is_active &&
                  <Card
                    key={item.id}
                    item={item}
                    setShowBuyTicket={setShowBuyTicket}
                    setSelectedEvent={setSelectedEvent}
                    setShowEdit = {setShowEdit}
                    selectedAccount={wallet.accounts.length > 0 ? wallet.accounts[0] : ""}
                    showBuy={false}
                  />
                ) :""
            }


            {(eventsList.length > 0 && page===0)?
              eventsList.filter((fi) =>
              (moment(handleDateTime(parseInt(fi.eventStartTime))).isSameOrBefore(getCurrentDate())&&moment(handleDateTime(parseInt(fi.eventEndTime))).isAfter(getCurrentDate()))
              )
                .map((item) =>
                  item.is_active &&
                  <Card
                    key={item.id}
                    item={item}
                    setShowBuyTicket={setShowBuyTicket}
                    setSelectedEvent={setSelectedEvent}
                    setShowEdit = {setShowEdit}
                    selectedAccount={wallet.accounts.length > 0 ? wallet.accounts[0] : ""} // save it in another string this is for testing
                  />
                ) :
              ""
            }


            {/* item.is_active && */}
            {(eventsList.length > 0 && page===2)?
              eventsList.filter((fi) =>
                (moment(handleDateTime(parseInt(fi.eventStartTime))).isAfter(getCurrentDate())&&moment(handleDateTime(parseInt(fi.eventEndTime))).isAfter(getCurrentDate()))
              )
                .map((item) =>
                  <Card
                    key={item.id}
                    item={item}
                    setShowBuyTicket={setShowBuyTicket}
                    setSelectedEvent={setSelectedEvent}
                    setShowEdit = {setShowEdit}
                    selectedAccount={wallet.accounts.length > 0 ? wallet.accounts[0] : ""}
                    
                  />
                ) :
              ""
            }

          </div>
        </div>
      </section>

      <footer id="footer">
        <div className="footer-top">
          <div className="container">
            <div className="row">

              <div className="col-lg-3 col-md-6 footer-info">
                <img src="../public/logo.png" alt="logo" />
                <p>
                  {AppText.about_text}
                </p>
              </div>

              <div className="col-lg-3 col-md-6 footer-links">
                <h4>{AppText.useful_links}</h4>
                <ul>
                  <li><i className="fa fa-angle-right"></i> <a href="#">{AppText.home}</a></li>
                  <li><i className="fa fa-angle-right"></i> <a href="#">{AppText.about_us}</a></li>
                  <li><i className="fa fa-angle-right"></i> <a href="#">{AppText.services}</a></li>
                  <li><i className="fa fa-angle-right"></i> <a href="#">{AppText.terms_of_service}</a></li>
                  <li><i className="fa fa-angle-right"></i> <a href="#">{AppText.privacy_policy}</a></li>
                </ul>
              </div>

              <div className="col-lg-3 col-md-6 footer-links">
                <h4>{AppText.useful_links}</h4>
                <ul>
                  <li><i className="fa fa-angle-right"></i> <a href="#">{AppText.home}</a></li>
                  <li><i className="fa fa-angle-right"></i> <a href="#">{AppText.about_us}</a></li>
                  <li><i className="fa fa-angle-right"></i> <a href="#">{AppText.services}</a></li>
                  <li><i className="fa fa-angle-right"></i> <a href="#">{AppText.terms_of_service}</a></li>
                  <li><i className="fa fa-angle-right"></i> <a href="#">{AppText.privacy_policy}</a></li>
                </ul>
              </div>

              <div className="col-lg-3 col-md-6 footer-contact">
                <h4>{AppText.contant_us}</h4>
                <p>
                  {AppText.address}
                  <strong>{AppText.phone}</strong> +92-21-34820199<br />
                  <strong>{AppText.email}</strong> info@siliconplex.com<br />
                </p>

                <div className="social-links">
                  <a href="#" className="twitter"><i className="fa fa-twitter"></i></a>
                  <a href="#" className="facebook"><i className="fa fa-facebook"></i></a>
                  <a href="#" className="instagram"><i className="fa fa-instagram"></i></a>
                  <a href="#" className="google-plus"><i className="fa fa-google-plus"></i></a>
                  <a href="#" className="linkedin"><i className="fa fa-linkedin"></i></a>
                </div>

              </div>

            </div>
          </div>
        </div>
      </footer>

      <AddEventModal
        show={showAddEvent}
        onHide={() => setShowAddEvent(false)}
        selectedAccount={wallet.accounts.length > 0 ? wallet.accounts[0] : ""} // save it in another string this is for testing
        updateEvents={() => handleAllEvents()}
      />

      <BuyTicketModal
        show={showBuyTicket}
        onHide={() => setShowBuyTicket(false)}
        selectedEvent={selectedEvent}
        selectedAccount={wallet.accounts.length > 0 ? wallet.accounts[0] : ""}
        updateEvents={() => handleAllEvents()}
      />
      <EditEventModal
      show={showEdit}
      onHide={() => setShowEdit(false)}
      selectedEvent={selectedEvent}
      selectedAccount={wallet.accounts.length > 0 ? wallet.accounts[0] : ""}
      updateEvents={() => handleAllEvents()}
      
      />

      <MetaError
        show={metaError}
        onHide={() => setMetaError(false)}

      />
    </div>
  )
}

export default App
