import ErrorHnadler from "../error/error.js";
import reservationModel from "../model/reservationModel.js";

export const sendReservation = async (req, res, next) => {
    const { name, email, phone, date, time, people } = req.body;
    if (!name || !email || !phone || !date || !time || !people) {
        return next(new ErrorHnadler("Please fill all the fields", 400));
    }
}