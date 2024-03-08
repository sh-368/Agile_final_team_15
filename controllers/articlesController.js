const axios = require("axios");
const cheerio = require("cheerio");

const googleCustomSearchApiKey = process.env.GOOGLE_API_KEY;
const googleCustomSearchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID;

class articlesController {
  constructor() {}

  static async getArticles(articleQuery, articleQuantity, dateRange) {
    const customSearchGoogle = "https://www.googleapis.com/customsearch/v1?";
    const customSearchGoogleAPIkey = "key=" + googleCustomSearchApiKey;
    const customSearchGoogleEngineID = "cx=" + googleCustomSearchEngineId;
    const customSearchGoogleQuery = "q=" + articleQuery;
    const customSearchGoogleResultQuantity = "num=" + articleQuantity;
    const customSearchGoogleResultDateRange = "dateRestrict=d" + dateRange;

    const searchResults = await axios.get(
      customSearchGoogle +
        customSearchGoogleAPIkey +
        "&" +
        customSearchGoogleEngineID +
        "&" +
        customSearchGoogleQuery +
        "&" +
        customSearchGoogleResultQuantity +
        "&" +
        customSearchGoogleResultDateRange
    );

    try {
      return this.#constructArticlesObject(searchResults.data.items);
    } catch (error) {
      console.log(error);
      return;
    }
  }

  static async loadArticlesPage(req, res, next) {
    try {
      const latestArticlesGoogle = await articlesController.getArticles(
        "*",
        10,
        90
      );
      res.render("reader-articles", { latestArticlesGoogle });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  static #constructArticlesObject(articlesData) {
    let articlesList = [];
    for (let i = 0; i < articlesData.length; i++) {
      let article = {
        title: articlesData[i].title,
        subtitle: articlesData[i].snippet,
        content: articlesData[i].link,
        likes: 0,
        views: 0,
        commentCount: 0,
        link: articlesData[i].link,
        imageUrl: articlesData[i].pagemap.cse_thumbnail[0].src,
        author_id: 1,
        article_id: 1,
      };

      articlesList.push(article);
    }

    return articlesList;
  }
}

module.exports = articlesController;
