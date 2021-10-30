import { mongodb } from 'mongodb';

const ojectId = mongodb.ObjectId

let reviews

export default class ReviewsDAO {
    static async injectDB(conn) {
        if(reviews) {
            return
        }
        try {
            reviews = await conn.db(process.env.RESTREVIEWS_NS).collection("reviews")
        } catch (e) {
         console.error(`unable to establish connection handles in userDAO: ${e}`)
    }   
    }

    static async addReview(RestaurantId, user, review, date){
        try {
            const reviewDoc = {
                name : user.name,
                user_id : user.id,
                date : date,
                text : review,
                restaurant_id : ObjectId(restaurantId)
            }
            return await reviews.insertOne(reviewDoc)
        }catch(e){
            console.error(`unable ro post review : ${e}`)
            return {error : e}
        }
    }

    static async updateReview(reviewId, userId, text, date) {
        try {
            const updateResponse = await reviews.updateOne(
                {
                    user_id: userId,
                    _id: ObjectId(reviewId)
                },
                {
                    $set: { text:text, date:date }
                },
            )
        }catch(e){
            console.error(`unable ro update review: ${e}`)
            return { error: e }
        }
    }


    static async deleteReview(reviewId, userId) {

        try {
            const deleteResponse = await reviews.deleteOne({
                _id: ObjectId(reviewId),
                user_id: userId,
            })
            return deleteResponse
        }catch(e) {
            console.error(`unable to delete review: ${e}`)
            return { error: e }
        }

    }

}