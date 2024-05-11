import { toast } from "react-toastify";
import moment from "moment";

const ToastStyles = {
    position: "top-center",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    isLoading: false
}

export const successToast = (text = "") => {
    toast.dismiss()
    toast.success(text, ToastStyles);
}

export const failureToast = (text = "") => {
    toast.dismiss()
    toast.error(text, ToastStyles);
}

export const infoToast = (text = "") => {
    toast.dismiss()
    toast.info(text, ToastStyles);
}

export const Events = [
    {
        id: 1,
        image: "https://img.freepik.com/free-photo/beautiful-luxury-outdoor-swimming-pool-hotel-resort_74190-7433.jpg",
        title: "Event 1",
        description: "Venue"
    },
    {
        id: 2,
        image: "https://img.freepik.com/free-photo/swimming-pool_74190-2109.jpg",
        title: "Event 2",
        description: "Venue"
    },
    {
        id: 3,
        image: "https://img.freepik.com/free-photo/swimming-pool_74190-2106.jpg",
        title: "Event 3",
        description: "Venue"
    },
]

export const getCurrentDate = () => {
    return moment().format("DD MMM YYYY hh:mm A")
}

export const handleDateTime = (dateString) => {
    const date = moment(dateString * 1000).format('DD MMM YYYY hh:mm A');
    return date
}

export const validateFieldsGlobal = (object) => {
    for (const [key, value] of Object.entries(object)) {
        if (!value) {
            return false;
        }
    }
    return true;
};

export const AppConstants = {
    baseURL: "http://127.0.0.1:8800",
    uploadImage: "/upload/",
    getImage: "/get_image/",
    localImagesFolder: "../../backend/",
}

export const eventsIniitalState = {
    event_img: null,
    img_url: "",
    title: "",
    description: "",
    ticket_count: 0,
    ticket_price: 0,
    event_start_time: "",
    event_end_time: "",
}

export const buyTicketInitialState = {
    ticketCount: 1,
    amount: 0,
}

export const AppImages = {
    success: "../public/success.png",
    background_image: "../public/header_bg.jpg",
}

export const AppText = {
    to_use_this_web_app: "To use this Web App features MetaMask Extension is required",
    event_managment: "Event Managment",
    connect_metamask_wallet: "Connect MetaMask Wallet",
    events: "Events",
    our_upcoming_events: "Our Upcoming Events",
    add_event: "Add Event",
    no_events_found: "No Events Found",
    about_text: `SILICONPLEX is a Mobile App development and Web development
                    company committed to creative excellence. We can help provide
                    you with the right solution at the right time and within your budget.`,
    useful_links: "Useful Links",
    contant_us: "Contact Us",
    home: "Home",
    about_us: "About us",
    services: "Services",
    terms_of_service: "Terms of service",
    privacy_policy: "Privacy policy",
    address: "C14, Block 5, Gulshan e Iqbal, Karachi",
    phone: "Phone:",
    email: "Email:",
    tickets: "Tickets",
    ticket_price_wei: "Ticket Price (Wei)",
    event_starting_date_time: "Event Starting Date/Time",
    event_ending_date_time: "Event Ending Date/Time",
    buy_tickets: "Buy Tickets",
    event_added_successfully: "Event added successfully",
    unable_to_add_event: "Unable to add event",
    all_fields_are_required: "All fields are required",
    title: "Title",
    description: "Description",
    tickets_quantity: "Tickets Quantity",
    start_date: "Start Date",
    end_date: "End Date",
    select_image: "Select Image",
    close: "Close",
    add: "Add",
    unable_to_buy_ticket: "Unable to buy ticket",
    buy_tickets: "Buy Tickets",
    are_you_sure_you_want_to_buy_ticket: "Are you sure you want to buy this ticket?",
    amount_wei: "Amount (Wei)",
    thank_you: "Thank You!",
    you_have_bought_this_ticket: "You have bought this ticket successfully!",
    transaction_hash: "Transaction Hash:",
    no: "No",
    yes: "Yes",
    previous_events: "Previous Events",
    upcoming_events: "Upcoming Events",
    event_end_date_should_be_greater_than_event_start_date: "Event End date/time should be greater than event Start date/time",


}