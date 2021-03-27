import {User} from './user.model'

export const me = (req, res) => {
    res.json({data: req,user}).sendStatus(200)
}

export const updateMe = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.user._id, req.body,{
            new: true
        })
            .lean()
            .exec()
        res.json({data: user}).sendStatus(204)
    } catch (e) {
        console.error(e)
        res.status(400).end()
    }
}