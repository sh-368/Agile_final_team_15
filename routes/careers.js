const express = require("express");
const router = express.Router();

// Route for Careers page
    router.get("/", async (req, res) => {
        try {
    
            res.render("careers");
        } catch (error) {
            console.error("Error rendering Careers page:", error.message);
            
            // Fail gracefully 
                res.render("homepage");
        }
    });

module.exports = router;