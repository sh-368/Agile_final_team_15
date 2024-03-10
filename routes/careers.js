const express = require("express");
const router = express.Router();

const itemsPerPage = 10;

// Sample static jobs data
const staticJobs = [
  {
    title: "Software Engineer",
    company: "Tech Co",
    location: "City A",
    type: "Full-time",
    description:
      "Join us as a software engineer and help build amazing products.",
    url: "https://www.indeed.com/rc/clk?jk=f63b9a02a9117ae8&bb=l1JDpfKU6mOSFOQlGdKqVV2UTntNDTlmOUya7o2uFZ6FqEAdd5yxZqQLljXVHOLs7hWsMpCSWJuhaW1JHMcT19_j2wqF4S87xfN0USmxXb9nE-Q8mt4zOw%3D%3D&xkcb=SoBT67M3DULaNWRcAZ0ObzkdCdPP&fccid=fefd75f5326e1589&vjs=3",
  },
  {
    title: "UX Designer",
    company: "Design Studio",
    location: "City B",
    type: "Contract",
    description:
      "We are looking for a talented UX designer to create beautiful user interfaces.",
    url: "https://www.indeed.com/rc/clk?jk=d2316b242cf9d2f2&bb=0cqu6J4nkt44hqnoB3-oqxGUzu3DRopvrcbHcMq_sSjDYyApwWBXq52rO_xOhnXlJAqTdRHKJ7Qjk2vntJHAMVk4QByCnHoeCi3OS1ZmFn8%3D&xkcb=SoAS67M3DULCdzWajZ0DbzkdCdPP&fccid=d4523cf5aad321fc&vjs=3",
  },
  {
    title: "Data Scientist",
    company: "Data Insights Inc.",
    location: "City C",
    type: "Full-time",
    description:
      "Seeking a skilled data scientist to analyze and interpret complex datasets.",
    url: "https://www.indeed.com/rc/clk?jk=8d3a71cfbf3d6a7c&bb=m0eEBab0KDFh7T4E8F5Mqj2UTntNDTlmOUya7o2uFZ5hzBb3jA-KutONwXYiH_ziQ7p3fQxKPrPgRHR-MJ9eFzHrRFoJ6Y1-f9uVpO8PMEw%3D&xkcb=SoAS67M3DULCdzWajZ0DbzkdCdPP&fccid=3b5a4bbf1e3eae7d&vjs=3",
  },
  {
    title: "Frontend Developer",
    company: "Web Solutions Co.",
    location: "City D",
    type: "Contract",
    description:
      "Join our frontend development team and contribute to cutting-edge web applications.",
    url: "https://www.indeed.com/rc/clk?jk=6f8f5ed8c3f30b78&bb=L2EVyAqYtYFh6hKMqrBYa5bOQHoa1OqkfWU69F7yX6e9m4sR-qf7wZw-9d0wAKcOUIauhFqU6p6Bv0cfI6gSVz-NSH8kYovSLwM3Sj9c-Q&xkcb=SoAS67M3DULCdzWajZ0DbzkdCdPP&fccid=2891505de5da50ee&vjs=3",
  },
];

router.get("/", async (req, res) => {
  try {
    const page = req.query.page || 1;
    const startIdx = (page - 1) * itemsPerPage;
    const endIdx = startIdx + itemsPerPage;

    // Sample logic to paginate through static jobs data
    const jobs = staticJobs.slice(startIdx, endIdx);

    // Render the careers view with job data and pagination info
    res.render("careers", { jobs, currentPage: page, itemsPerPage });
  } catch (error) {
    console.error("Error fetching job data:", error.message);
    // Handle the error and render an appropriate response
    res.render("error", { message: "Error fetching job data" });
  }
});

module.exports = router;
