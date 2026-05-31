import { Room } from '../models/Room.model.js';
import { Allocation } from '../models/Allocation.model.js';

// @desc    Provision a new physical room asset
// @route   POST /api/v1/rooms
// @access  Private / Admin Only
export const createRoom = async (req, res, next) => {
  try {
    const { roomNumber, hostelBlock, floorNumber, capacity, type, facilities } = req.body;

    const existingRoom = await Room.findOne({ hostelBlock, roomNumber });
    if (existingRoom) {
      return res.status(409).json({
        status: 'error',
        message: `Room ${roomNumber} already exists in ${hostelBlock}.`
      });
    }

    const newRoom = await Room.create({
      roomNumber,
      hostelBlock,
      floorNumber,
      capacity: capacity || 2,
      type,
      facilities: facilities || [],
      status: 'Available',
      currentOccupancy: 0
    });

    res.status(201).json({
      status: 'success',
      message: 'Physical room asset added to inventory.',
      data: {
        room: newRoom
      }
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Retrieve rooms inventory with custom filters
// @route   GET /api/v1/rooms
// @access  Private
export const getRooms = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const startIndex = (page - 1) * limit;

    const query = {};

    if (req.query.hostelBlock) {
      query.hostelBlock = new RegExp(req.query.hostelBlock, 'i');
    }

    if (req.query.status) {
      query.status = req.query.status;
    }

    if (req.query.type) {
      query.type = req.query.type;
    }

    // Filter available rooms explicitly
    if (req.query.available === 'true') {
      query.status = 'Available';
      query.$expr = { $lt: ['$currentOccupancy', '$capacity'] };
    }

    const total = await Room.countDocuments(query);

    const rooms = await Room.find(query)
      .skip(startIndex)
      .limit(limit)
      .sort({ hostelBlock: 1, floorNumber: 1, roomNumber: 1 });

    res.status(200).json({
      status: 'success',
      results: rooms.length,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit
      },
      data: {
        rooms
      }
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get complete detail for a specific room asset
// @route   GET /api/v1/rooms/:id
// @access  Private
export const getRoomById = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        status: 'error',
        message: 'Room asset not found.'
      });
    }

    // Fetch active residents currently occupying beds in this room
    const activeAllocations = await Allocation.find({ room: room._id, status: 'Active' })
      .populate({
        path: 'student',
        select: 'enrollmentNumber course gender user',
        populate: {
          path: 'user',
          select: 'firstName lastName phone email'
        }
      });

    res.status(200).json({
      status: 'success',
      data: {
        room,
        activeResidents: activeAllocations
      }
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Modify operational status or structural parameters
// @route   PATCH /api/v1/rooms/:id
// @access  Private / Admin & Warden
export const updateRoomStatus = async (req, res, next) => {
  try {
    const { status, facilities, capacity } = req.body;
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ status: 'error', message: 'Room asset not found.' });
    }

    if (status) {
      // Validate transition rules
      if (status === 'Maintenance' && room.currentOccupancy > 0) {
        return res.status(400).json({
          status: 'error',
          message: 'Cannot place room into Maintenance while active student residents are allocated.'
        });
      }
      room.status = status;
    }

    if (facilities) room.facilities = facilities;
    
    if (capacity) {
      if (capacity < room.currentOccupancy) {
        return res.status(400).json({
          status: 'error',
          message: 'New capacity ceiling cannot be less than the current active occupancy count.'
        });
      }
      room.capacity = capacity;
      // Re-evaluate full state
      if (room.currentOccupancy >= room.capacity) {
        room.status = 'Full';
      } else if (room.status === 'Full') {
        room.status = 'Available';
      }
    }

    const updatedRoom = await room.save();

    res.status(200).json({
      status: 'success',
      message: 'Room specifications updated.',
      data: {
        room: updatedRoom
      }
    });

  } catch (error) {
    next(error);
  }
};
