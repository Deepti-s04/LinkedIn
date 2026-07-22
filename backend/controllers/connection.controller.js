import Connection from "../models/connection.model.js";
import User from "../models/user.model.js";
import { io, userSocketMap } from "../index.js";
import Notification from "../models/notification.model.js";
export const sendConnection = async (req, res) => {
  try {
    let { id } = req.params;
    let sender = req.userId;
    let user = await User.findById(sender);
    if (sender == id) {
      return res
        .status(400)
        .json({ message: "You can not send request to yourself" });
    }
    if (user.connection.includes(id)) {
      return res.status(400).json({ message: "You are already connected" });
    }
    let existingConnection = await Connection.findOne({
      sender,
      receiver: id,
      status: "pending",
    });
    if (existingConnection) {
      return res.status(400).json({ message: "request already exist" });
    }
    let newRequest = await Connection.create({
      sender,
      receiver: id,
    });

    let receiverSocketId = userSocketMap.get(id);
    let senderSocketId = userSocketMap.get(sender);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("statusUpdate", {
        updatedUserId: sender,
        newStatus: "received",
      });
    }
    if (senderSocketId) {
      io.to(senderSocketId).emit("statusUpdate", {
        updatedUserId: id,
        newStatus: "pending",
      });
    }

    return res.status(200).json(newRequest);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const acceptConnection = async (req, res) => {
  try {
    let { connectionId } = req.params;
    let connection = await Connection.findById(connectionId);
    if (!connection) {
      return res.status(400).json({ message: "connection doesnt exist" });
    }
    if (connection.status != "pending") {
      return res.status(400).json({ message: "request under process" });
    }
    connection.status = "accepted";
    let notification = await Notification.create({
      receiver: connection.sender,
      type: "connectionAccepted",
      relatedUser: req.userId,
      
    });
    await connection.save();
    await User.findByIdAndUpdate(req.userId, {
      $addToSet: { connection: connection.sender._id },
    });
    await User.findByIdAndUpdate(connection.sender._id, {
      $addToSet: { connection: req.userId },
    });
    let receiverSocketId = userSocketMap.get(
      connection.receiver._id.toString(),
    );
    let senderSocketId = userSocketMap.get(connection.sender._id.toString());

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("statusUpdate", {
        updatedUserId: connection.sender._id,
        newStatus: "disconnect",
      });
    }
    if (senderSocketId) {
      io.to(senderSocketId).emit("statusUpdate", {
        updatedUserId: req.userId,
        newStatus: "disconnect",
      });
    }
    return res.status(200).json({ message: "Accepted " });
  } catch (error) {
    return res.status(500).json({ message: "Connection failed " });
  }
};

export const rejectConnection = async (req, res) => {
  try {
    let { connectionId } = req.params;
    let connection = await Connection.findById(connectionId);
    if (!connection) {
      return res.status(400).json({ message: "connection doesnt exist" });
    }
    if (connection.status != "pending") {
      return res.status(400).json({ message: "request under process" });
    }
    connection.status = "rejected";
    await connection.save();

    return res.status(200).json({ message: "rejected " });
  } catch (error) {
    return res.status(500).json({ message: "rejection failed " });
  }
};

export const getConnectionStatus = async (req, res) => {
  try {
    const targetuserId = req.params.userId;
    const currentuserId = req.userId;
    let currentUser = await User.findById(currentuserId);
    if (currentUser.connection.includes(targetuserId)) {
      return res.json({ status: "disconnect" });
    }

    const pendingRequest = await Connection.findOne({
      $or: [
        { sender: currentuserId, receiver: targetuserId },
        { sender: targetuserId, receiver: currentuserId },
      ],
      status: "pending",
    });

    if (pendingRequest) {
      if (pendingRequest.sender.toString() === currentuserId.toString()) {
        return res.json({ status: "pending" });
      } else {
        return res.json({ status: "received", requestId: pendingRequest._id });
      }
    }
    return res.json({ status: "Connect" });
  } catch (error) {
    return res.status(500).json({ message: "getConnectionStatus error" });
  }
};

export const removeConnection = async (req, res) => {
  try {
    const myId = req.userId;
    const otherUserId = req.params.userId;

    await User.findByIdAndUpdate(myId, { $pull: { connection: otherUserId } });
    await User.findByIdAndUpdate(otherUserId, { $pull: { connection: myId } });

    let receiverSocketId = userSocketMap.get(otherUserId);
    let senderSocketId = userSocketMap.get(myId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("statusUpdate", {
        updatedUserId: myId,
        newStatus: "connect",
      });
    }
    if (senderSocketId) {
      io.to(senderSocketId).emit("statusUpdate", {
        updatedUserId: otherUserId,
        newStatus: "connect",
      });
    }
    return res.json({ message: "connection removed successfully" });
  } catch (error) {
    return res.status(500).json({ message: "remove connection error" });
  }
};

export const getConnectionRequests = async (req, res) => {
  try {
    const userId = req.userId;
    const requests = await Connection.find({
      receiver: userId,
      status: "pending",
    }).populate(
      "sender",
      "firstname , lastname email username profileImage headline",
    );

    return res.status(200).json(requests);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const getUserConnection = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).populate(
      "connection",
      "firstname lastname username profileImage headline connection",
    );
    return res.status(200).json(user.connection);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
