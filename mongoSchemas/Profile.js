// module.exports = db.createCollection("profiles", {
//   validator: {
//     $jsonSchema: {
//       bsonType: "object",
//       required: ["handle"],
//       properties: {
//         user_id: {
//           bsonType: "object"
//         },
//         handle: {
//           bsonType: "string"
//         },
//         gender: {
//           bsonType: "string"
//         },
//         sexPreferences: {
//           bsonType: "string"
//         },
//         biography: {
//           bsonType: "string"
//         },
//         interests: {
//           bsonType: "array"
//         },
//         pictures: {
//           bsonType: "array",
//           maxItems: 4
//         }
//       }
//     }
//   }
// });

module.exports = db.createCollection("profiles", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["handle"],
      additionalProperties: false,
      properties: {
        _id: {
          bsonType: "objectId"
        },
        user: {
          bsonType: "objectId"
        },
        handle: {
          bsonType: "string"
        },
        status: {
          bsonType: "string"
        },
        skills: {
          bsonType: "string"
        },
        social: {
          bsonType: "string"
        },
        experience: {
          bsonType: "array"
        },
        education: {
          bsonType: "array"
        },
        website: {
          bsonType: "string"
        },
        bio: {
          bsonType: "string"
        },
        company: {
          bsonType: "string"
        },
        githubusername: {
          bsonType: "string"
        },
        location: {
          bsonType: "string"
        }
      }
    }
  }
});
