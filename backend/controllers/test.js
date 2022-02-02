import { MedicineDirection } from "../models/MedicineDirections.js";
import { Service } from "../models/Service.js";

export const test = async (req, res) => {
  const { name, urlName, ids, price, description, hoverColor, color } =
    req.body;
  try {
    const s = new Service({
      price,
      description,
      medicineDirectionsIds: ids,
    });
    // const md = new MedicineDirection({
    //   name,
    //   color,
    //   urlName,
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
