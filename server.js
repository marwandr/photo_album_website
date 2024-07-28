const sqlite = require("sqlite3").verbose();
let db = my_database("./media.db");

var express = require("express");
const cors = require("cors");
var app = express();

app.use(express.json());
app.use(cors());

// GET request
app.get("/hello", function (req, res) {
  response_body = { Hello: "World" };

  res.json(response_body);
});

// Create a new entry
app.post("/api/photoAlbum", function (req, res) {
  db.run(
    `INSERT INTO media (name, year, genre, poster, description)
   VALUES (?, ?, ?, ?, ?)`,
    [
      req.body.name,
      req.body.year,
      req.body.genre,
      req.body.poster,
      req.body.description,
    ],
    function (error, result) {
      if (error) {
        console.error("Error inserting entry:", error);
        const status = error.message.includes("unique constraint violation")
          ? 400
          : 500;

        return res.status(status).json({
          error: status === 400 ? "Bad Request" : "Internal Server Error",
          message: error.message,
        });
      }
      res.status(201).json(result);
    }
  );
});

// Reset Database
app.get("/api/photoAlbum/reset", function (req, res) {
  db.run("DELETE FROM media", function (err) {
    if (err) {
      console.error("Error deleting entries:", err);
      return res.status(500).json({
        error: "Internal Server Error",
        message: "Error deleting entries",
      });
    }
    if (this.changes > 0) {
      // Insert default entries
      db.run(
        `INSERT INTO media (name, year, genre, poster, description) VALUES (?, ?, ?, ?, ?),
         (?, ?, ?, ?, ?)`,
        [
          "Dragon Ball Z",
          "1996",
          "animation, action, adventure, tv-show",
          "https://m.media-amazon.com/images/M/MV5BNGM5MTEyZDItZWNhOS00NzNkLTgwZTAtNWIzY2IzZmExOWMxXkEyXkFqcGdeQXVyNTA4NzY1MzY@._V1_FMjpg_UX1000_.jpg",
          "With the help of the powerful Dragonballs, a team of fighters led by the saiyan warrior Goku defend the planet earth from extraterrestrial enemies.",
          "Metal Gear Rising: Revengeance",
          "2013",
          "video-game, stealth, hack-and-slash, action, adventure",
          "https://mir-s3-cdn-cf.behance.net/project_modules/fs/345cab52436845.5608df1b2f1ac.jpg",
          "Metal Gear Rising: Revengeance is a hack and slash beat 'em up in which Raiden faces off against cyborg soldiers and UGs (Unmanned Gears, drone vehicles) in a variety of environments.",
        ],
        function (err) {
          if (err) {
            console.error("Error inserting default entries:", err);
            return res.status(500).json({
              error: "Internal Server Error",
              message: "Error inserting default entries",
            });
          }
          res.status(200).json({ message: "Database reset successfully!" });
        }
      );
    } else {
      return res
        .status(404)
        .json({ error: "Not Found", message: "No entries found" });
    }
  });
});

// Retrieve all data
app.get("/api/photoAlbum", function (req, res) {
  db.all("SELECT * FROM media", function (err, rows) {
    if (err) {
      console.error("Error executing database query:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res.setHeader("Content-Type", "application/json");
    if (rows && rows.length > 0) {
      // Return db response as JSON
      return res.status(200).json(rows);
    } else {
      return res.status(404).json({ error: "Not Found" });
    }
  });
});

// Retrieve a certain entry
app.get("/api/photoAlbum/:id", function (req, res) {
  let id = parseInt(req.params.id);
  db.all("SELECT * FROM media WHERE id=" + id, function (err, rows) {
    if (err) {
      console.error("Error executing database query:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res.setHeader("Content-Type", "application/json");
    if (rows && rows.length > 0) {
      // Return db response as JSON
      return res.status(200).json(rows);
    } else {
      return res.status(404).json({ error: "Not Found" });
    }
  });
});

// Update an entry
app.put("/api/photoAlbum/:id", function (req, res) {
  let id = parseInt(req.params.id);
  db.run(
    `UPDATE media
      SET name=?, year=?, genre=?, poster=?,
      description=? WHERE id=?`,
    [
      req.body.name,
      req.body.year,
      req.body.genre,
      req.body.poster,
      req.body.description,
      id,
    ],
    function (err) {
      if (err) {
        console.error("Error updating entry:", err);

        const status = err.message.includes("not found") ? 404 : 500;

        return res.status(status).json({
          error: status === 404 ? "Not Found" : "Internal Server Error",
          message: err.message,
        });
      }
      res.status(204).json({ message: "Entry updated successfully" });
    }
  );
});

// Delete an entry
app.delete("/api/photoAlbum/:id", function (req, res) {
  let id = parseInt(req.params.id);
  db.run("DELETE FROM media WHERE id =?", [id], function (err, result) {
    if (err) {
      console.error("Error deleting entry:", err);
      return res
        .status(500)
        .json({ error: "Internal Server Error", message: err.message });
    }
    if (result && result.changes > 0) {
      return res.status(204).json({ message: "Entry successfully deleted." });
    } else {
      return res.status(404).json({ error: "Not Found" });
    }
  });
});

// This route responds to http://localhost:3000/db-example by selecting some data from the
// database and return it as JSON object.

app.get("/db-example", function (req, res) {
  db.all(`SELECT * FROM media WHERE name=?`, ["Metal Gear Rising: Revengeance"], function (err, rows) {
    if (err) {
      console.error("Error executing database query:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res.setHeader("Content-Type", "application/json");

    if (rows && rows.length > 0) {
      // Return db response as JSON
      return res.json(rows);
    } else {
      return res.status(404).json({ error: "Not Found" });
    }
  });
});

app.post("/post-example", function (req, res) {
  // This is just to check if there is any data posted in the body of the HTTP request:
  console.log(req.body);
  return res.json(req.body);
});

// ###############################################################################
// This should start the server, after the routes have been defined, at port 3000:

app.listen(3000);
console.log(
  "Your Web server should be up and running, waiting for requests to come in. Try http://localhost:3000/hello"
);

function my_database(filename) {
  // Connect to db by opening filename, create filename if it does not exist:
  var db = new sqlite.Database(filename, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log("Connected to the media database.");
  });
  // Create media table if it does not exist already:
  db.serialize(() => {
    db.run(`
        	CREATE TABLE IF NOT EXISTS media
        	 (
                    id INTEGER PRIMARY KEY,
                    name CHAR(100) NOT NULL,
                    year CHAR(100) NOT NULL,
                    genre CHAR(256) NOT NULL,
                    poster char(2048) NOT NULL,
                    description CHAR(1024) NOT NULL
		 )
		`);
    db.all(`select count(*) as count from media`, function (err, result) {
      if (result[0].count == 0) {
        db.run(
          `INSERT INTO media (name, year, genre, poster, description) VALUES (?, ?, ?, ?, ?)`,
          [
            "Dragon Ball Z",
            "1996",
            "animation, action, adventure, tv-show",
            "https://m.media-amazon.com/images/M/MV5BNGM5MTEyZDItZWNhOS00NzNkLTgwZTAtNWIzY2IzZmExOWMxXkEyXkFqcGdeQXVyNTA4NzY1MzY@._V1_FMjpg_UX1000_.jpg",
            "With the help of the powerful Dragonballs, a team of fighters led by the saiyan warrior Goku defend the planet earth from extraterrestrial enemies.",
          ]
        );
        db.run(
          `INSERT INTO media (name, year, genre, poster, description) VALUES (?, ?, ?, ?, ?)`,
          [
            "Metal Gear Rising: Revengeance",
            "2013",
            "video-game, stealth, hack-and-slash, action, adventure",
            "https://mir-s3-cdn-cf.behance.net/project_modules/fs/345cab52436845.5608df1b2f1ac.jpg",
            "Metal Gear Rising: Revengeance is a hack and slash beat 'em up in which Raiden faces off against cyborg soldiers and UGs (Unmanned Gears, drone vehicles) in a variety of environments.",
          ]
        );
        console.log("Inserted dummy photo entry into empty database");
      } else {
        console.log(
          "Database already contains",
          result[0].count,
          " item(s) at startup."
        );
      }
    });
  });
  return db;
}
