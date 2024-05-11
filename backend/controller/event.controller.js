import eventModal from "../Model/event.modal.js";

export const addEvent = async(req, res)=>{
    console.log(req.body)
    try {
        const newEvent = new eventModal(req.body)
        await newEvent.save();
        res.status(201).send("event added to database")        
    } catch (error) {
        console.log("error occur")
    }
}

export const getEvent = async(req, res)=>{
    const id = Number(req.params.id)
    try {
        const event = await eventModal.find({ event_id : id} );
        res.status(200).send(event);         
    } catch (error) {
        console.log("error our")
    }
}

export const putEvent = async(req, res)=>{
    const id = Number(req.params.id)
    try {
        const event = await eventModal.findOneAndUpdate({ event_id : id}, {$set:{image_url: req.body.image_url, title: req.body.title, des: req.body.des}} );
        res.status(200).send({'result': "Updated"});         
    } catch (error) {
        console.log("error our")
    }
}