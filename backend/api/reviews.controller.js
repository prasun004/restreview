import ReviewsDAO from "./dao/reviewsDAO.js"

export default class ReviewsController {
  
  static async apiPostReview(req, res, next) {
  
    try {
        const restaurantId = req.body.restaurant_id
        const review = req.body.text
        const userInfo = {
            name: req.body.name,
            _id: req.body.user_id
        }
    const date = new Date()

    const ReviewsResponse = await ReviewsDAO.addReview(
        restaurantId,
        userInfo,
        review,
        date
    ) 
    res.json({ status:"success" })

    } catch(e){
        res.status(500).json({ "error" : "INVALID" })
    }
  
  }

 static async apiUpdateReview(req, res, next) {
     try {
         const reviewId = req.body.review_id
         const text  = req.body.text
         const date = new Date()

         const reviewResponse = await ReviewsDAO.UpdateReview(
             reviewId,
             res.body.user_id,
             text, 
             date
         )
 
         var { error } = reviewResponse
         if(error) {
             res.status(400).json({ error })
         }

         if (reviewResponse.modifiedCount === 0){
             throw new Error(
                 "unable to update review"
             )
         }

     } catch (e) {
         res.status(500).json({ error: e.message })
     }
 }

    static async apiDeleteReview(req, res, next) {
        try{
            const reviewId = res.query._id
            const userId = req.body.user_id
            console.log(reviewId)
            const reviewResponse = await ReviewsDAO.DeleteReview(
                reviewId,
                userId,
            )
            res.json({ status : "success" })
        } catch(e){
            res.status(500).json({ error: e.message })
        }
    }

}