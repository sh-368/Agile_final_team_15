const express = require("express");
const router = express.Router();

// Route for tools page
    router.get("/", async (req, res) => {
        try {
    
            res.render("tools");
        } catch (error) {
            console.error("Error rendering Tools page:", error.message);
            
            // Fail gracefully 
                res.render("homepage");
        }
    });

module.exports = router;