import { MedicineDirection } from "../models/MedicineDirections.js";
import { Service } from "../models/Service.js";

export const test = async (req, res) => {
  const { name, price, description, hoverColor, color } = req.body;
  try {
    const s = new Service({
      price,
      description,
    });
    // const md = new MedicineDirection({
    //   name,
    //   color,
    //   hoverColor,
    //   services: [s],
    // });
    await s.save();
    // await md.save();
  } catch (e) {
    return res.json({ message: e.message });
  }

  return res.json({ message: "done" });
};
