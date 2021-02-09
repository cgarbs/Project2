const mongoose = require("mongoose");

require("../configs/db.config");

const Job = require("../models/Job.model");

const jobs = [
  { name: "Wedding Photographer" },
  { name: "Wedding Videographer" },
  { name: "Commerical Photographer" },
  { name: "Commerical Videographer" },
  { name: "Portrait Photographer" },
  { name: "Lifestyle Photographer" },
  { name: "Lifestyle Videographer" },
  { name: "Sports Photographer" },
  { name: "Sports Cameraman" },
  { name: "Animal Photographer" },
  { name: "Product Photographer" },
  { name: "Photojournalist" },
];

Job.create(jobs)
  .then((jobsFromDB) => {
    console.log(`Successfully added ${jobsFromDB.length} to the database.`);
    console.log({ jobsFromDB });
    mongoose.connection.close();
  })
  .catch((err) => console.log(`Error occurred - seeding unsuccessful: ${err}`));
