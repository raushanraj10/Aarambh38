const socket = require("socket.io");
const ModelMessage = require("../models/ModelMessage");
const BASE_URL = require("../constants/ALLURL");
const { cloudinary } = require("./cloudinary");
const path = require("path");

const IntializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: BASE_URL,
    },
    maxHttpBufferSize: 1e7,
  });

  io.on("connection", (socket) => {

    // ===============================
    // PRIVATE CHAT JOIN (EXISTING)
    // ===============================
    socket.on("joinchat", ({ fromuserId, targetuserId }) => {
      const RoomId = [fromuserId, targetuserId].sort().join("_");
      socket.join(RoomId);
    });

    // ===============================
    // PRIVATE MESSAGE (EXISTING)
    // ===============================
    socket.on(
      "sendmessage",
      async ({
        fromuserId,
        targetuserId,
        findId,
        text = "",
        image = "",
        document = "",
        messageType = "text",
        originalFilename = "",
        repliedtext,
        repliedToId,
        repliedById,
        repliedImage,
        messageId,
        repliedMessageId,
        repliedDocument,
        repliedOriginalFilename,
        repliedToCreatedAt,
      }) => {
        const RoomId = [fromuserId, targetuserId].sort().join("_");

        try {
          let imageUrl = "";
          let documentUrl = "";

          // IMAGE UPLOAD
          if (messageType === "image" && image) {
            const result = await cloudinary.uploader.upload(image);
            imageUrl = result.secure_url;
          }

          // FILE UPLOAD
          if (messageType === "file" && document) {
            if (/^https?:\/\//.test(document)) {
              documentUrl = document;
            } else {
              const filenameWithoutExt = path.basename(
                originalFilename,
                path.extname(originalFilename)
              );
              const extension =
                path.extname(originalFilename) || ".pdf";
              const publicId = `chat_files/${Date.now()}_${filenameWithoutExt}${extension}`;

              const docResult = await cloudinary.uploader.upload(document, {
                resource_type: "raw",
                public_id: publicId,
              });

              documentUrl = docResult.secure_url;
            }
          }

          // SAVE MESSAGE
          const message = new ModelMessage({
            fromuserId,
            targetuserId,
            text,
            image: imageUrl,
            document: documentUrl,
            originalFilename,
            messageType,
            repliedImage,
            messageId,
            repliedMessageId,
            repliedDocument,
            repliedtext,
            repliedById,
            repliedToId,
            repliedToCreatedAt,
          });

          if (findId === "student")
            message.studentreaded = "YES";
          else
            message.alumnireaded = "YES";

          await message.save();

          // EMIT MESSAGE
          io.to(RoomId).emit("messageRecieved", {
            fromuserId,
            targetuserId,
            text,
            messageId,
            image: imageUrl,
            document: documentUrl,
            originalFilename,
            messageType,
            repliedMessageId,
            repliedtext,
            repliedById,
            repliedImage,
            repliedDocument,
            repliedOriginalFilename,
            repliedToId,
            repliedToCreatedAt,
            _id: message._id,
            createdAt: message.createdAt,
          });
        } catch (error) {
          socket.emit("messageError", {
            error: "Message not saved",
          });
        }
      }
    );

    // ===============================
    // 🔥 ALUMNI BULK MESSAGE (NEW)
    // ===============================
    socket.on(
      "alumniBulkMessage",
      async ({ fromuserId, studentIds, text }) => {
        try {
          if (!Array.isArray(studentIds) || studentIds.length === 0) {
            return;
          }

          for (const studentId of studentIds) {
            const RoomId = [fromuserId, studentId].sort().join("_");

            // SAVE MESSAGE FOR EACH STUDENT
            const message = await ModelMessage.create({
              fromuserId,
              targetuserId: studentId,
              text,
              messageType: "text",
              studentreaded: "NO",
              alumnireaded: "YES",
            });

            // REAL-TIME EMIT (IF STUDENT ONLINE)
            io.to(RoomId).emit("messageRecieved", {
              fromuserId,
              targetuserId: studentId,
              text,
              messageType: "text",
              messageId: message._id,
              createdAt: message.createdAt,
            });
          }
        } catch (error) {
          socket.emit("messageError", {
            error: "Bulk message failed",
          });
        }
      }
    );

    socket.on("disconnect", () => {});
  });
};

module.exports = IntializeSocket;
