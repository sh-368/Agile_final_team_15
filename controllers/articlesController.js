const axios = require("axios");

class articlesController {
    constructor(){};

    static async getArticles(articleQuery, articleQuantity){
        const customSearchGoogle = 'https://www.googleapis.com/customsearch/v1?';
        const customSearchGoogleAPIkey = 'key=AIzaSyBhlxX31WzlwSGb7f_nUE_66nS8Om1cHfk&cx=45abaafd207d64245';
        const customSearchGoogleEngineID = 'cx=45abaafd207d64245';
        const customSearchGoogleQuery = 'q=' + articleQuery;
        const customSearchGoogleResultQuantity = 'num=' + articleQuantity;
        const searchResults = await axios.get(customSearchGoogle 
            + '&' + customSearchGoogleAPIkey 
            + '&' + customSearchGoogleEngineID
            + '&' + customSearchGoogleQuery
            + '&' + customSearchGoogleResultQuantity
            ); 
        
        console.log(searchResults);    
    }

    
}

module.exports = {articlesController};