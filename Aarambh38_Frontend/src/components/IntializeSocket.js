const socket = require("socket.io");
const ModelMessage = require("../models/ModelMessage");
const BASE_URL = require("../constants/ALLURL");
const { cloudinary } = require("./cloudinary");
const path = require("path");

const IntializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: BASE_URL,
      credentials: true,
    },
    maxHttpBufferSize: 1e7,
  });

  io.on("connection", (socket) => {

    // =====================================
    // PRIVATE CHAT JOIN (1-to-1)
    // =====================================
    socket.on("joinchat", ({ fromuserId, targetuserId }) => {
      const roomId = [fromuserId, targetuserId].sort().join("_");
      socket.join(roomId);
    });

    // =====================================
    // PRIVATE MESSAGE (1-to-1)
    // =====================================
    socket.on("sendmessage", async (payload) => {
      try {
        const {
          fromuserId,
          targetuserId,
          text = "",
          image = "",
          document = "",
          messageType = "text",
          originalFilename = "",
          messageId,
        } = payload;

        const roomId = [fromuserId, targetuserId].sort().join("_");

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
            const extension = path.extname(originalFilename) || ".pdf";

            const upload = await cloudinary.uploader.upload(document, {
              resource_type: "raw",
              public_id: `chat_files/${Date.now()}_${filenameWithoutExt}${extension}`,
            });

            documentUrl = upload.secure_url;
          }
        }

        // SAVE MESSAGE
        const message = await ModelMessage.create({
          fromuserId,
          targetuserId,
          text,
          image: imageUrl,
          document: documentUrl,
          originalFilename,
          messageType,
          messageId,
          studentreaded: "NO",
          alumnireaded: "YES",
        });

        // EMIT TO BOTH USERS
        io.to(roomId).emit("messageRecieved", {
          fromuserId,
          targetuserId,
          text,
          image: imageUrl,
          document: documentUrl,
          originalFilename,
          messageType,
          messageId,
          createdAt: message.createdAt,
        });

      } catch (error) {
        console.error("sendmessage error:", error);
        socket.emit("messageError", { error: "Message not saved" });
      }
    });

    // =====================================
    // 🔥 ALUMNI BULK MESSAGE (NEW)
    // =====================================
    socket.on("alumniBulkMessage", async ({ fromuserId, studentIds, text }) => {
      try {
        if (!Array.isArray(studentIds) || studentIds.length === 0) return;

        for (const studentId of studentIds) {
          const roomId = [fromuserId, studentId].sort().join("_");

          const message = await ModelMessage.create({
            fromuserId,
            targetuserId: studentId,
            text,
            messageType: "text",
            studentreaded: "NO",
            alumnireaded: "YES",
          });

          io.to(roomId).emit("messageRecieved", {
            fromuserId,
            targetuserId: studentId,
            text,
            messageType: "text",
            messageId: message._id,
            createdAt: message.createdAt,
          });
        }
      } catch (error) {
        console.error("Bulk message error:", error);
        socket.emit("messageError", { error: "Bulk message failed" });
      }
    });

    socket.on("disconnect", () => {});
  });
};

module.exports = IntializeSocket;

