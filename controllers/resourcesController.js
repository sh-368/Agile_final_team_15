const articlesController = require("../controllers/articlesController");

class resourcesController{
    
    static async preLoadResources(){
        const articles = articlesController.getArticles;
    }

}

module.exports = resourcesController;