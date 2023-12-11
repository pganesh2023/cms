const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const facilityRoutes = require("./routes/facilityRoutes");
const authRoutes = require("./routes/authRoutes");
const facilityAdminRoutes = require("./routes/facilityAdminRoutes");
const childrenRoutes = require("./routes/childrenRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
const parentRoutes = require("./routes/parentRoutes");

const { scheduleWeeklyCharges } = require("./tasks");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use("/api/auth", authRoutes);
app.use("/api/facilities", facilityRoutes);
app.use("/api/facility/admin", facilityAdminRoutes);
app.use("/api", childrenRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/parent", parentRoutes)

scheduleWeeklyCharges();

const _dirname = path.dirname("");
const buildPath = path.join(_dirname, "../client/build");

app.use(express.static(buildPath));

app.get("/*", function (req, res) {
  res.sendFile(
    path.join(__dirname, "../client/build/index.html"),
    function (err) {
      if (err) {
        res.status(500).send(err);
      }
    }
  );
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
