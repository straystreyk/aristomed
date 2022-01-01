import mongoose from "mongoose";
const db = mongoose.connection

/***
 * @param page - name of the page (type string)
 * description: get all texts on page
 */
export const get_texts = async (page) => {
    try {
        const db_texts = await db.collection("texts").find({page}).toArray()
        const texts = {}
        db_texts.forEach(el => texts[el.name] = el.value)
        return texts
    } catch (e) {
        console.log(e.message)
    }
}

export const update_text = async (req, res) => {
    try {
        const {name, value, page} = req.body
        await db.collection("texts").updateOne({name, page}, {$set: {value}})
        return res.json({message: "Текст был обновлен"})
    } catch (e) {
        console.log(e.message)
        return res.json({message: e.message})
    }
}