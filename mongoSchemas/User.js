// module.exports = db.createCollection("users", {
//   validator: {
//     $jsonSchema: {
//       bsonType: "object",
//       required: ["name", "email", "password"],
//       additionalProperties: false,
//       properties: {
//         name: {
//           bsonType: "string",
//           pattern: "/[a-zA-z]/"
//         },
//         email: {
//           bsonType: "string"
//         },
//         password: {
//           bsonType: "string"
//         }
//       }
//     }
//   }
// });

module.exports = db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "email", "password"],
      additionalProperties: false,
      properties: {
        _id: {
          bsonType: "objectId"
        },
        name: {
          bsonType: "string"
        },
        username: {
          bsonType: "string"
        },
        email: {
          bsonType: "string"
        },
        password: {
          bsonType: "string",
          minLength: 6
        },
        verification: {
          bsonType: "bool"
        },
        verificationCode: {
          bsonType: "string"
        }
      }
    }
  }
});
