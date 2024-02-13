const express = require("express");
const router = express.Router();

// Route for Community page
    router.get("/", async (req, res) => {
        try {
    
            res.render("community");
        } catch (error) {
            console.error("Error rendering Community page:", error.message);
            
            // Fail gracefully 
                res.render("homepage");
        }
    });

module.exports = router;