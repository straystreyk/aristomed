import mongoose from "mongoose";
const db = mongoose.connection;

export const get_all = async (collection) => {
  return db.collection(collection).find().toArray();
};

export const get_one = async (filters, collection) => {
  return db.collection(collection).findOne({ ...filters });
};
