import { createSlice } from "@reduxjs/toolkit";

const ticketSlice = createSlice({
  name: "tickets",
  initialState: {
    tickets: [],
    totalAmount: 0,
    totalCount: 0,
  },

  reducers: {
    addTicket: (state, action) => {
  {state.tickets =action.payload}
      
    },
    getTicketTotal: (state, action) => {
      let { totalAmount, totalCount } = state.tickets.reduce(
        (cartTotal, cartItem) => {
          const { price, amount } = cartItem;
          const itemTotal = price * amount;

          cartTotal.totalAmount += itemTotal;
          cartTotal.totalCount += amount;
          return cartTotal;
        },
        {
          totalAmount: 0,
          totalCount: 0,
        }
      );
      state.totalAmount = parseInt(totalAmount.toFixed(2));
      state.totalCount = totalCount;
    },

    increase: (state, action) => {
      state.tickets = state.tickets.map((item) => {
        if (item.id === action.payload) {
          return { ...item, amount: item.amount + 1 };
        }
        return item;
      });
    },

    
    newItem: (state, action) => {
      state.tickets = state.tickets.map((item) => {
        if (item.id === action.payload) {
          return { ...item, open: true };
        }
        return item;
      });
    },
    decrease: (state, action) => {
      state.tickets = state.tickets
        .map((item) => {
          if (item.id === action.payload) {
            return { ...item, amount: item.amount - 1 };
          }
          return item;
        })
     
    },
   
  },
});

export const {
  addTicket,
    getTicketTotal,
  remove,
  increase,
  decrease,
  newItem
 
} = ticketSlice.actions;

export default ticketSlice.reducer;
