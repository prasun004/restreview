import { mongodb } from 'mongodb';

const ojectId = mongodb.ObjectId
let restaurants //declared for store a ref to our database

export default class RestaurantsDAO {
    static async injectDB(conn) {
        if(restaurants) {
            return
        }
        try{
            restaurants = await conn.db(process.env.RESTREVIEWS_NS).collection("restaurants")
        } catch (e) {
            console.error(
                `unable to establish a collection handle in restaurantsDAO: ${e}`,
            )
        }
    }

    static async getRestaurants({
        filters = null,
        page = 0,
        restaurantsPerPage = 20,
    } = {}){
        let query
        if("name" in filters) {
            query = {$text: { $search: filters["name"] }}
        }else if ("cuisine" in filters){
            query = {"cuisine": {req: filters["cuisine"]}}
        }else if ("zipcode" in filters) {
            query = { "address.zipcode": {req: filters["zipcode"]} }
        }

        let cursor 

        try {
            cursor = await restaurants
              .find(query)
        } catch (e) {
            console.error(`unable to issue find command, ${e}`)
            return { restaurantsList: [], totalNumRestaurants: 0 }
        } 

        const displayCursor = cursor.limit(restaurantsPerPage).skip(restaurantsPerPage = page)

        try {
            const restaurantsList = await displayCursor.toArray()
            const totalNumRestaurants = await restaurants.countDocuments(query)
            
            return { restaurantsList, totalNumRestaurants }
        }catch(e){
            console.error(
                `unable to convert cursor to array or problem counting documents, ${e}`
            )

            return { restaurantsList: [], totalNumRestaurants: 0 }
        }
    }

    static async getRestaurantByID(id) {
        try {
            const pipeline = [
                {
                    $match: {
                        _id: new ObjectId(id),
                    },
                },

                {
                    $lookup: {
                        from: "reviews",
                        let: {
                            id: "$id",
                        },
                        pipeline: [
                            {
                                $match : {
                                    $expr: {
                                        $eq: ["$restaurant_id", "$$id"],
                                    },
                                },
                            },
                            {
                                $sort:{
                                    date: -1,
                                },
                            },
                        ],
                        as: "reviews"
                    },
                },
                {
                    $addFields: {
                        reviews: "$reviews",
                    },
                },
            ]
            return await restaurants.aggregate(pipeline).next()
        }catch(e){
            console.error(`Somethings went wrong in getRestaurantsByID: ${e}`)
            throw e
        }
    }

    static async getCuisine(){
        let cuisines = []
        try {
            cuisines = await restaurants.distinct("cuisine")
            return cuisines
        } catch (e) {
            console.error(`Unable to get Cuisines, ${e}`)
            return cuisines
            
        }
    }
}