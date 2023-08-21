import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  startTimer,
  stopTimer,
  decreaseTime,
  releaseTicket,
} from "../Reducer/TimerSlice";
import Connection from "../api";

const CheckoutTimer = () => {
  const dispatch = useDispatch();
  const timerRunning = useSelector((state) => state.timer.timerRunning);
  const remainingTime = useSelector((state) => state.timer.remainingTime);

  const featchOperation = (rsvp) => {
    const controller = new AbortController();
    const signal = controller.signal;
    var ApiUrl = Connection.url + Connection.createReservation;
    var headers = {
      accept: "application/json",
      "Content-Type": "application/json",
    };

    var Data = {
      ticketId: pass.id,
      userId: pass.userId,
      quantity: pass.amount,
      rsvp: rsvp,
    };

    fetch(ApiUrl, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(Data),
      signal: signal,
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.success && response.message === "start timer") {
          setTimer(720);
          setReservationid(response.data);
          console.log(response);
        } else {
          setTimer(response.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });

    return () => {
      controller.abort();
    };
  };

  useEffect(() => {
    let interval;

    if (timerRunning) {
      interval = setInterval(() => {
        if (remainingTime > 0) {
          dispatch(decreaseTime());
        } else {
          dispatch(stopTimer());
          clearInterval(interval);
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [timerRunning, remainingTime, dispatch]);

  return null;
};

export default CheckoutTimer;
