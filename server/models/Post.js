// const mongoose = require('mongoose');

// const postSchema = new mongoose.Schema(
//   {
//     title: String,
//     imageUrl: String,
//     description: String,
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//     },
//     comments: [
//       {
//         text: String,
//         user: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: 'User',
//         },
//         createdAt: {
//           type: Date,
//           default: Date.now,
//         },
//       },
//     ],
//     likes: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User',
//       },
//     ],
//   },
//   { timestamps: true }
// );

// // ✅ Safe export to prevent OverwriteModelError
// module.exports = mongoose.models.Post || mongoose.model('Post', postSchema);
