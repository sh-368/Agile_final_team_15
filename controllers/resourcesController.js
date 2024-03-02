const articlesController = require("../controllers/articlesController");

class resourcesController{
    
    static async preLoadResources(){
        const articles = articlesController.getArticles;
        console.log(articles);
    }

}

module.exports = resourcesController;