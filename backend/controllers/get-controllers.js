import mongoose from "mongoose";
const db = mongoose.connection;

export const get_all_doctors = async () => {
  return db.collection("doctors").find().toArray();
};
