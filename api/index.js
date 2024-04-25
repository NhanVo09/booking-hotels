const express = require("express");
const cors = require("cors");
const { default: mongoose } = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./models/User.js");
const Place = require("./models/Place.js");
const Booking = require("./models/Booking.js");
const Comment = require("./models/Comment");
const cookieParser = require("cookie-parser");
const imageDownloader = require("image-downloader");
const multer = require("multer");
const fs = require("fs");
const app = express();
require("dotenv").config();

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = "fadswr65wr655wrvf65ae77ar";

app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

mongoose.connect(process.env.MONGO_URL);

app.get("/test", (req, res) => {
  res.json("test, ok");
});
function getUserDataFromReq(req) {
  return new Promise((resolve, reject) => {
    jwt.verify(req.cookies.token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      resolve(userData);
    });
  });
}

app.post("/register", async (req, res) => {
  const { name, email, password, position, approved, request } = req.body;

  try {
    const userDoc = await User.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcryptSalt),
      position,
      approved: false,
      request: null,
    });
    res.json(userDoc);
  } catch (e) {
    res.status(422).json(e);
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const userDoc = await User.findOne({ email });
  if (userDoc) {
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
      jwt.sign(
        { email: userDoc.email, id: userDoc._id },
        jwtSecret,
        {},
        (err, token) => {
          if (err) throw err;
          res.cookie("token", token).json(userDoc);
        }
      );
    } else {
      res.status(422).json("pass not ok");
    }
  } else {
    res.json("not found");
  }
});

app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      const { name, email, _id, approved } = await User.findById(userData.id);

      res.json({ name, email, _id, approved });
    });
  } else {
    res.json(null);
  }
});

app.post("/logout", (req, res) => {
  res.cookie("token", "").json(true);
});

app.post("/upload-by-link", async (req, res) => {
  const { link } = req.body;
  const newName = "photo" + Date.now() + ".jpg";
  await imageDownloader.image({
    url: link,
    dest: __dirname + "/uploads/" + newName,
  });
  res.json(newName);
});

const photosMiddleware = multer({ dest: "uploads/" });
app.post("/upload", photosMiddleware.array("photos", 100), (req, res) => {
  const uploadedFiles = [];
  for (let i = 0; i < req.files.length; i++) {
    const { path, originalname } = req.files[i];
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    const newPath = path + "." + ext;
    fs.renameSync(path, newPath);
    uploadedFiles.push(newPath.replace("uploads", ""));
  }
  res.json(uploadedFiles);
});

app.post("/places", (req, res) => {
  const { token } = req.cookies;
  const {
    title,
    address,
    addedPhoto,
    description,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
    price,
    approved,
  } = req.body;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const placeDoc = await Place.create({
      owner: userData.id,
      title,
      address,
      photo: addedPhoto,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      price,
      approved: false,
    });
    res.json(placeDoc);
  });
});
app.get("/user-places", (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    const { id } = userData;
    res.json(await Place.find({ owner: id }));
  });
});

app.get("/places/:id", async (req, res) => {
  const { id } = req.params;
  res.json(await Place.findById(id));
});
app.put("/places", async (req, res) => {
  const { token } = req.cookies;
  const {
    id,
    title,
    address,
    addedPhoto,
    description,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
    price,
    approved,
  } = req.body;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const placeDoc = await Place.findById(id);
    if (userData.id === placeDoc.owner.toString()) {
      placeDoc.set({
        title,
        address,
        photo: addedPhoto,
        description,
        perks,
        extraInfo,
        checkIn,
        checkOut,
        maxGuests,
        price,
        approved: false,
      });
      await placeDoc.save();
      res.json("ok");
    }
  });
});
app.get("/places", async (req, res) => {
  res.json(await Place.find());
});

app.patch("/places/:id", async (req, res) => {
  const { token } = req.cookies;
  const { approved, request } = req.body;

  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) {
      res.status(401).send("Invalid token.");
    } else {
      try {
        await Place.findByIdAndUpdate(req.params.id, { approved, request });
        res.json({ message: "Place status updated successfully." });
      } catch (error) {
        res
          .status(500)
          .json({ message: "Error updating place status.", error });
      }
    }
  });
});

app.delete("/places/:id", async (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) {
      res.status(401).send("Invalid token.");
    } else {
      try {
        await Place.findByIdAndDelete(req.params.id);
        res.status(204).send();
      } catch (error) {
        res.status(500).json({ message: "Error deleting place.", error });
      }
    }
  });
});

app.post("/bookings", async (req, res) => {
  const userData = await getUserDataFromReq(req);
  const { place, checkIn, checkOut, numberOfGuests, name, phone, room, price } =
    req.body;
  Booking.create({
    place,
    checkIn,
    checkOut,
    numberOfGuests,
    name,
    room,
    phone,
    price,
    pay:null,
    cancel:null,
    user: userData.id,
  })
    .then((doc) => {
      res.json(doc);
    })
    .catch((err) => {
      throw err;
    });
});

app.get("/bookings", async (req, res) => {
  const userData = await getUserDataFromReq(req);
  res.json(await Booking.find({ user: userData.id }).populate("place"));
});
app.patch("/bookings/:id", async (req, res) => {
  const { token } = req.cookies;
  const { pay, cancel } = req.body;

  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) {
      res.status(401).send("Invalid token.");
    } else {
      try {
        await Booking.findByIdAndUpdate(req.params.id, { pay, cancel });
      } catch (error) {
        res
          .status(500)
          .json({ message: "Error updating place status.", error });
      }
    }
  });
});
app.get("/bookings/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const booking = await Booking.findById(id).populate("place");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json(booking);
  } catch (error) {
    console.error("Error fetching booking:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
app.get("/owners-places-bookings", async (req, res) => {
  try {
    const bookings = await Booking.find().populate("place").populate("user");

    const ownersPlacesBookings = [];

    for (const booking of bookings) {
      const owner = await User.findById(booking.place.owner);

      ownersPlacesBookings.push({
        owner: {
          id: owner._id,
          name: owner.name,
          email: owner.email,
        },
        place: booking.place,
        booking,
      });
    }

    res.json(ownersPlacesBookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/places", async (req, res) => {
  const { search } = req.query;
  try {
    let query = {};
    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { address: { $regex: search, $options: "i" } },
        ],
      };
    }
    const places = await Place.find(query);
    res.status(200).json(places);
  } catch (error) {
    res.status(500).json({ message: "Error fetching places", error });
  }
});

app.get("/comments/:place", async (req, res) => {
  const comments = await Comment.find({ place: req.params.place }).populate(
    "user",
    "name"
  );
  res.json(comments);
});

// Endpoint để đăng bình luận
app.post("/comments", async (req, res) => {
  const { token } = req.cookies;
  const { content, place } = req.body;

  if (!token) {
    return res.status(401).send("Access denied. No token provided.");
  }

  jwt.verify(token, jwtSecret, async (err, userData) => {
    if (err) {
      return res.status(401).send("Invalid token.");
    }

    try {
      const newComment = await Comment.create({
        content,
        place: place,
        user: userData.id,
      });
      res.status(201).json(newComment);
    } catch (error) {
      res.status(400).json({ message: "Error posting comment", error });
    }
  });
});
app.get("/comments", async (req, res) => {
  const comments = await Comment.find().populate("user", "name");
  res.json(comments);
});
app.delete("/comments/:id", async (req, res) => {
  try {
    await Comment.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Error deleting comment.", error });
  }
});
//ADMIN
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
});
app.patch("/users/:id", async (req, res) => {
  const { token } = req.cookies;
  const { approved, request } = req.body;

  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) {
      res.status(401).send("Invalid token.");
    } else {
      try {
        await User.findByIdAndUpdate(req.params.id, { approved, request });
        res.json({ message: "User status updated successfully." });
      } catch (error) {
        res.status(500).json({ message: "Error updating User status.", error });
      }
    }
  });
});
app.delete("/users/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
});


app.listen(3000);
