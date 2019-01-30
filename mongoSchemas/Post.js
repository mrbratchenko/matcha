// // module.exports = db.createCollection("posts", {
// //   validator: {
// //     $jsonSchema: {
// //       bsonType: "object",
// //       required: ["text"],
// //       properties: {
// //         user_id: {
// //           bsonType: "object"
// //         },
// //         text: {
// //           bsonType: "string"
// //         },
// //         name: {
// //           bsonType: "string"
// //         },
// //         avatar: {
// //           bsonType: "string"
// //         },
// //         likes: {
// //           bsonType: "object"
// //         },
// //         comments: {
// //           user_id: {
// //             bsonType: "object"
// //           },
// //           bsonType: "object",
// //           properties: {
// //             text: {
// //               bsonType: "string"
// //             },
// //             name: {
// //               bsonType: "string"
// //             },
// //             avatar: {
// //               bsonType: "string"
// //             },
// //             date: {
// //               bsonType: "date",
// //               default: Date.now
// //             }
// //           }
// //         },
// //         date: {
// //           bsonType: "date",
// //           default: Date.now
// //         }
// //       }
// //     }
// //   }
// // });

// module.exports = db.createCollection("posts", {
//   validator: {
//     $jsonSchema: {
//       bsonType: "object",
//       required: ["text"],
//       additionalProperties: false,
//       properties: {
//         _id: {
//           bsonType: "objectId"
//         },
//         text: {
//           bsonType: "string"
//         },
//         name: {
//           bsonType: "string"
//         },
//         avatar: {
//           bsonType: "string"
//         },
//         likes: {
//           bsonType: "array"
//         },
//         comments: {
//           bsonType: "array"
//         },
//         date: {
//           bsonType: "date",
//           default: Date.now
//         }
//       }
//     }
//   }
// });
