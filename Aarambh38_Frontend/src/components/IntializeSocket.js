const socket = require("socket.io");
const ModelMessage = require("../models/ModelMessage");
const GroupMessage = require("../models/GroupMessage"); // ✅ NEW
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
    /* ================================
       EXISTING 1–TO–1 CHAT (UNCHANGED)
    ================================= */

    socket.on("joinchat", ({ fromuserId, targetuserId }) => {
      const RoomId = [fromuserId, targetuserId].sort().join("_");
      socket.join(RoomId);
    });

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

          // image upload
          if (messageType === "image" && image) {
            const result = await cloudinary.uploader.upload(image);
            imageUrl = result.secure_url;
          }

          // document upload
          if (messageType === "file" && document) {
            if (/^https?:\/\//.test(document)) {
              documentUrl = document;
            } else {
              const filenameWithoutExt = path.basename(
                originalFilename,
                path.extname(originalFilename)
              );
              const extension = path.extname(originalFilename) || ".pdf";
              const publicId = `chat_files/${Date.now()}_${filenameWithoutExt}${extension}`;

              const docResult = await cloudinary.uploader.upload(document, {
                resource_type: "raw",
                public_id: publicId,
              });

              documentUrl = docResult.secure_url;
            }
          }

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

          if (findId === "student") message.studentreaded = "YES";
          else message.alumnireaded = "YES";

          await message.save();

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
          socket.emit("messageError", { error: "Message not saved" });
        }
      }
    );

    /* ================================
       ✅ GROUP CHAT (NEW – ADDED)
    ================================= */

    // join group room
    socket.on("joingroup", ({ groupId }) => {
      socket.join(groupId);
    });

    // send group message
    socket.on(
      "sendgroupmessage",
      async ({
        groupId,
        senderId,
        text = "",
        image = "",
        document = "",
        messageType = "text",
        originalFilename = "",
      }) => {
        try {
          let imageUrl = "";
          let documentUrl = "";

          if (messageType === "image" && image) {
            const result = await cloudinary.uploader.upload(image);
            imageUrl = result.secure_url;
          }

          if (messageType === "file" && document) {
            if (/^https?:\/\//.test(document)) {
              documentUrl = document;
            } else {
              const filenameWithoutExt = path.basename(
                originalFilename,
                path.extname(originalFilename)
              );
              const extension = path.extname(originalFilename) || ".pdf";
              const publicId = `group_files/${Date.now()}_${filenameWithoutExt}${extension}`;

              const docResult = await cloudinary.uploader.upload(document, {
                resource_type: "raw",
                public_id: publicId,
              });

              documentUrl = docResult.secure_url;
            }
          }

          const groupMessage = await GroupMessage.create({
            groupId,
            senderId,
            text,
            image: imageUrl,
            document: documentUrl,
            originalFilename,
            messageType,
          });

          io.to(groupId).emit("groupMessageReceived", {
            _id: groupMessage._id,
            groupId,
            senderId,
            text,
            image: imageUrl,
            document: documentUrl,
            originalFilename,
            messageType,
            createdAt: groupMessage.createdAt,
          });
        } catch (err) {
          socket.emit("groupMessageError", {
            error: "Group message not saved",
          });
        }
      }
    );

    socket.on("disconnect", () => {});
  });
};

module.exports = IntializeSocket;
